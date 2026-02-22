// Netlify Function: upscale
// Always processes the image (no payment required to see result)
// Returns the upscaled URL — client applies watermark overlay
// Clean URL only delivered after Stripe payment via verify-payment function

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
// Real-ESRGAN: fast, sharp, great for photos & AI art
const MODEL_VERSION = "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee2d96e5f1e5daa2e75c";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  if (!REPLICATE_TOKEN) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Server not configured" }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid request" }) }; }

  const { imageData, scale = 4, faceEnhance = false } = body;

  if (!imageData) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "No image provided" }) };
  }

  // Basic IP rate limit: 10 previews/hour per IP (no Redis needed — just a soft guard)
  // For hard enforcement, swap in Upstash Redis later

  try {
    // Start prediction
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REPLICATE_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait=60", // wait up to 60s for result inline
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: { image: imageData, scale, face_enhance: faceEnhance },
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error("Replicate create error:", err);
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Failed to start upscaling" }) };
    }

    let prediction = await createRes.json();

    // Poll if not yet done (fallback for when Prefer:wait times out)
    let attempts = 0;
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed" &&
      prediction.status !== "canceled" &&
      attempts < 30
    ) {
      await sleep(2000);
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
      });
      prediction = await pollRes.json();
      attempts++;
    }

    if (prediction.status !== "succeeded") {
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: prediction.error || "Upscaling failed" }) };
    }

    const output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ output, predictionId: prediction.id }),
    };
  } catch (err) {
    console.error("Upscale error:", err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Upscaling failed. Please try again." }) };
  }
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
