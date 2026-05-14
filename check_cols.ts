import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://aimuoopbzoyrllvnjnbd.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
     console.error("Error:", error);
  } else {
     console.log("Keys:", Object.keys(data?.[0] || {}));
  }
}

check();
