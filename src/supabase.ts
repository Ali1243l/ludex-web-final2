import { createClient } from '@supabase/supabase-js';

// هذي الروابط ناخذها من ملف الـ .env الي راح تخلي بي معلومات الـ Supabase
const supabaseUrl = 'https://xogrjpfcaydjkgzphaoq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ3JqcGZjYXlkamtnenBoYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Nzg1NjIsImV4cCI6MjA4OTM1NDU2Mn0._KjiI6bfFc1kM-i5rvWtPB-vDxLwqtpY2Gb3fMIP-_M';

// هذا الكلاينت هو الي راح نستخدمه للتعامل وية الصور والتسجيل وغيرها
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
