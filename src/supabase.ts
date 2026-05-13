import { createClient } from '@supabase/supabase-js';

// هذي الروابط ناخذها من ملف الـ .env الي راح تخلي بي معلومات الـ Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// هذا الكلاينت هو الي راح نستخدمه للتعامل وية الصور والتسجيل وغيرها
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
