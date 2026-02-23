// Netlify Function: get-download
// Verifies Stripe payment and returns the clean output URL stored in session metadata

const { sbUpdate } = require("./_supabase");

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
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Not configured" }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid request" }) }; }

  const { sessionId } = body;
  if (!sessionId) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Missing session ID" }) };
  }

  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(stripeKey + ":").toString("base64")}`,
      },
    });

    const session = await res.json();

    if (!res.ok || session.payment_status !== "paid") {
      return { statusCode: 402, headers: CORS, body: JSON.stringify({ error: "Payment not confirmed" }) };
    }

    const outputUrl = session.metadata?.outputUrl;
    const plan = session.metadata?.plan || "single";

    // Mark payment as paid in Supabase (non-blocking)
    sbUpdate("payments", { stripe_session_id: sessionId }, {
      status: "paid",
    }).catch(() => {});

    const creditMap = { single: 1, starter: 10, pro: 100, team: 999 };
    const credits = creditMap[plan] || 1;

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ outputUrl, plan, credits }),
    };
  } catch (err) {
    console.error("get-download error:", err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Verification failed" }) };
  }
};
