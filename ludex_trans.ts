import fs from 'fs';

let text = fs.readFileSync('src/translations.ts', 'utf-8');

// Add avatarImg and secureVault, and fix Admin Menu items
text = text.replace(
  `store: "Store",`,
  `store: "Store", avatarImg: "Profile Picture (URL)", secureVault: "Secure Digital Vault", xpRate: "XP Per Dollar",`
);
text = text.replace(
  `store: "المتجر",`,
  `store: "المتجر", avatarImg: "رابط الصورة الشخصية", secureVault: "الخزنة الرقمية الآمنة", xpRate: "نقاط الخبرة لكل دولار",`
);

// Admin dashboard translation improvements
text = text.replace(`adminInv: "المخزون (موروث)"`, `adminInv: "إدارة المخزون"`);
text = text.replace(`adminCats: "الفئات (موروث)"`, `adminCats: "إدارة الفئات"`);
text = text.replace(`adminOrdLeg: "الطلبات (موروث)"`, `adminOrdLeg: "سجل الطلبات القديم"`);
text = text.replace(`adminFin: "المالية (موروث)"`, `adminFin: "إدارة المالية"`);
text = text.replace(`adminSet: "الإعدادات العامة (موروث)"`, `adminSet: "إعدادات المتجر"`);


fs.writeFileSync('src/translations.ts', text);
