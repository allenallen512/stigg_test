// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.5';
console.info('server started');
// Helper to add CORS headers
function withCors(res) {
  const headers = new Headers(res.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  return new Response(res.body, {
    ...res,
    headers
  });
}
Deno.serve(async (req)=>{
  console.log("auth function triggered");
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return withCors(new Response(null, {
      status: 204
    }));
  }
  // Get the Supabase service key from environment variables
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (!serviceKey || !supabaseUrl) {
    return withCors(new Response(JSON.stringify({
      error: 'Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL in environment.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }));
  }
  // Create a Supabase client with the service key
  const supabase = createClient(supabaseUrl, serviceKey);
  // Optionally, require a valid JWT in the Authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return withCors(new Response(JSON.stringify({
      error: 'Missing or invalid Authorization header.'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    }));
  }
  // Fetch all products
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    return withCors(new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }));
  }
  return withCors(new Response(JSON.stringify({
    products: data
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    }
  }));
});
