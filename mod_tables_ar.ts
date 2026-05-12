import fs from 'fs';
let appText = fs.readFileSync('src/App.tsx', 'utf-8');

appText = appText.replace(/>ACTIONS<\/th>/g, '>{t[language].actions}</th>');
appText = appText.replace(/>TYPE<\/th>/g, '>{t[language].typeCol}</th>');
appText = appText.replace(/>CATEGORY<\/th>/g, '>{t[language].catCol}</th>');
appText = appText.replace(/>SUPPLIER<\/th>/g, '>{t[language].supplierCol}</th>');
appText = appText.replace(/>SELLING PRICE<\/th>/g, '>{t[language].sellPriceCol}</th>');
appText = appText.replace(/>COST PRICE<\/th>/g, '>{t[language].costPriceCol}</th>');
appText = appText.replace(/>NAME<\/th>/g, '>{t[language].nameCol}</th>');
appText = appText.replace(/>ID<\/th>/g, '>{t[language].idCol}</th>');
appText = appText.replace(/>STATUS<\/th>/g, '>{t[language].status}</th>'); // ensure we have status in translation
appText = appText.replace(/>DATE<\/th>/g, '>{t[language].date}</th>');
appText = appText.replace(/>EMAIL<\/th>/g, '>{t[language].emailUpper}</th>');
appText = appText.replace(/>ROLE<\/th>/g, '>{t[language].role}</th>');
appText = appText.replace(/>AMOUNT<\/th>/g, '>{t[language].amount}</th>');
appText = appText.replace(/>FEE<\/th>/g, '>{t[language].fee}</th>');
appText = appText.replace(/>NET<\/th>/g, '>{t[language].net}</th>');

appText = appText.replace(/>Delete<\/button>/g, '>{t[language].deleteBtn}</button>');
appText = appText.replace(/>Edit<\/button>/g, '>{t[language].editBtn}</button>');
appText = appText.replace(/>PUBLISH<\/button>/g, '>{t[language].publishBtn}</button>');
appText = appText.replace(/>\+<\/span> Add New Product<\/button>/g, '>+</span> {t[language].addNewProd}</button>');

// other tabs Add buttons
appText = appText.replace(/>\+<\/span> Add New Item<\/button>/g, '>+</span> {t[language].addNewItem}</button>');
appText = appText.replace(/>\+<\/span> Add New Account<\/button>/g, '>+</span> {t[language].addNewAccount}</button>');

fs.writeFileSync('src/App.tsx', appText);

let transText = fs.readFileSync('src/translations.ts', 'utf-8');
const enMore = `
    status: "STATUS", date: "DATE", emailUpper: "EMAIL", role: "ROLE", amount: "AMOUNT",
    fee: "FEE", net: "NET", addNewItem: "Add New Item", addNewAccount: "Add New Account",
`;
const arMore = `
    status: "الحالة", date: "التاريخ", emailUpper: "البريد الإلكتروني", role: "الصلاحية", amount: "المبلغ",
    fee: "الرسوم", net: "الصافي", addNewItem: "إضافة عنصر جديد", addNewAccount: "إضافة حساب جديد",
`;

transText = transText.replace('actions: "Actions",', 'actions: "Actions",\n' + enMore);
transText = transText.replace('actions: "الإجراءات",', 'actions: "الإجراءات",\n' + arMore);

fs.writeFileSync('src/translations.ts', transText);
