import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

text = text.replace(
  /> Support Chat</g,
  '> {t[language].supChat}<'
);

text = text.replace(
  /title="HQ Support Chat"/g,
  'title={t[language].hqSupChat}'
);

text = text.replace(
  /End-to-end Supabase Live Integration Active/g,
  '{t[language].sec1}'
);

text = text.replace(
  /AES-256-GCM Field-Level Encryption Active for Subscriptions/g,
  '{t[language].sec2}'
);

text = text.replace(
  /Admin CMS Secured via JWT Middleware/g,
  '{t[language].sec3}'
);

text = text.replace(
  /Input Sanitization & XSS Guards Online/g,
  '{t[language].sec4}'
);

fs.writeFileSync('src/App.tsx', text);
