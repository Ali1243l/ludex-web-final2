import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');
text = text.replace('import { Search, ShoppingBag, MessageSquare, Gamepad2, Monitor, Coins, Zap, X, Send, CreditCard, Upload, User, Settings,', 'import { Search, ShoppingBag, MessageSquare, Gamepad2, Monitor, Coins, Zap, X, Send, CreditCard, Upload, User, Settings, Home, ListOrdered,');
fs.writeFileSync('src/App.tsx', text);
