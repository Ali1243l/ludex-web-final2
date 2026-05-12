import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

text = text.replace(
  /Active Customers/g,
  '{t[language].activeCustomers}'
);

text = text.replace(
  /Low Stock Alerts/g,
  '{t[language].lowStockAlerts}'
);

text = text.replace(
  /Total Revenue \(Live\)/g,
  '{t[language].totalRev}'
);

text = text.replace(
  /Pending Orders/g,
  '{t[language].pendingOrdersText}'
);

text = text.replace(
  /System Security Status/g,
  '{t[language].sysSec}'
);

text = text.replace(
  /Recent Sales/g,
  '{t[language].recentSales}'
);

fs.writeFileSync('src/App.tsx', text);
