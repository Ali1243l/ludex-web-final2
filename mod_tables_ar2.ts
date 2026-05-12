import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

text = text.replace(/>Name<\/th>/g, '>{t[language].nameCol}</th>');
text = text.replace(/>Username<\/th>/g, '>{t[language].username}</th>');
text = text.replace(/>Password<\/th>/g, '>{t[language].passwordUpper}</th>');
text = text.replace(/>Category<\/th>/g, '>{t[language].catCol}</th>');
text = text.replace(/>Status<\/th>/g, '>{t[language].status}</th>');
text = text.replace(/>Sell Count<\/th>/g, '>{t[language].sellCount}</th>');
text = text.replace(/>Actions<\/th>/g, '>{t[language].actions}</th>');
text = text.replace(/>Action<\/th>/g, '>{t[language].actions}</th>');
text = text.replace(/>Cost Price<\/th>/g, '>{t[language].costPriceCol}</th>');
text = text.replace(/>Selling Price<\/th>/g, '>{t[language].sellPriceCol}</th>');
text = text.replace(/>Supplier<\/th>/g, '>{t[language].supplierCol}</th>');
text = text.replace(/>Type<\/th>/g, '>{t[language].typeCol}</th>');
text = text.replace(/>Amount<\/th>/g, '>{t[language].amount}</th>');
text = text.replace(/>Email<\/th>/g, '>{t[language].emailUpper}</th>');
text = text.replace(/>Purchases<\/th>/g, '>{t[language].purchases}</th>');
text = text.replace(/>Points<\/th>/g, '>{t[language].points}</th>');
text = text.replace(/>Date<\/th>/g, '>{t[language].date}</th>');
text = text.replace(/>Description<\/th>/g, '>{t[language].descriptionCol}</th>');
text = text.replace(/>Product Name<\/th>/g, '>{t[language].productName}</th>');
text = text.replace(/>Final Price<\/th>/g, '>{t[language].finalPrice}</th>');
text = text.replace(/>Customer \(Username\)<\/th>/g, '>{t[language].customerUsername}</th>');
text = text.replace(/>Notes<\/th>/g, '>{t[language].notes}</th>');
text = text.replace(/>Person \/ Entity<\/th>/g, '>{t[language].personEntity}</th>');
text = text.replace(/>Key<\/th>/g, '>{t[language].keyCol}</th>');
text = text.replace(/>Value<\/th>/g, '>{t[language].valueCol}</th>');
text = text.replace(/>Original Price<\/th>/g, '>{t[language].originalPrice}</th>');
text = text.replace(/>Discount Price<\/th>/g, '>{t[language].discountPrice}</th>');
text = text.replace(/>Featured<\/th>/g, '>{t[language].featured}</th>');
text = text.replace(/>Invoice<\/th>/g, '>{t[language].invoice}</th>');

// Update translations file too
let transText = fs.readFileSync('src/translations.ts', 'utf-8');

const enInsert = `
    username: "Username", sellCount: "Sell Count", purchases: "Purchases", points: "Points",
    descriptionCol: "Description", productName: "Product Name", finalPrice: "Final Price",
    customerUsername: "Customer (Username)", notes: "Notes", personEntity: "Person / Entity",
    keyCol: "Key", valueCol: "Value", originalPrice: "Original Price", discountPrice: "Discount Price",
    featured: "Featured", invoice: "Invoice",
`;

const arInsert = `
    username: "اسم المستخدم", sellCount: "عدد المبيعات", purchases: "المشتريات", points: "النقاط",
    descriptionCol: "الوصف", productName: "اسم المنتج", finalPrice: "السعر النهائي",
    customerUsername: "العميل (اسم المستخدم)", notes: "ملاحظات", personEntity: "الشخص / الجهة",
    keyCol: "المفتاح", valueCol: "القيمة", originalPrice: "السعر الأصلي", discountPrice: "سعر الخصم",
    featured: "مميز", invoice: "الفاتورة",
`;

transText = transText.replace('addNewAccount: "Add New Account",', 'addNewAccount: "Add New Account",\n' + enInsert);
transText = transText.replace('addNewAccount: "إضافة حساب جديد",', 'addNewAccount: "إضافة حساب جديد",\n' + arInsert);

fs.writeFileSync('src/translations.ts', transText);
fs.writeFileSync('src/App.tsx', text);
