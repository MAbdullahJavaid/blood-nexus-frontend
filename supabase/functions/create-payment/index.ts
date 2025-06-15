
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// CORS headers for frontend access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Utility to get current timestamp as ISO string
const nowISO = () => new Date().toISOString();

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseService = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!stripeKey) throw new Error("Stripe secret key not set.");
    if (!supabaseUrl || !supabaseAnon || !supabaseService)
      throw new Error("Supabase config missing in Edge Function environment");

    // Accept amount, currency, email, and frontend redirect origin
    const { amount = 5000, currency = "usd", email, redirectOrigin } = await req.json().catch(() => ({}));
    let frontendOrigin = redirectOrigin;
    if (!frontendOrigin) {
      frontendOrigin = "http://localhost:3000";
    }

    // Determine customer email (either from context or supplied)
    let customerEmail = email;
    let userId: string | null = null;
    if (!customerEmail) {
      // Try to get user from Authorization
      const supabaseClient = createClient(supabaseUrl, supabaseAnon);
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        customerEmail = data?.user?.email || undefined;
        userId = data?.user?.id || null;
      }
    } else {
      // If email is provided, still try to extract user_id if signed in
      const supabaseClient = createClient(supabaseUrl, supabaseAnon);
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        if (data?.user?.id) userId = data.user.id;
      }
    }
    if (!customerEmail) customerEmail = "guest@example.com";

    // 1. Create the Stripe client
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // 2. Create or get Stripe customer by email
    let customerId: string | undefined;
    const custList = await stripe.customers.list({ email: customerEmail, limit: 1 });
    if (custList.data.length > 0) {
      customerId = custList.data[0].id;
    }

    // 3. Create a pending donation row using service role
    // Use email, amount, currency, status, and user_id if available
    const serviceClient = createClient(supabaseUrl, supabaseService, { auth: { persistSession: false } });
    let insertDonationResp = await serviceClient
      .from("donations")
      .insert([{
        user_id: userId,
        email: customerEmail,
        amount: amount,
        currency: currency,
        status: "pending",
        created_at: nowISO(),
        updated_at: nowISO()
      }])
      .select("id")
      .single();

    if (insertDonationResp.error) {
      console.error("[create-payment] Error inserting donation:", insertDonationResp.error);
      // Continue but do NOT fail the payment process -- record error in logging only
      // (You could throw if you want ALL donations tracked. Here we just log.)
    }
    const donationId = insertDonationResp.data?.id;

    // 4. Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Donation" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontendOrigin}/?donation=success`,
      cancel_url: `${frontendOrigin}/?donation=canceled`,
      metadata: {
        donation_id: donationId || "",
        email: customerEmail,
      },
    });

    // 5. After creating Stripe session, update the donation with session id (if row was created)
    if (donationId) {
      const updateResp = await serviceClient
        .from("donations")
        .update({
          stripe_session_id: session.id,
          updated_at: nowISO()
        })
        .eq("id", donationId);

      if (updateResp.error) {
        console.error("[create-payment] Error updating donation with session ID:", updateResp.error);
      }
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[create-payment] Error:", error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
