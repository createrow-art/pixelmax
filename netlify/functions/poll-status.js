// Netlify Function: poll-status
// Checks a Replicate prediction status — called repeatedly by client until done
// Keeps API token server-side

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid request" }) }; }

  const { predictionId } = body;
  if (!predictionId) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Missing predictionId" }) };
  }

  try {
    const res = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });

    const prediction = await res.json();

    if (!res.ok) {
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Failed to check status" }) };
    }

    const output = prediction.status === "succeeded"
      ? (Array.isArray(prediction.output) ? prediction.output[0] : prediction.output)
      : null;

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        status: prediction.status,   // starting | processing | succeeded | failed
        output,
        error: prediction.error || null,
        logs: prediction.logs || "",
      }),
    };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
