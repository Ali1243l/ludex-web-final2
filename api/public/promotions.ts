import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aimuoopbzoyrllvnjnbd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest | any, res: VercelResponse | any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  
  try {
    const { data, error } = await supabase.from('promotions').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch(e: any) {
    res.status(500).json({ error: e.message });
  }
}
