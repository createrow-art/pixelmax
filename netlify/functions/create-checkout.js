// Netlify Function: create-checkout
// Creates a Stripe Checkout session and returns the URL
// Keys come from Netlify env vars — never exposed to clients

const PLANS = {
  single:  { name: "1 Upscale Credit",    amount: 100,  credits: 1   },  // $1.00
  starter: { name: "10 Upscale Credits",  amount: 500,  credits: 10  },  // $5.00
  pro:     { name: "Pro — 100 credits/mo",amount: 900,  credits: 100, mode: "subscription" },  // $9.00/mo
  team:    { name: "Team — Unlimited",    amount: 2900, credits: 999, mode: "subscription" },  // $29.00/mo
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Payment not configured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid request" }),
    };
  }

  const { plan = "single" } = body;
  const planConfig = PLANS[plan];

  if (!planConfig) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid plan" }),
    };
  }

  const origin = event.headers.origin || "https://pixelmaxupscaler.com";
  const isSubscription = planConfig.mode === "subscription";

  // Build Stripe Checkout session via REST API
  const params = new URLSearchParams({
    "payment_method_types[]": "card",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": planConfig.name,
    "line_items[0][price_data][unit_amount]": planConfig.amount,
    "line_items[0][quantity]": "1",
    "mode": isSubscription ? "subscription" : "payment",
    "success_url": `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}&credits=${planConfig.credits}`,
    "cancel_url": `${origin}/?payment=cancelled`,
    "metadata[plan]": plan,
    "metadata[credits]": planConfig.credits,
  });

  if (isSubscription) {
    // For subscriptions, price_data uses recurring
    params.delete("line_items[0][price_data][unit_amount]");
    params.append("line_items[0][price_data][recurring][interval]", "month");
    params.append("line_items[0][price_data][unit_amount]", planConfig.amount);
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
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: session.error?.message || "Payment error" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Checkout error:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to create checkout" }),
    };
  }
};
