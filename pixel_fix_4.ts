import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace standard clear
text = text.replace(
  /setUserProfile\(\{ ?name: '', email: '', role: 'CUSTOMER' ?\}\);/g,
  "setUserProfile({name: '', email: '', role: 'CUSTOMER', xp_points: 0, platformPreference: 'PC', favoriteGenres: [], emailNotifications: false, twoFactorEnabled: false});"
);

// Replace login setups
text = text.replace(
  /setUserProfile\(\{ name: data\.user\.username, email: authForm\.email, role: data\.user\.role \}\);/g,
  "setUserProfile((prev: any) => ({ ...prev, name: data.user.username, email: authForm.email, role: data.user.role }));"
);

text = text.replace(
  /setUserProfile\(\{ name: 'AbuHassan_Admin', email: 'admin@ludexstore\.com', role: 'ADMIN' \}\);/g,
  "setUserProfile((prev: any) => ({ ...prev, name: 'AbuHassan_Admin', email: 'admin@ludexstore.com', role: 'ADMIN' }));"
);

text = text.replace(
  /setUserProfile\(\{ name: authForm\.name \|\| 'New User', email: authForm\.email, role: 'CUSTOMER' \}\);/g,
  "setUserProfile((prev: any) => ({ ...prev, name: authForm.name || 'New User', email: authForm.email, role: 'CUSTOMER' }));"
);


fs.writeFileSync('src/App.tsx', text);
