import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Dashboard text fix
text = text.replace(
  /<Layers className="w-4 h-4" \/> Dashboard/g,
  '<Layers className="w-4 h-4" /> {t[language].dashboard}'
);

text = text.replace(
  /<Package className="w-4 h-4" \/> Catalog & Stock<\/div>/g,
  '<Package className="w-4 h-4" /> {t[language].catalogStock}</div>'
);

text = text.replace(
  /<User className="w-4 h-4" \/> Sales & CRM<\/div>/g,
  '<User className="w-4 h-4" /> {t[language].salesCrm}</div>'
);

text = text.replace(
  /<CreditCard className="w-4 h-4" \/> Financial Ledger<\/div>/g,
  '<CreditCard className="w-4 h-4" /> {t[language].finLedger}</div>'
);

text = text.replace(
  /<Settings className="w-4 h-4" \/> System & Tools<\/div>/g,
  '<Settings className="w-4 h-4" /> {t[language].sysTools}</div>'
);

text = text.replace(
  /<Star className="w-4 h-4" \/> Marketing & Offers<\/div>/g,
  '<Star className="w-4 h-4" /> {t[language].marketing}</div>'
);

// Loyalty Dashboard
text = text.replace(
  /Loyalty Dashboard\n\s*<\/h3>/g,
  '{t[language].loyaltyDashboard}\n              </h3>'
);

// Exit dashboard
text = text.replace(
  /← Exit Dashboard/g,
  '← {t[language].exitDashboard}'
);

// Settings inputs in Auth modal
text = text.replace(
  `{showAuthModal === 'login' ? 'Email / Username' : 'Email Address'}`,
  `{showAuthModal === 'login' ? t[language].emailOrUsername : t[language].eml}`
);
text = text.replace(
  `<label className="block text-xs uppercase text-gray-500 font-bold mb-1">Password</label>`,
  `<label className="block text-xs uppercase text-gray-500 font-bold mb-1">{t[language].passwordUpper}</label>`
);


// Sidebar user text
text = text.replace(
  /Profile & Loyalty/g,
  '{t[language].profileLoyalty}'
);
text = text.replace(
  /Order History/g,
  '{t[language].orderHistory}'
);
text = text.replace(
  /Account Settings/g,
  '{t[language].accSet}'
);


fs.writeFileSync('src/App.tsx', text);
