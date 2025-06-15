import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe secret key not set.");

    // Accept redirectOrigin from frontend for correct redirect
    const { amount = 5000, currency = "usd", email, redirectOrigin } = await req.json().catch(() => ({}));
    let frontendOrigin = redirectOrigin;
    if (!frontendOrigin) {
      // fallback (should not happen in FE, just in case)
      frontendOrigin = "http://localhost:3000";
    }

    // Create Supabase client (for auth, optional)
    let customerEmail = email;
    if (!customerEmail) {
      // Try to get user email if authenticated
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        customerEmail = data?.user?.email || undefined;
      }
    }
    if (!customerEmail) customerEmail = "guest@example.com";

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Optionally, check/create Stripe customer by email
    let customerId: string | undefined;
    const custList = await stripe.customers.list({ email: customerEmail, limit: 1 });
    if (custList.data.length > 0) {
      customerId = custList.data[0].id;
    }

    // Use frontendOrigin for success/cancel URL!
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Donation" },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontendOrigin}/?donation=success`,
      cancel_url: `${frontendOrigin}/?donation=canceled`,
    });

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
