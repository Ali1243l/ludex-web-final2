import fs from 'fs';
let text = fs.readFileSync('src/translations.ts', 'utf-8');

text = text.replace(
  `storeCategory: "Store Category", typeRegion: "Type/Region Tag"`,
  `storeCategory: "Store Category", typeRegion: "Type/Region Tag", pcKeys: "PC Game Keys", consoleSubs: "Console Subs", inGameCurrency: "In-game Currency", software: "Software"`
);

text = text.replace(
  `storeCategory: "تصنيف المتجر", typeRegion: "النوع/المنطقة (تگ)"`,
  `storeCategory: "تصنيف المتجر", typeRegion: "النوع/المنطقة (تگ)", pcKeys: "ألعاب PC", consoleSubs: "اشتراكات الكونسول", inGameCurrency: "عملات الألعاب", software: "برمجيات"`
);

fs.writeFileSync('src/translations.ts', text);
