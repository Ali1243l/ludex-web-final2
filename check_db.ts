import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://aimuoopbzoyrllvnjnbd.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(url, key);

async function createTableViaRPC() {
  // Try to create the table via a common rpc function if it exists, or check tables
  const { data, error } = await supabase.rpc('get_tables');
  console.log("RPC get_tables:", error ? error.message : data);
}

createTableViaRPC();
