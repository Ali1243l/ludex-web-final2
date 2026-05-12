import fs from 'fs';
let text = fs.readFileSync('src/translations.ts', 'utf-8');

const enInsert = `
    register: "Register", signIn: "Sign In", systemLogin: "SYSTEM LOGIN", systemRegister: "SYSTEM REGISTER",
    emailOrUsername: "EMAIL / USERNAME", passwordUpper: "PASSWORD", authenticate: "Authenticate", registerNow: "Register Now",
    noAccount: "Don't have an account? Register", hasAccount: "Already have an account? Login",
    userDashboard: "User Dashboard", profileLoyalty: "Profile & Loyalty", orderHistory: "Order History",
    loyaltyDashboard: "Loyalty Dashboard", dashboard: "Dashboard", catalogStock: "Catalog & Stock",
    salesCrm: "Sales & CRM", finLedger: "Financial Ledger", sysTools: "System & Tools", marketing: "Marketing & Offers",
    activeCustomers: "ACTIVE CUSTOMERS", lowStockAlerts: "LOW STOCK ALERTS", totalRev: "TOTAL REVENUE (LIVE)",
    pendingOrdersText: "PENDING ORDERS", sysSec: "System Security Status", recentSales: "Recent Sales",
    exitDashboard: "Exit Dashboard",
`;

const arInsert = `
    register: "إنشاء حساب", signIn: "تسجيل الدخول", systemLogin: "تسجيل الدخول للنظام", systemRegister: "إنشاء حساب جديد",
    emailOrUsername: "البريد الإلكتروني / اسم المستخدم", passwordUpper: "كلمة المرور", authenticate: "دخول", registerNow: "سجل الآن",
    noAccount: "ليس لديك حساب؟ سجل الآن", hasAccount: "لديك حساب بالفعل؟ سجل دخولك",
    userDashboard: "لوحة تحكم المستخدم", profileLoyalty: "الملف الشخصي والولاء", orderHistory: "سجل الطلبات",
    loyaltyDashboard: "لوحة الولاء", dashboard: "لوحة القيادة", catalogStock: "الكتالوج والمخزون",
    salesCrm: "المبيعات والعملاء", finLedger: "السجل المالي", sysTools: "النظام والأدوات", marketing: "التسويق والعروض",
    activeCustomers: "العملاء النشطين", lowStockAlerts: "تنبيهات نقص المخزون", totalRev: "إجمالي الإيرادات (مباشر)",
    pendingOrdersText: "الطلبات المعلقة", sysSec: "حالة أمان النظام", recentSales: "أحدث المبيعات",
    exitDashboard: "الخروج من لوحة القيادة",
`;

text = text.replace('en: {\n', 'en: {\n' + enInsert);
text = text.replace('ar: {\n', 'ar: {\n' + arInsert);

fs.writeFileSync('src/translations.ts', text);
console.log("Translations added.");
