import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrlAuth = 'https://xogrjpfcaydjkgzphaoq.supabase.co';
const supabaseKeyAuth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ3JqcGZjYXlkamtnenBoYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Nzg1NjIsImV4cCI6MjA4OTM1NDU2Mn0._KjiI6bfFc1kM-i5rvWtPB-vDxLwqtpY2Gb3fMIP-_M'; // anon key provided 

const supabaseAuth = createClient(supabaseUrlAuth, supabaseKeyAuth);

async function check() {
  const profile = await supabaseAuth.from('profiles').select('id, display_name, avatar_url').limit(1);
  console.log("Profiles ID:", profile.error ? profile.error.message : profile.data);
}
check();
