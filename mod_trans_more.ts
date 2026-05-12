import fs from 'fs';
let text = fs.readFileSync('src/translations.ts', 'utf-8');

const enInsert = `
    supChat: "Support Chat", hqSupChat: "HQ Support Chat",
    sec1: "End-to-end Live Integration Active",
    sec2: "AES-256-GCM Field-Level Encryption Active for Subscriptions",
    sec3: "Admin CMS Secured via JWT Middleware",
    sec4: "Input Sanitization & XSS Guards Online",
    exitAdmin: "Exit Dashboard",
`;

const arInsert = `
    supChat: "دعم المحادثة", hqSupChat: "دعم المقر الرئيسي",
    sec1: "التكامل المباشر الشامل فعال",
    sec2: "تشفير AES-256-GCM نشط للاشتراكات",
    sec3: "لوحة التحكم مأمنة عبر JWT Middleware",
    sec4: "تعقيم الإدخال وحماية XSS فعالة",
    exitAdmin: "الخروج من لوحة القيادة",
`;

text = text.replace('exitDashboard: "Exit Dashboard",', 'exitDashboard: "Exit Dashboard",\n' + enInsert);
text = text.replace('exitDashboard: "الخروج من لوحة القيادة",', 'exitDashboard: "الخروج من لوحة القيادة",\n' + arInsert);

fs.writeFileSync('src/translations.ts', text);
