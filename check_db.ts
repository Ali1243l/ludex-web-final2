import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();
const supabaseUrlStore = 'https://aimuoopbzoyrllvnjnbd.supabase.co';
const supabaseKeyStore = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbXVvb3Biem95cmxsdm5qbmJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjEzMTc4NiwiZXhwIjoyMDg3NzA3Nzg2fQ.mE-fW4cSwEj69To4pIL3oHY2fLy2tnvA5Y0E8XfR_qg'; // service role key

const supabaseUrlAuth = 'https://xogrjpfcaydjkgzphaoq.supabase.co';
const supabaseKeyAuth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ3JqcGZjYXlkamtnenBoYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Nzg1NjIsImV4cCI6MjA4OTM1NDU2Mn0._KjiI6bfFc1kM-i5rvWtPB-vDxLwqtpY2Gb3fMIP-_M'; // anon key provided 

const supabaseStore = createClient(supabaseUrlStore, supabaseKeyStore);
const supabaseAuth = createClient(supabaseUrlAuth, supabaseKeyAuth);

async function check() {
  const messages = await supabaseAuth.from('chat_messages').select('read_by').limit(1);
  console.log("Messages read_by:", messages.error ? messages.error.message : messages.data);
}
check();
