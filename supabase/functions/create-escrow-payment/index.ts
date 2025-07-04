
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
      amount, 
      escrow_amount,
      service_fee = 0,
      currency = "NGN", 
      purpose, 
      recipient_email, 
      description, 
      property_id,
      payee_id,
      release_condition = 'MANUAL_RELEASE',
      auto_release_days = 7,
      payment_type = "escrow_enhanced" 
    } = await req.json();

    // Initialize Supabase with service role for secure operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user?.email) throw new Error("User not authenticated");

    // Initialize PayStack
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) throw new Error("PayStack secret key not configured");

    console.log("Creating enhanced PayStack transaction for user:", user.email);

    // Create PayStack transaction with enhanced metadata
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(amount * 100), // Convert to kobo
        currency,
        reference: `escrow_enhanced_${Date.now()}_${user.id.substring(0, 8)}`,
        metadata: {
          purpose,
          user_id: user.id,
          payment_type,
          recipient_email: recipient_email || "pending",
          description,
          escrow_amount,
          service_fee,
          property_id,
          payee_id,
          release_condition,
          auto_release_days
        },
        callback_url: `${req.headers.get("origin")}/escrow?payment=success`,
        cancel_url: `${req.headers.get("origin")}/escrow?payment=cancelled`,
      }),
    });

    const paystackData = await paystackResponse.json();
    console.log("PayStack response:", paystackData);

    if (!paystackData.status) {
      throw new Error(paystackData.message || "PayStack transaction initialization failed");
    }

    // Get or create escrow account with enhanced fields
    let { data: escrowAccount, error: accountError } = await supabaseClient
      .from('escrow_accounts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (accountError && accountError.code === 'PGRST116') {
      // Create account if it doesn't exist with enhanced defaults
      const { data: newAccount, error: createError } = await supabaseClient
        .from('escrow_accounts')
        .insert([{ 
          user_id: user.id,
          role: 'TENANT', // Default role, will be updated based on usage
          escrow_tier: 'BASIC',
          trust_score: 0.8
        }])
        .select()
        .single();

      if (createError) throw createError;
      escrowAccount = newAccount;
    } else if (accountError) {
      throw accountError;
    }

    // Calculate auto-release date
    const autoReleaseDate = new Date();
    autoReleaseDate.setDate(autoReleaseDate.getDate() + auto_release_days);

    // Create enhanced escrow transaction record
    const { error: transactionError } = await supabaseClient
      .from('escrow_transactions')
      .insert({
        escrow_account_id: escrowAccount.id,
        amount: escrow_amount || amount,
        type: 'DEPOSIT',
        status: 'PENDING',
        purpose,
        description,
        from_user_id: user.id,
        payer_id: user.id,
        payee_id: payee_id || null,
        property_id: property_id || null,
        service_fee: service_fee,
        release_condition: release_condition,
        auto_release_date: release_condition === 'AUTOMATIC' ? autoReleaseDate.toISOString() : null,
        completion_confirmed: false
      });

    if (transactionError) {
      console.error('Error creating enhanced escrow transaction:', transactionError);
      throw transactionError;
    }

    console.log("Enhanced escrow transaction created successfully");

    return new Response(JSON.stringify({
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
      escrow_features: {
        smart_release: true,
        ai_scoring: true,
        dispute_protection: true,
        evidence_upload: true,
        auto_release_date: release_condition === 'AUTOMATIC' ? autoReleaseDate.toISOString() : null
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error creating enhanced escrow payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
