import fs from 'fs';
let text = fs.readFileSync('src/translations.ts', 'utf-8');

const enInsert = `
    aboutUs: "ABOUT US", termsOfService: "TERMS OF SERVICE", privacyPolicy: "PRIVACY POLICY", systemStatusOptimal: "SYSTEM STATUS: OPTIMAL", rightsReserved: "LUDEX STORE - ALL RIGHTS RESERVED 2026 ©",
`;

const arInsert = `
    aboutUs: "معلومات عنا", termsOfService: "شروط الخدمة", privacyPolicy: "سياسة الخصوصية", systemStatusOptimal: "حالة النظام: مثالية", rightsReserved: "جميع الحقوق محفوظة LUDEX STORE 2026 ©",
`;

text = text.replace('sec4: "Input Sanitization & XSS Guards Online",', 'sec4: "Input Sanitization & XSS Guards Online",\n' + enInsert);
text = text.replace('sec4: "تعقيم الإدخال وحماية XSS فعالة",', 'sec4: "تعقيم الإدخال وحماية XSS فعالة",\n' + arInsert);

fs.writeFileSync('src/translations.ts', text);

let appText = fs.readFileSync('src/App.tsx', 'utf-8');

appText = appText.replace(/>ABOUT US<\/a>/g, '>{t[language].aboutUs}</a>');
appText = appText.replace(/>TERMS OF SERVICE<\/a>/g, '>{t[language].termsOfService}</a>');
appText = appText.replace(/>PRIVACY POLICY<\/a>/g, '>{t[language].privacyPolicy}</a>');
appText = appText.replace(/>SYSTEM STATUS: OPTIMAL<\/span>/g, '>{t[language].systemStatusOptimal}</span>');
appText = appText.replace(/>LUDEX STORE - ALL RIGHTS RESERVED 2026 ©<\/div>/g, '>{t[language].rightsReserved}</div>');

fs.writeFileSync('src/App.tsx', appText);
