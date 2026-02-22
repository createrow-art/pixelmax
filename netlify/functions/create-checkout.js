// Netlify Function: create-checkout
// Creates Stripe Checkout session
// Stores the clean output URL in Stripe metadata — retrieved after payment via get-download

const PLANS = {
  single:  { name: "1 Upscale — Full Resolution Download", amount: 100,  mode: "payment"      },
  starter: { name: "10 Upscale Credits",                   amount: 500,  mode: "payment"      },
  pro:     { name: "Pro — 100 credits/month",              amount: 900,  mode: "subscription" },
  team:    { name: "Team — Unlimited",                     amount: 2900, mode: "subscription" },
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Payment not configured" }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid request" }) }; }

  const { plan = "single", outputUrl = "" } = body;
  const planConfig = PLANS[plan];
  if (!planConfig) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid plan" }) };
  }

  const origin = event.headers.origin || "https://pixelmaxupscaler.com";
  const isSubscription = planConfig.mode === "subscription";

  // Build form params for Stripe API
  const params = new URLSearchParams();
  params.append("payment_method_types[]", "card");
  params.append("line_items[0][price_data][currency]", "usd");
  params.append("line_items[0][price_data][product_data][name]", planConfig.name);
  params.append("line_items[0][price_data][product_data][description]",
    "PixelMax AI Image Upscaler — pixelmaxupscaler.com");
  params.append("line_items[0][price_data][unit_amount]", planConfig.amount);
  params.append("line_items[0][quantity]", "1");
  params.append("mode", planConfig.mode);
  params.append("success_url",
    `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan}`);
  params.append("cancel_url", `${origin}/?payment=cancelled`);
  params.append("metadata[plan]", plan);
  params.append("metadata[outputUrl]", outputUrl.slice(0, 499)); // Stripe 500-char limit

  if (isSubscription) {
    params.set("line_items[0][price_data][recurring][interval]", "month");
  }

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(stripeKey + ":").toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await res.json();

    if (!res.ok) {
      console.error("Stripe error:", session);
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: session.error?.message || "Payment error" }) };
    }

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error("Checkout error:", err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Failed to create checkout" }) };
  }
};
