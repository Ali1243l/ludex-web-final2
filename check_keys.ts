import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://aimuoopbzoyrllvnjnbd.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if(!key) {
   console.log("No Supabase key found in env, let's try to parse .env file...");
   if (fs.existsSync('.env')) {
      const env = fs.readFileSync('.env', 'utf8');
      console.log(env.substring(0, 100) + '...');
   }
} else {
   console.log("Found key in process.env");
}
