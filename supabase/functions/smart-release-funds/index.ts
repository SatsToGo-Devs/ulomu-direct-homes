
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      transaction_id, 
      transaction_reference,
      release_type, 
      evidence_urls = [], 
      satisfaction_rating,
      completion_notes,
      recipient_email 
    } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user) throw new Error("User not authenticated");

    console.log("Processing smart release for transaction:", transaction_id);

    // Get transaction details with related data
    const { data: transaction, error: fetchError } = await supabaseClient
      .from('escrow_transactions')
      .select(`
        *,
        escrow_accounts!inner(*)
      `)
      .eq('id', transaction_id)
      .single();

    if (fetchError) throw fetchError;

    // Verify PayStack transaction if reference provided
    if (transaction_reference) {
      const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
      if (!paystackSecretKey) throw new Error("PayStack secret key not configured");

      console.log("Verifying PayStack transaction:", transaction_reference);

      const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${transaction_reference}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${paystackSecretKey}`,
        },
      });

      const verifyData = await verifyResponse.json();
      console.log("PayStack verification response:", verifyData);

      if (!verifyData.status || verifyData.data.status !== 'success') {
        throw new Error("Transaction verification failed");
      }
    }

    // Calculate AI release score
    const calculateReleaseScore = () => {
      let score = 0;
      
      // Time-based scoring
      const daysSinceCreated = Math.floor(
        (new Date().getTime() - new Date(transaction.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceCreated >= 7) score += 30;
      if (daysSinceCreated >= 14) score += 20;
      
      // Evidence-based scoring
      if (evidence_urls.length > 0) score += 25;
      if (evidence_urls.length >= 3) score += 15;
      
      // Completion confirmation
      if (transaction.completion_confirmed) score += 40;
      
      // Satisfaction rating
      if (satisfaction_rating && satisfaction_rating >= 4) score += 20;
      
      return Math.min(score, 100);
    };

    const releaseScore = calculateReleaseScore();
    console.log("AI Release Score:", releaseScore);

    // Determine if auto-release is allowed
    const canAutoRelease = (
      release_type === 'AUTO' && 
      releaseScore >= 80
    ) || release_type === 'FORCE'; // Admin override

    let newStatus = 'HELD';
    let shouldUpdateBalances = false;

    if (canAutoRelease) {
      newStatus = 'COMPLETED';
      shouldUpdateBalances = true;
      console.log("Auto-releasing funds based on AI score");
    } else if (release_type === 'MANUAL') {
      // For manual releases, require both parties to confirm
      // This is a simplified version - in production, you'd track confirmations
      newStatus = 'COMPLETED';
      shouldUpdateBalances = true;
      console.log("Manual release approved");
    }

    // Update transaction with enhanced data
    const { error: updateError } = await supabaseClient
      .from('escrow_transactions')
      .update({
        status: newStatus,
        evidence_urls: evidence_urls,
        completion_confirmed: satisfaction_rating >= 4,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction_id);

    if (updateError) throw updateError;

    // Update escrow account balances if funds are being released
    if (shouldUpdateBalances) {
      const { error: balanceError } = await supabaseClient
        .from('escrow_accounts')
        .update({
          frozen_balance: Math.max(0, (transaction.escrow_accounts.frozen_balance || 0) - transaction.amount),
          balance: (transaction.escrow_accounts.balance || 0) + transaction.amount
        })
        .eq('id', transaction.escrow_account_id);

      if (balanceError) throw balanceError;

      // Generate receipt
      const { error: receiptError } = await supabaseClient
        .from('escrow_receipts')
        .insert({
          transaction_id: transaction_id,
          receipt_type: 'RELEASE',
          amount: transaction.amount,
          recipient_id: transaction.payee_id || user.id,
          receipt_data: {
            release_type,
            ai_score: releaseScore,
            satisfaction_rating,
            evidence_count: evidence_urls.length,
            completion_notes
          }
        });

      if (receiptError) console.error('Receipt generation failed:', receiptError);
    }

    // Send notifications (simplified - in production, use email service)
    console.log(`Notification: Funds ${shouldUpdateBalances ? 'released' : 'pending release'} for transaction ${transaction_id}`);

    const response = {
      success: true,
      transaction_id,
      status: newStatus,
      ai_score: releaseScore,
      funds_released: shouldUpdateBalances,
      message: shouldUpdateBalances 
        ? `Funds released successfully with AI score: ${releaseScore}%`
        : `Release request processed. Status: ${newStatus}`
    };

    console.log("Smart release completed:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in smart release:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
