import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

text = text.replace(/>Edit<\/button>/g, '>{t[language].editBtn}</button>');
text = text.replace(/>Delete<\/button>/g, '>{t[language].deleteBtn}</button>');
text = text.replace(/>Mark Sold<\/button>/g, '>{t[language].markSold}</button>');
text = text.replace(/>Cancel<\/button>/g, '>{t[language].cancelText}</button>');
text = text.replace(/>Save<\/button>/g, '>{t[language].save}</button>');
text = text.replace(/title="Mark Sold"/g, 'title={t[language].markSold}');
text = text.replace(/title="Edit Order"/g, 'title={t[language].editOrder}');
text = text.replace(/title="Delete Order"/g, 'title={t[language].deleteOrder}');

text = text.replace(/>Add Banner<\/button>/g, '>{t[language].addBanner}</button>');
text = text.replace(/>Create Code<\/button>/g, '>{t[language].createCode}</button>');
text = text.replace(/Cancel Edit<\/button>/g, '{t[language].cancelEdit}</button>');

text = text.replace(/>Publish<\/button>/g, '>{t[language].publishBtn}</button>');

// Admin Tab settings Edit
text = text.replace(/\{editingSettings \? 'Save Settings' : 'Edit Settings'\}/g, '{editingSettings ? t[language].saveSettings : t[language].editSettings}');

let transText = fs.readFileSync('src/translations.ts', 'utf-8');

const enInsert = `
    markSold: "Mark Sold", save: "Save",
    editOrder: "Edit Order", deleteOrder: "Delete Order", addBanner: "Add Banner",
    createCode: "Create Code", cancelEdit: "Cancel Edit",
    saveSettings: "Save Settings", editSettings: "Edit Settings",
`;

const arInsert = `
    markSold: "تحديد كمباع", save: "حفظ",
    editOrder: "تعديل الطلب", deleteOrder: "حذف الطلب", addBanner: "إضافة بانر",
    createCode: "إنشاء كود", cancelEdit: "إلغاء التعديل",
    saveSettings: "حفظ الإعدادات", editSettings: "تعديل الإعدادات",
`;

transText = transText.replace('addNewAccount: "Add New Account",', 'addNewAccount: "Add New Account",\n' + enInsert);
transText = transText.replace('addNewAccount: "إضافة حساب جديد",', 'addNewAccount: "إضافة حساب جديد",\n' + arInsert);

fs.writeFileSync('src/translations.ts', transText);

fs.writeFileSync('src/App.tsx', text);
