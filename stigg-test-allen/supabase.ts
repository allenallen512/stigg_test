import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_PROJECT_URL is not defined in .env');
}

if (!supabaseKey) {
  throw new Error('VITE_SUPABASE_PUBLIC_API_KEY is not defined in .env');
}

console.log('Initializing Supabase with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: window.localStorage
  }
});