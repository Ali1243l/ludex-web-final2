import fs from 'fs';
let text = fs.readFileSync('src/translations.ts', 'utf-8');

const enInsert = `
    adminSubs: "Subscriptions (Stock)", adminProds: "Products (Storefront)", adminInv: "Inventory (Legacy)",
    adminCats: "Categories (Legacy)", adminSales: "Orders & Sales", adminCusts: "Customers",
    adminOrdLeg: "Orders (Legacy)", adminTrans: "Transactions (Treasury)", adminFin: "Financials (Legacy)",
    adminPay: "Payment Gateways", adminMac: "Settings & Macros", adminSet: "Global Settings (Legacy)",
    adminPages: "CMS Pages", adminPromos: "Promotions", adminPromoCodes: "Promo Codes",
    actions: "Actions", typeCol: "Type", catCol: "Category", supplierCol: "Supplier", 
    sellPriceCol: "Selling Price", costPriceCol: "Cost Price", nameCol: "Name", idCol: "ID",
    deleteBtn: "Delete", editBtn: "Edit", publishBtn: "PUBLISH", addNewProd: "Add New Product",
    manageSubs: "Subscriptions (Stock)", manageProds: "Products (Storefront)", manageInv: "Manage Games",
    manageCats: "Manage Categories", manageCusts: "Manage Customers", finRecords: "Financial Records",
    payGateways: "Payment Gateways & Fees", transTreasury: "Transactions (Treasury)", 
    setMacros: "Settings & Macros", globSet: "Global Settings", managePages: "Manage CMS Pages",
    prodOffers: "Product Offers & Promotions", manageCodes: "Manage Promo Codes", dashboardTitle: "Dashboard",
`;

const arInsert = `
    adminSubs: "الاشتراكات (المخزون)", adminProds: "المنتجات (واجهة المتجر)", adminInv: "المخزون (موروث)",
    adminCats: "الفئات (موروث)", adminSales: "الطلبات والمبيعات", adminCusts: "العملاء",
    adminOrdLeg: "الطلبات (موروث)", adminTrans: "المعاملات (الخزينة)", adminFin: "المالية (موروث)",
    adminPay: "بوابات الدفع", adminMac: "الإعدادات والوحدات", adminSet: "الإعدادات العامة (موروث)",
    adminPages: "صفحات النظام", adminPromos: "العروض", adminPromoCodes: "أكواد الخصم",
    actions: "الإجراءات", typeCol: "النوع", catCol: "الفئة", supplierCol: "المورد",
    sellPriceCol: "سعر البيع", costPriceCol: "سعر التكلفة", nameCol: "الاسم", idCol: "المعرف",
    deleteBtn: "حذف", editBtn: "تعديل", publishBtn: "نشر", addNewProd: "إضافة منتج جديد",
    manageSubs: "الاشتراكات (المخزون)", manageProds: "المنتجات (واجهة المتجر)", manageInv: "إدارة الألعاب",
    manageCats: "إدارة الفئات", manageCusts: "إدارة العملاء", finRecords: "السجلات المالية",
    payGateways: "بوابات الدفع والرسوم", transTreasury: "المعاملات (الخزينة)", 
    setMacros: "الإعدادات والوحدات", globSet: "الإعدادات العامة", managePages: "إدارة صفحات النظام",
    prodOffers: "عروض المنتجات", manageCodes: "إدارة أكواد الخصم", dashboardTitle: "لوحة القيادة",
`;

text = text.replace('exitAdmin: "Exit Dashboard",', 'exitAdmin: "Exit Dashboard",\n' + enInsert);
text = text.replace('exitAdmin: "الخروج من لوحة القيادة",', 'exitAdmin: "الخروج من لوحة القيادة",\n' + arInsert);

fs.writeFileSync('src/translations.ts', text);

let appText = fs.readFileSync('src/App.tsx', 'utf-8');

// Sidebar buttons
appText = appText.replace(/> Subscriptions \(Stock\)<\/button>/g, '>{t[language].adminSubs}</button>');
appText = appText.replace(/> Products \(Storefront\)<\/button>/g, '>{t[language].adminProds}</button>');
appText = appText.replace(/> Inventory \(Legacy\)<\/button>/g, '>{t[language].adminInv}</button>');
appText = appText.replace(/> Categories \(Legacy\)<\/button>/g, '>{t[language].adminCats}</button>');

appText = appText.replace(/> Orders & Sales<\/button>/g, '>{t[language].adminSales}</button>');
appText = appText.replace(/> Customers<\/button>/g, '>{t[language].adminCusts}</button>');
appText = appText.replace(/> Orders \(Legacy\)<\/button>/g, '>{t[language].adminOrdLeg}</button>');

appText = appText.replace(/> Transactions \(Treasury\)<\/button>/g, '>{t[language].adminTrans}</button>');
appText = appText.replace(/> Financials \(Legacy\)<\/button>/g, '>{t[language].adminFin}</button>');
appText = appText.replace(/> Payment Gateways<\/button>/g, '>{t[language].adminPay}</button>');

appText = appText.replace(/> Settings & Macros<\/button>/g, '>{t[language].adminMac}</button>');
appText = appText.replace(/> Global Settings \(Legacy\)<\/button>/g, '>{t[language].adminSet}</button>');
appText = appText.replace(/> CMS Pages<\/button>/g, '>{t[language].adminPages}</button>');

appText = appText.replace(/> Promotions<\/button>/g, '>{t[language].adminPromos}</button>');
appText = appText.replace(/> Promo Codes<\/button>/g, '>{t[language].adminPromoCodes}</button>');


// Tabs Titles
appText = appText.replace(/<Key className="w-5 h-5 text-purple-500"\/> Subscriptions \(Stock\)<\/h3>/g, '<Key className="w-5 h-5 text-purple-500"/> {t[language].manageSubs}</h3>');
appText = appText.replace(/<ShoppingBag className="w-5 h-5 text-purple-500"\/> Products \(Storefront\)<\/h3>/g, '<ShoppingBag className="w-5 h-5 text-purple-500"/> {t[language].manageProds}</h3>');
appText = appText.replace(/<Package className="w-5 h-5 text-purple-500"\/> Manage Games<\/h3>/g, '<Package className="w-5 h-5 text-purple-500"/> {t[language].manageInv}</h3>');
appText = appText.replace(/<Layers className="w-5 h-5 text-purple-500"\/> Manage Categories<\/h3>/g, '<Layers className="w-5 h-5 text-purple-500"/> {t[language].manageCats}</h3>');
appText = appText.replace(/<User className="w-5 h-5 text-purple-500"\/> Manage Customers<\/h3>/g, '<User className="w-5 h-5 text-purple-500"/> {t[language].manageCusts}</h3>');
appText = appText.replace(/<CreditCard className="w-5 h-5 text-purple-500"\/> Financial Records<\/h3>/g, '<CreditCard className="w-5 h-5 text-purple-500"/> {t[language].finRecords}</h3>');
appText = appText.replace(/<CreditCard className="w-5 h-5 text-purple-500"\/> Payment Gateways & Fees<\/h3>/g, '<CreditCard className="w-5 h-5 text-purple-500"/> {t[language].payGateways}</h3>');
appText = appText.replace(/<ShoppingBag className="w-5 h-5 text-purple-500"\/> Orders & Sales<\/h3>/g, '<ShoppingBag className="w-5 h-5 text-purple-500"/> {t[language].adminSales}</h3>');
appText = appText.replace(/<CreditCard className="w-5 h-5 text-purple-500"\/> Transactions \(Treasury\)<\/h3>/g, '<CreditCard className="w-5 h-5 text-purple-500"/> {t[language].transTreasury}</h3>');
appText = appText.replace(/<Settings className="w-5 h-5 text-purple-500"\/> Settings & Macros<\/h3>/g, '<Settings className="w-5 h-5 text-purple-500"/> {t[language].setMacros}</h3>');
appText = appText.replace(/<Settings className="w-5 h-5 text-purple-500"\/> Global Settings<\/h3>/g, '<Settings className="w-5 h-5 text-purple-500"/> {t[language].globSet}</h3>');
appText = appText.replace(/<Layers className="w-5 h-5 text-purple-500"\/> Manage CMS Pages<\/h3>/g, '<Layers className="w-5 h-5 text-purple-500"/> {t[language].managePages}</h3>');
appText = appText.replace(/<Star className="w-5 h-5 text-purple-500"\/> Product Offers & Promotions<\/h3>/g, '<Star className="w-5 h-5 text-purple-500"/> {t[language].prodOffers}</h3>');
appText = appText.replace(/<Tag className="w-5 h-5 text-purple-500"\/> Manage Promo Codes<\/h3>/g, '<Tag className="w-5 h-5 text-purple-500"/> {t[language].manageCodes}</h3>');

// Right side Title (where it says Dashboard or Products etc based on adminTab, etc.)
// First find where Dashboard is
appText = appText.replace(/<h2 className="text-xl font-bold text-white capitalize">\{adminTab\.replace\(\/_\/g, ' '\)\}<\/h2>/g, 
  '<h2 className="text-xl font-bold text-white capitalize">{adminTab === "dashboard" ? t[language].dashboardTitle : adminTab === "subscriptions" ? t[language].adminSubs : adminTab === "products" ? t[language].adminProds : adminTab === "games" ? t[language].adminInv : adminTab === "categories" ? t[language].adminCats : adminTab === "sales" ? t[language].adminSales : adminTab === "customers" ? t[language].adminCusts : adminTab === "orders" ? t[language].adminOrdLeg : adminTab === "transactions" ? t[language].adminTrans : adminTab === "financials" ? t[language].adminFin : adminTab === "payments" ? t[language].adminPay : adminTab === "macros" ? t[language].adminMac : adminTab === "settings" ? t[language].adminSet : adminTab === "pages" ? t[language].adminPages : adminTab === "promotions" ? t[language].adminPromos : adminTab === "promo_codes" ? t[language].adminPromoCodes : adminTab === "support" ? t[language].supChat : adminTab.replace(/_/g, " ")}</h2>');

fs.writeFileSync('src/App.tsx', appText);
