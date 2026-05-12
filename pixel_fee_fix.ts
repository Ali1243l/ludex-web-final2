import fs from 'fs';

let text = fs.readFileSync('src/translations.ts', 'utf-8');

text = text.replace(/fee: "Service Fee"/g, 'serviceFee: "Service Fee"');
text = text.replace(/fee: "رسوم الخدمة"/g, 'serviceFee: "رسوم الخدمة"');

fs.writeFileSync('src/translations.ts', text);

let appText = fs.readFileSync('src/App.tsx', 'utf-8');
appText = appText.replace(/t\[language\]\.fee/g, 't[language].serviceFee');
appText = appText.replace(/t\[language\]\.status/g, 't[language].statusMsg');
fs.writeFileSync('src/App.tsx', appText);
