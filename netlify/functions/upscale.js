// Netlify Function: upscale
// ASYNC approach: starts prediction immediately, returns predictionId
// Client polls /poll-status until done — avoids Netlify's 10s timeout

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL_VERSION = "b3ef194191d13140337468c916c2c5b96dd0cb06dffc032a022a31807f6a5ea8";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  if (!REPLICATE_TOKEN) {
    console.error("REPLICATE_API_TOKEN not set");
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Server not configured — missing API token" }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch (e) { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid JSON body" }) }; }

  const { imageData, scale = 4, faceEnhance = false } = body;

  if (!imageData) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "No image data provided" }) };
  }

  // Log payload size for debugging (base64 can be large)
  const sizeKB = Math.round(event.body.length / 1024);
  console.log(`Upscale request: scale=${scale}, faceEnhance=${faceEnhance}, payloadSize=${sizeKB}KB`);

  try {
    // Start prediction (returns immediately, ~200ms)
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REPLICATE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: { image: imageData, scale: parseInt(scale), face_enhance: faceEnhance },
      }),
    });

    const prediction = await res.json();

    if (!res.ok) {
      console.error("Replicate API error:", JSON.stringify(prediction));
      const msg = prediction?.detail || prediction?.error || `Replicate error ${res.status}`;
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: msg }) };
    }

    console.log(`Prediction started: ${prediction.id}, status: ${prediction.status}`);

    // Return prediction ID — client will poll from here
    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ predictionId: prediction.id, status: prediction.status }),
    };
  } catch (err) {
    console.error("Upscale function error:", err.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
