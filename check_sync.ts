import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrlAuth = 'https://xogrjpfcaydjkgzphaoq.supabase.co';
const supabaseKeyAuth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ3JqcGZjYXlkamtnenBoYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Nzg1NjIsImV4cCI6MjA4OTM1NDU2Mn0._KjiI6bfFc1kM-i5rvWtPB-vDxLwqtpY2Gb3fMIP-_M'; 

const supabaseAuth = createClient(supabaseUrlAuth, supabaseKeyAuth);

async function check() {
  const { data, error } = await supabaseAuth.from('profiles').select('*').limit(1).maybeSingle();
  console.log("Data:", data);
  console.log("Error:", error);
}
check();
