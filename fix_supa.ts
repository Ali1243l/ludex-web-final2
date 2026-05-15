import fs from 'fs';

let content = fs.readFileSync('api/index.ts', 'utf-8');

content = content.replace(/await supabase\.from\('products'\)/g, "await getSupabaseClient('products').from('products')");
content = content.replace(/await supabase\.from\('subscriptions'\)/g, "await getSupabaseClient('subscriptions').from('subscriptions')");
content = content.replace(/await supabase\.from\('promotions'\)/g, "await getSupabaseClient('promotions').from('promotions')");
content = content.replace(/await supabase\.storage/g, "await getSupabaseClient(null).storage");
content = content.replace(/supabase\.storage/g, "getSupabaseClient(null).storage");
content = content.replace(/await supabase\.from\('customers'\)/g, "await getSupabaseClient('customers').from('customers')");
content = content.replace(/await supabase\.from\('transactions'\)/g, "await getSupabaseClient('transactions').from('transactions')");
content = content.replace(/await supabase\.from\('profiles'\)/g, "await getSupabaseClient('profiles').from('profiles')");
content = content.replace(/await supabase\.from\(table\)/g, "await getSupabaseClient(table).from(table)");

fs.writeFileSync('api/index.ts', content);

let contentApp = fs.readFileSync('src/App.tsx', 'utf-8');
contentApp = contentApp.replace(/const supabaseUrl = import\.meta\.env\.VITE_SUPABASE_URL[^;]+;/, "const supabaseUrl = 'https://xogrjpfcaydjkgzphaoq.supabase.co';");
contentApp = contentApp.replace(/const supabaseAnonKey = import\.meta\.env\.VITE_SUPABASE_ANON_KEY[^;]+;/, "const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ3JqcGZjYXlkamtnenBoYW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3Nzg1NjIsImV4cCI6MjA4OTM1NDU2Mn0._KjiI6bfFc1kM-i5rvWtPB-vDxLwqtpY2Gb3fMIP-_M';");
fs.writeFileSync('src/App.tsx', contentApp);
