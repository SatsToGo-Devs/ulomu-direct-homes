
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
    const { payment_intent_id, transaction_id, recipient_email } = await req.json();

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

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Capture the payment intent (release funds)
    const paymentIntent = await stripe.paymentIntents.capture(payment_intent_id);

    // Update escrow transaction
    await supabaseClient
      .from('escrow_transactions')
      .update({
        status: 'COMPLETED',
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction_id);

    // Update escrow account balances
    const { data: transaction } = await supabaseClient
      .from('escrow_transactions')
      .select('*, escrow_accounts!inner(*)')
      .eq('id', transaction_id)
      .single();

    if (transaction) {
      // Decrease frozen balance, increase available balance
      await supabaseClient
        .from('escrow_accounts')
        .update({
          frozen_balance: Math.max(0, (transaction.escrow_accounts.frozen_balance || 0) - transaction.amount),
          balance: (transaction.escrow_accounts.balance || 0) + transaction.amount
        })
        .eq('id', transaction.escrow_account_id);
    }

    return new Response(JSON.stringify({
      success: true,
      payment_intent: paymentIntent
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
