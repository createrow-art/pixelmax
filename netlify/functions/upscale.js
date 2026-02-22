// Netlify Function: upscale
// Receives image (base64 data URL), runs Real-ESRGAN via Replicate, returns output URL
// Keys come from Netlify env vars — never exposed to clients

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_MODEL = "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee2d96e5f1e5daa2e75c";

exports.handler = async (event) => {
  // Handle CORS preflight
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

  if (!REPLICATE_TOKEN) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Server not configured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  const { imageData, scale = 4, faceEnhance = false, sessionId } = body;

  if (!imageData) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "No image provided" }),
    };
  }

  // Verify payment if session provided (after free uses exhausted)
  if (sessionId) {
    const valid = await verifyStripeSession(sessionId);
    if (!valid) {
      return {
        statusCode: 402,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Payment required" }),
      };
    }
  }

  try {
    // Start prediction
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REPLICATE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: REPLICATE_MODEL.split(":")[1],
        input: {
          image: imageData,
          scale: scale,
          face_enhance: faceEnhance,
        },
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error("Replicate create error:", err);
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Failed to start upscaling" }),
      };
    }

    let prediction = await createRes.json();

    // Poll until done (max 60s)
    let attempts = 0;
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed" &&
      prediction.status !== "canceled" &&
      attempts < 30
    ) {
      await sleep(2000);
      const pollRes = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
        }
      );
      prediction = await pollRes.json();
      attempts++;
    }

    if (prediction.status !== "succeeded") {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: prediction.error || "Upscaling failed" }),
      };
    }

    const output = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ output }),
    };
  } catch (err) {
    console.error("Upscale error:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Upscaling failed. Please try again." }),
    };
  }
};

async function verifyStripeSession(sessionId) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return false;
  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(stripeKey + ":").toString("base64")}`,
        },
      }
    );
    const session = await res.json();
    return session.payment_status === "paid";
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
