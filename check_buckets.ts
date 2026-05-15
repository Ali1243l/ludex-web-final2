import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrlAuth = 'https://xogrjpfcaydjkgzphaoq.supabase.co';
const supabaseKeyAuth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ3JqcGZjYXlkamtnenBoYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Nzg1NjIsImV4cCI6MjA4OTM1NDU2Mn0._KjiI6bfFc1kM-i5rvWtPB-vDxLwqtpY2Gb3fMIP-_M'; 
const supabaseStore = createClient('https://aimuoopbzoyrllvnjnbd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbXVvb3Biem95cmxsdm5qbmJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjEzMTc4NiwiZXhwIjoyMDg3NzA3Nzg2fQ.mE-fW4cSwEj69To4pIL3oHY2fLy2tnvA5Y0E8XfR_qg');

async function check() {
  const { data, error } = await supabaseAuth.storage.listBuckets();
  console.log("Buckets:", data, error);
}
check();
