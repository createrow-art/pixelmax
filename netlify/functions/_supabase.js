// Shared Supabase REST helper — no SDK needed, just fetch
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const headers = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "apikey": SUPABASE_KEY,
  "Prefer": "return=representation",
});

// Fire-and-forget — never throws, logs errors quietly
async function sbInsert(table, data) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) console.error(`[supabase] INSERT ${table} error:`, json);
    return Array.isArray(json) ? json[0] : json;
  } catch (e) {
    console.error(`[supabase] INSERT ${table} exception:`, e.message);
    return null;
  }
}

async function sbUpdate(table, match, data) {
  try {
    const query = Object.entries(match).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join("&");
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) console.error(`[supabase] UPDATE ${table} error:`, json);
    return Array.isArray(json) ? json[0] : json;
  } catch (e) {
    console.error(`[supabase] UPDATE ${table} exception:`, e.message);
    return null;
  }
}

module.exports = { sbInsert, sbUpdate };
