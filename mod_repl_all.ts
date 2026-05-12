import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Top nav Auth Buttons
text = text.replace(/>Sign In<\/button>/g, '>{t[language].signIn}</button>');
text = text.replace(/>Register<\/button>/g, '>{t[language].register}</button>');

// Auth Modal
text = text.replace(/>SYSTEM LOGIN<\/h2>/g, '>{t[language].systemLogin}</h2>');
text = text.replace(/>SYSTEM REGISTER<\/h2>/g, '>{t[language].systemRegister}</h2>');
text = text.replace(/>EMAIL \/ USERNAME<\/label>/g, '>{t[language].emailOrUsername}</label>');
text = text.replace(/>PASSWORD<\/label>/g, '>{t[language].passwordUpper}</label>');
text = text.replace(
  `{showAuthModal === 'login' ? 'Authenticate' : 'Register Now'}`,
  `{showAuthModal === 'login' ? t[language].authenticate : t[language].registerNow}`
);
text = text.replace(
  `{showAuthModal === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}`,
  `{showAuthModal === 'login' ? t[language].noAccount : t[language].hasAccount}`
);

// User Dashboard Sidebar
text = text.replace(/>User Dashboard<\/h2>/g, '>{t[language].userDashboard}</h2>');
text = text.replace(/> Profile & Loyalty/g, '> {t[language].profileLoyalty}');
text = text.replace(/> Order History/g, '> {t[language].orderHistory}');
text = text.replace(/> Account Settings/g, '> {t[language].accSet}');
text = text.replace(/>Loyalty Dashboard<\/h3>/g, '>{t[language].loyaltyDashboard}</h3>');

// Admin Dashboard Nav
text = text.replace(/> Dashboard<\/button>/g, '> {t[language].dashboard}</button>');
text = text.replace(/> Catalog & Stock<\/div>/g, '> {t[language].catalogStock}</div>');
text = text.replace(/> Sales & CRM<\/div>/g, '> {t[language].salesCrm}</div>');
text = text.replace(/> Financial Ledger<\/div>/g, '> {t[language].finLedger}</div>');
text = text.replace(/> System & Tools<\/div>/g, '> {t[language].sysTools}</div>');
text = text.replace(/> Marketing & Offers<\/div>/g, '> {t[language].marketing}</div>');
text = text.replace(/>← Exit Dashboard<\/button>/g, '>← {t[language].exitDashboard}</button>');


// Admin Dashboard Stats
text = text.replace(/>ACTIVE CUSTOMERS/g, '>{t[language].activeCustomers}');
text = text.replace(/>LOW STOCK ALERTS/g, '>{t[language].lowStockAlerts}');
text = text.replace(/>TOTAL REVENUE \(LIVE\)/g, '>{t[language].totalRev}');
text = text.replace(/>PENDING ORDERS/g, '>{t[language].pendingOrdersText}');
text = text.replace(/>System Security Status<\/h3>/g, '>{t[language].sysSec}</h3>');
text = text.replace(/>Recent Sales<\/h3>/g, '>{t[language].recentSales}</h3>');

fs.writeFileSync('src/App.tsx', text);
console.log("App.tsx updated");
