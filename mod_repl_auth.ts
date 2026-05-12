import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Fixing Auth Modal Header
text = text.replace(
  `{showAuthModal === 'login' ? 'System Login' : 'Create Account'}`,
  `{showAuthModal === 'login' ? t[language].systemLogin : t[language].systemRegister}`
);

fs.writeFileSync('src/App.tsx', text);
