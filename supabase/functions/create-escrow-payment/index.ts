
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
    const { amount, currency = "NGN", purpose, recipient_email, description, payment_type = "escrow" } = await req.json();

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

    // Create PayStack transaction
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
        reference: `escrow_${Date.now()}_${user.id.substring(0, 8)}`,
        metadata: {
          purpose,
          user_id: user.id,
          payment_type,
          recipient_email: recipient_email || "pending",
          description,
        },
        callback_url: `${req.headers.get("origin")}/escrow?payment=success`,
        cancel_url: `${req.headers.get("origin")}/escrow?payment=cancelled`,
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || "PayStack transaction initialization failed");
    }

    // Create escrow transaction record
    const { data: escrowAccount } = await supabaseClient
      .from('escrow_accounts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (escrowAccount) {
      await supabaseClient.from('escrow_transactions').insert({
        escrow_account_id: escrowAccount.id,
        amount,
        type: 'HOLD',
        status: 'PENDING',
        purpose,
        description,
        from_user_id: user.id
      });
    }

    return new Response(JSON.stringify({
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error creating escrow payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
