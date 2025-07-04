
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
    const { transaction_reference, transaction_id, recipient_email } = await req.json();

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

    // Verify transaction with PayStack
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

    // Get transaction details
    const { data: transaction, error: fetchError } = await supabaseClient
      .from('escrow_transactions')
      .select('*, escrow_accounts!inner(*)')
      .eq('id', transaction_id)
      .single();

    if (fetchError) throw fetchError;

    // Update escrow transaction to completed
    const { error: updateError } = await supabaseClient
      .from('escrow_transactions')
      .update({
        status: 'COMPLETED',
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction_id);

    if (updateError) throw updateError;

    // Update escrow account balances
    if (transaction) {
      const { error: balanceError } = await supabaseClient
        .from('escrow_accounts')
        .update({
          frozen_balance: Math.max(0, (transaction.escrow_accounts.frozen_balance || 0) - transaction.amount),
          balance: (transaction.escrow_accounts.balance || 0) + transaction.amount
        })
        .eq('id', transaction.escrow_account_id);

      if (balanceError) throw balanceError;
    }

    console.log("Escrow funds released successfully");

    return new Response(JSON.stringify({
      success: true,
      transaction: verifyData.data
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error releasing escrow funds:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
