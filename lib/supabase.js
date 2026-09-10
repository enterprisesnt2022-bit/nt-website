const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
function config() { if (!url || !key) throw new Error('Supabase is not configured'); return {headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'}}; }
export async function rpc(name, args) { const res=await fetch(`${url}/rest/v1/rpc/${name}`,{method:'POST',...config(),body:JSON.stringify(args)}); if(!res.ok)throw new Error(`Supabase retrieval failed: ${res.status}`);return res.json(); }
export async function insert(table, row) { const res=await fetch(`${url}/rest/v1/${table}`,{method:'POST',...config(),headers:{...config().headers,Prefer:'return=representation'},body:JSON.stringify(row)});if(!res.ok)throw new Error(`Supabase insert failed: ${res.status}`);return res.json(); }
