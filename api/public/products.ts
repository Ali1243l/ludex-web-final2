import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aimuoopbzoyrllvnjnbd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest | any, res: VercelResponse | any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  
  try {
    const { data: products, error: pError } = await supabase.from('products').select('*');
    if (pError) throw pError;
    
    const { data: subs, error: sError } = await supabase.from('subscriptions').select('name, status, sell_count');
    if (sError) throw sError;

    const mappedProducts = products.map((p: any) => {
      const relatedSub = subs.find((s: any) => s.name?.toLowerCase() === p.name?.toLowerCase());
      return {
        ...p,
        stock: relatedSub && relatedSub.status === 'active' ? 1 : 0
      };
    });
    res.status(200).json(mappedProducts);
  } catch(e: any) {
    res.status(500).json({ error: e.message });
  }
}
