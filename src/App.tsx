/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingBag, MessageSquare, Gamepad2, Monitor, Coins, Zap, X, Send, CreditCard, Upload, User, Settings, AlertCircle, CheckCircle2, Shield, Key, Package, Layers, Clock, Gift, Download, Check, Menu } from 'lucide-react';
import { t } from './translations';

const GAMES_DATA = [
  {
    id: 1,
    title: "Elden Ring: Shadow of the Erdtree",
    category: "PC Game Keys",
    type: "Global Key",
    originalPrice: 39.99,
    price: 34.50,
    tags: "Action / RPG / Soulslike",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=600",
    theme: "from-purple-900/60 to-blue-900/40",
    badgeColor: "text-purple-400 border-purple-500/30",
    stock: 12
  },
  {
    id: 2,
    title: "Xbox Game Pass Ultimate - 1 Year",
    category: "Console Subs",
    type: "Subscription",
    originalPrice: 120.00,
    price: 89.99,
    tags: "Service / Gaming Library",
    image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600",
    theme: "from-green-900/60 to-purple-900/40",
    badgeColor: "text-green-400 border-green-500/30",
    stock: 2
  },
  {
    id: 3,
    title: "Steam $50 Gift Card (US)",
    category: "In-game Currency",
    type: "Steam Wallet",
    originalPrice: null,
    price: 52.00,
    tags: "Currency / Prepaid",
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=600",
    theme: "from-blue-900/60 to-black",
    badgeColor: "text-blue-400 border-blue-500/30",
    stock: 0
  }
];

interface Order {
  id: string;
  gameId: number;
  status: 'Pending' | 'Approved';
  receiptUploaded: boolean;
  gameKey?: string;
  amount: number;
  discountApplied?: number;
  finalPrice?: number;
  invoiceNumber?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  receiver: 'admin' | 'user';
  content: string;
  timestamp: string;
  gameId?: number;
}

const CATEGORIES = [
  { name: 'PC Game Keys', icon: Monitor },
  { name: 'Console Subs', icon: Gamepad2 },
  { name: 'In-game Currency', icon: Coins },
  { name: 'Software', icon: Zap }
];

interface CMSPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
}

const INITIAL_PAGES: CMSPage[] = [
  { id: 1, title: 'Privacy Policy', slug: 'privacy', content: 'Our privacy policy details.', lastUpdated: new Date().toISOString() },
  { id: 2, title: 'Terms of Service', slug: 'terms', content: 'Our terms of service.', lastUpdated: new Date().toISOString() },
  { id: 3, title: 'About Us', slug: 'about', content: 'About Ludex Store.', lastUpdated: new Date().toISOString() }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'orders' | 'admin' | 'profile' | 'settings' | 'cart' | 'page'>('store');
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('Zain Cash');

  const [paymentMethodsList, setPaymentMethodsList] = useState([
     { id: 'p1', name: 'Zain Cash', accountDetails: 'Wallet Number: 0770 123 4567', surcharge_percentage: 0, active: true },
     { id: 'p2', name: 'Mastercard', accountDetails: 'Direct link will be emailed.', surcharge_percentage: 20, active: true },
     { id: 'p3', name: 'AsiaHawala', accountDetails: 'Wallet Number: 0770 987 6543', surcharge_percentage: 0, active: true },
     { id: 'p4', name: 'FIB', accountDetails: 'IBAN: IQ12345678901234567890', surcharge_percentage: 0, active: true }
  ]);
  const [newPaymentForm, setNewPaymentForm] = useState({ name: '', accountDetails: '', surcharge_percentage: '0' });
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<{name: string, email: string, role: 'CUSTOMER' | 'MODERATOR' | 'ADMIN'}>({ name: 'Felix user', email: 'felix@example.com', role: 'ADMIN' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);
  const [authForm, setAuthForm] = useState({email: '', password: '', name: ''});

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<number[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'games' | 'categories' | 'customers' | 'orders' | 'financials' | 'settings' | 'pages'>('dashboard');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [currency, setCurrency] = useState<'USD' | 'IQD'>('USD');
  const [globalSettings, setGlobalSettings] = useState({
     currencyRate: 1500,
     storeName: "LUDEX STORE",
     contactEmail: "support@ludexstore.com",
     contactPhone: "0770 123 4567"
  });
  const currencyRate = globalSettings.currencyRate;
  const [gamesList, setGamesList] = useState(GAMES_DATA.map(g => ({...g, active: true})));
  const [cmsPages, setCmsPages] = useState<CMSPage[]>(INITIAL_PAGES);
  
  const [categoriesList, setCategoriesList] = useState([
    { id: 'cat_action', name: 'Action & Adventure', active: true },
    { id: 'cat_fps', name: 'FPS & Shooters', active: true },
    { id: 'cat_rpg', name: 'RPG & Open World', active: true }
  ]);
  const [customersList, setCustomersList] = useState([{ id: 'c1', name: 'Felix user', email: 'felix@example.com', purchaseCount: 3, points: 1500, active: true }]);
  const [financialsList, setFinancialsList] = useState<{id: string, type: 'income' | 'expense', amount: number, description: string, date: string, active: boolean}[]>([]);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartAnimating, setCartAnimating] = useState(false);

  // Loyalty Program Config
  const [loyaltyThreshold, setLoyaltyThreshold] = useState(3);
  const [loyaltyDiscountPercent, setLoyaltyDiscountPercent] = useState(10);
  const [invoiceToView, setInvoiceToView] = useState<Order | null>(null);

  // New Game Form State
  const [newGameForm, setNewGameForm] = useState({
    title: '',
    category: 'PC Game Keys',
    price: '',
    stock: '',
    image: '',
    description: ''
  });
  const [editingGameId, setEditingGameId] = useState<number | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editingOrderForm, setEditingOrderForm] = useState({
     status: '', amount: '', discountApplied: '', finalPrice: ''
  });
  const [newCategoryForm, setNewCategoryForm] = useState({ name: '' });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', email: '', purchaseCount: '0', points: '0' });
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [newFinancialForm, setNewFinancialForm] = useState({ type: 'income', amount: '', description: '', date: '' });
  const [editingFinancialId, setEditingFinancialId] = useState<string | null>(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({...globalSettings});

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', sender: 'admin', receiver: 'user', content: 'Welcome to Ludex Store! How can I help you today?', timestamp: new Date().toISOString() }
  ]);
  const [adminChatMessage, setAdminChatMessage] = useState('');

  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');

  const filteredGames = useMemo(() => {
    let result = gamesList.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory ? game.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price_low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Assuming higher ID is newer
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [searchQuery, activeCategory, sortBy, gamesList]);

  const addToCart = (id: number) => {
    setCart(prev => [...prev, id]);
    setToastMessage("Item added to cart successfully!");
    setCartAnimating(true);
    setTimeout(() => setCartAnimating(false), 400); // match duration
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculate price with currency
  const displayPrice = (priceInUsd: number) => {
      return currency === 'USD' ? `$${priceInUsd.toFixed(2)}` : `${(priceInUsd * currencyRate).toLocaleString()} IQD`;
  };

  // Calculate loyalty
  const approvedOrdersCount = orders.filter(o => o.status === 'Approved').length;
  const isEligibleForLoyaltyDiscount = approvedOrdersCount > 0 && ((approvedOrdersCount + 1) % loyaltyThreshold === 0);
  
  const calculateFinalPrice = (price: number) => {
     let discountAmount = 0;
     if (isEligibleForLoyaltyDiscount) {
        discountAmount = price * (loyaltyDiscountPercent / 100);
     }
     
     const selectedPayment = paymentMethodsList.find(p => p.name === paymentMethod);
     const surchargePercent = selectedPayment?.active ? selectedPayment.surcharge_percentage : 0;
     const discountedPrice = price - discountAmount;
     const surchargeAmount = discountedPrice * (surchargePercent / 100);
     
     return { 
       finalPrice: discountedPrice + surchargeAmount, 
       discountApplied: discountAmount,
       surchargeApplied: surchargeAmount,
       surchargePercent: surchargePercent
     };
  };

  const submitOrder = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    const newOrders = cart.map(gameId => {
      const gamePrice = gamesList.find(g => g.id === gameId)?.price || 0;
      const { finalPrice, discountApplied } = calculateFinalPrice(gamePrice);
      return {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        gameId,
        status: 'Pending' as const,
        receiptUploaded: receiptFile !== null,
        amount: gamePrice,
        finalPrice,
        discountApplied
      };
    });
    setOrders(prev => [...prev, ...newOrders]);
    setCart([]);
    setReceiptFile(null);
    setIsCheckoutModalOpen(false);
    setActiveTab('orders');
  };

  const approveOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { 
        ...o, 
        status: 'Approved', 
        gameKey: 'LUDEX-' + Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000)
      } : o
    ));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newMessage: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      receiver: 'admin',
      content: chatMessage,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const handleAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatMessage.trim()) return;
    const newMessage: ChatMessage = {
      id: Math.random().toString(),
      sender: 'admin',
      receiver: 'user',
      content: adminChatMessage,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, newMessage]);
    setAdminChatMessage('');
  };

  return (
    <div className="min-h-screen h-screen bg-[#050505] text-[#F3F4F6] font-sans flex flex-col overflow-hidden relative select-none">
      {/* Atmospheric Background Glow */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      {activeTab === 'admin' ? (
        (!isLoggedIn || userProfile.role !== 'ADMIN') ? (
           <div className="flex-1 flex flex-col items-center justify-center relative z-20">
             <div className="bg-[#111] border border-red-900/50 rounded-2xl p-8 max-w-sm w-full text-center">
                 <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                 <h2 className="text-2xl font-black text-white mb-2">ACCESS DENIED</h2>
                 <p className="text-gray-400 text-sm mb-6">You do not have the required permissions to view the HQ Portal.</p>
                 <button onClick={() => setActiveTab('store')} className="w-full bg-purple-600 font-bold text-white py-3 rounded-lg hover:bg-purple-500 transition-colors">Return to Store</button>
             </div>
           </div>
        ) : (
        <div className="flex-1 flex overflow-hidden z-10 w-full h-full bg-[#050505]">
          {/* Admin Sidebar */}
          <div className="w-64 bg-[#0a0a0a] border-r border-purple-900/40 p-4 flex flex-col gap-2 relative z-20">
            <div className="px-4 py-6 border-b border-gray-800 mb-6 flex flex-col gap-2">
              <h3 className="font-black text-purple-500 text-xl flex items-center gap-2">
                <Shield className="w-6 h-6" /> LUDEX HQ
              </h3>
              <p className="text-[10px] text-green-400 mt-1 uppercase font-mono bg-green-500/10 px-2 py-1 rounded inline-block w-fit">/ludex-hq-portal</p>
            </div>
            
            <button 
              onClick={() => setAdminTab('dashboard')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'dashboard' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Layers className="w-4 h-4" /> Dashboard
            </button>
            <button 
              onClick={() => setAdminTab('games')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'games' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Package className="w-4 h-4" /> Inventory
            </button>
            <button 
              onClick={() => setAdminTab('categories')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'categories' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Layers className="w-4 h-4" /> Categories
            </button>
            <button 
              onClick={() => setAdminTab('customers')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'customers' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <User className="w-4 h-4" /> Customers
            </button>
            <button 
              onClick={() => setAdminTab('orders')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'orders' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <ShoppingBag className="w-4 h-4" /> Orders
            </button>
            <button 
              onClick={() => setAdminTab('financials')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'financials' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <CreditCard className="w-4 h-4" /> Financials
            </button>
            <button 
              onClick={() => setAdminTab('payments')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'payments' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <CreditCard className="w-4 h-4" /> Payment Gateways
            </button>
            <button 
              onClick={() => setAdminTab('settings')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'settings' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Settings className="w-4 h-4" /> Global Settings
            </button>
            <button 
              onClick={() => setAdminTab('support')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'support' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" /> Support Chat
            </button>
            <button 
              onClick={() => setAdminTab('pages')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'pages' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Layers className="w-4 h-4" /> CMS Pages
            </button>

            <div className="mt-auto border-t border-gray-800 pt-4">
              <button onClick={() => setActiveTab('store')} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors px-4 py-2 text-xs">
                ← Exit Dashboard
              </button>
            </div>
          </div>

          {/* Admin Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            <header className="h-20 border-b border-purple-900/40 bg-[#0a0a0a] px-8 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white capitalize">{adminTab.replace(/([A-Z])/g, ' $1').trim()}</h2>
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_#9333ea]">AD</div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-purple-900/50">
            {adminTab === 'dashboard' && (
              <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Pending Orders</p>
                    <p className="text-4xl font-black text-orange-400 mt-2">{orders.filter(o => o.status === 'Pending').length}</p>
                  </div>
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Low Stock Games</p>
                    <p className="text-4xl font-black text-red-500 mt-2">{gamesList.filter(g => (g.stock || 0) < 3).length}</p>
                  </div>
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total Revenue</p>
                    <p className="text-4xl font-black text-green-400 mt-2">{displayPrice(orders.filter(o => o.status === 'Approved').reduce((acc, o) => acc + (o.finalPrice !== undefined ? o.finalPrice : o.amount), 0))}</p>
                  </div>
                </div>

                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-xl mt-4">
                  <h3 className="text-lg font-bold text-white mb-4">Loyalty Engine Configuration</h3>
                  <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Orders Needed</label>
                        <input type="number" value={loyaltyThreshold} onChange={(e) => setLoyaltyThreshold(parseInt(e.target.value) || 3)} className="w-full bg-black border border-gray-800 rounded p-2 text-white" />
                     </div>
                     <div className="flex-1">
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Discount Percentage</label>
                        <input type="number" value={loyaltyDiscountPercent} onChange={(e) => setLoyaltyDiscountPercent(parseInt(e.target.value) || 10)} className="w-full bg-black border border-gray-800 rounded p-2 text-white" />
                     </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed font-mono">
                     Currently offering {loyaltyDiscountPercent}% off every {loyaltyThreshold} orders.
                     Total discounts awarded: {displayPrice(orders.reduce((acc, o) => acc + (o.discountApplied || 0), 0))}
                  </p>
                </div>
                
                <div className="bg-purple-900/10 border border-purple-500/30 rounded-xl p-8 relative overflow-hidden mt-4">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-transparent"></div>
                  <h3 className="text-xl font-bold text-white mb-2">System Security Status</h3>
                  <ul className="text-sm text-gray-400 space-y-3 mt-4 font-mono">
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-green-400" /> Django app: hq_dashboard routing initialized at /ludex-hq/</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-green-400" /> Admin URL path randomized and secured</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-green-400" /> CSRF_COOKIE_SECURE active</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-green-400" /> UserPassesTestMixin applied to enforce staff_member_required</li>
                  </ul>
                </div>
              </div>
            )}

            {adminTab === 'orders' && (
              <div className="max-w-6xl mx-auto flex flex-col gap-6">
              <div className="overflow-x-auto w-full bg-[#111] border border-gray-800 rounded-xl">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-bold border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4">{t[language].id}</th>
                      <th className="px-6 py-4">{t[language].game}</th>
                      <th className="px-6 py-4">{t[language].rect}</th>
                      <th className="px-6 py-4">{t[language].stat}</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">{t[language].act}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">{t[language].noOrdYet}</td>
                      </tr>
                    )}
                    {orders.map(order => {
                      const game = gamesList.find(g => g.id === order.gameId);
                      const isEditing = editingOrderId === order.id;
                      return (
                        <tr key={order.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs">#{order.id}</td>
                          <td className="px-6 py-4 font-bold text-gray-200">
                            {game?.title}
                            {game && game.stock !== undefined && game.stock < 3 && (
                               <span className="ml-2 px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[9px] uppercase rounded font-bold break-keep whitespace-nowrap">
                                  {t[language].low} ({game.stock})
                               </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {order.receiptUploaded ? (
                              <div 
                                className="w-14 h-10 bg-black border border-purple-500/50 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" 
                                title="View Receipt"
                                onClick={() => {
                                  window.open('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600', '_blank');
                                }}
                              >
                                <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=200" alt="Receipt" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <span className="text-xs text-gray-600">{t[language].none}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                               <select 
                                 value={editingOrderForm.status} 
                                 onChange={e => setEditingOrderForm({...editingOrderForm, status: e.target.value})} 
                                 className="bg-black border border-gray-700 text-white text-xs rounded p-1"
                               >
                                 <option value="Pending">Pending</option>
                                 <option value="Approved">Approved</option>
                               </select>
                            ) : (
                              <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${
                                order.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                              }`}>
                                {order.status === 'Pending' ? t[language].pend : t[language].auth}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono">
                            {isEditing ? (
                              <div className="flex flex-col gap-1">
                                Price: <input type="number" value={editingOrderForm.amount} onChange={e => setEditingOrderForm({...editingOrderForm, amount: e.target.value})} className="w-16 bg-black border border-gray-700 rounded px-1" />
                                Disc: <input type="number" value={editingOrderForm.discountApplied} onChange={e => setEditingOrderForm({...editingOrderForm, discountApplied: e.target.value})} className="w-16 bg-black border border-gray-700 rounded px-1" />
                              </div>
                            ) : (
                              <div>
                                {displayPrice(order.amount)}
                                {order.discountApplied ? ` (-${displayPrice(order.discountApplied)})` : ''}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            {isEditing ? (
                               <div className="flex flex-col gap-2">
                                 <button onClick={() => {
                                   setOrders(orders.map(o => o.id === order.id ? {
                                     ...o,
                                     status: editingOrderForm.status as any,
                                     amount: parseFloat(editingOrderForm.amount),
                                     discountApplied: parseFloat(editingOrderForm.discountApplied) || 0,
                                     finalPrice: parseFloat(editingOrderForm.amount) - (parseFloat(editingOrderForm.discountApplied) || 0)
                                   } : o));
                                   setEditingOrderId(null);
                                 }} className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-xs font-bold transition-colors">
                                   Save
                                 </button>
                                 <button onClick={() => setEditingOrderId(null)} className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold transition-colors">
                                   Cancel
                                 </button>
                               </div>
                            ) : (
                               <>
                                 <button onClick={() => {
                                   setEditingOrderId(order.id);
                                   setEditingOrderForm({
                                     status: order.status,
                                     amount: order.amount.toString(),
                                     discountApplied: (order.discountApplied || 0).toString(),
                                     finalPrice: (order.finalPrice || order.amount).toString()
                                   });
                                 }} className="text-blue-500 hover:text-blue-400 p-1" title="Edit Order">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                 </button>
                                 {order.status === 'Pending' && (
                                  <button 
                                    onClick={() => {
                                      const gameItem = gamesList.find(g => g.id === order.gameId);
                                      if (gameItem && gameItem.stock !== undefined) {
                                          gameItem.stock = Math.max(0, gameItem.stock - 1);
                                          setGamesList([...gamesList]);
                                      }
                                      approveOrder(order.id);
                                    }}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded text-[10px] font-bold transition-colors"
                                  >
                                    Approve
                                  </button>
                                 )}
                                 <button onClick={() => setOrders(orders.filter(o => o.id !== order.id))} className="text-red-500 hover:text-red-400 p-1" title="Delete Order">
                                    <X className="w-4 h-4" />
                                 </button>
                               </>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              </div>
            )}

            {adminTab === 'games' && (
              <div className="max-w-6xl mx-auto flex flex-col gap-6">
              <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2"><Package className="w-5 h-5 text-purple-500"/> Manage Games</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-black border border-gray-800 rounded-xl p-6">
                    <h4 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-widest">Add New Game</h4>
                    <div className="space-y-4">
                      <input type="text" placeholder="Game Title" value={newGameForm.title} onChange={e => setNewGameForm({...newGameForm, title: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                      <div className="flex gap-4">
                        <input type="number" placeholder={`Price (${currency})`} value={newGameForm.price} onChange={e => setNewGameForm({...newGameForm, price: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                        <input type="number" placeholder="Initial Stock" value={newGameForm.stock} onChange={e => setNewGameForm({...newGameForm, stock: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                      </div>
                      <input type="text" placeholder="Cover Image URL" value={newGameForm.image} onChange={e => setNewGameForm({...newGameForm, image: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                      <textarea placeholder="Description (Supports Rich Text HTML)" value={newGameForm.description} onChange={e => setNewGameForm({...newGameForm, description: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white min-h-[120px]"></textarea>
                      <button onClick={() => {
                        if (newGameForm.title && newGameForm.price) {
                           if (editingGameId) {
                               setGamesList(gamesList.map(g => g.id === editingGameId ? {
                                 ...g,
                                 title: newGameForm.title,
                                 category: newGameForm.category,
                                 price: parseFloat(newGameForm.price),
                                 image: newGameForm.image,
                                 description: newGameForm.description,
                                 stock: parseInt(newGameForm.stock) || 0
                               } : g));
                               setEditingGameId(null);
                           } else {
                               const newGame = {
                                 id: Math.max(...gamesList.map(g => g.id), 0) + 1,
                                 title: newGameForm.title,
                                 category: newGameForm.category,
                                 type: 'Global Key',
                                 originalPrice: null,
                                 price: parseFloat(newGameForm.price),
                                 tags: 'New',
                                 image: newGameForm.image || 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=600',
                                 theme: 'from-purple-900/60 to-black',
                                 badgeColor: 'text-purple-400 border-purple-500/30',
                                 stock: parseInt(newGameForm.stock) || 0,
                                 description: newGameForm.description,
                                 active: true
                               };
                               setGamesList([...gamesList, newGame]);
                           }
                           setNewGameForm({title: '', category: 'PC Game Keys', price: '', stock: '', image: '', description: ''});
                        }
                      }} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors">
                        {editingGameId ? 'Update Game' : 'Save Game'}
                      </button>
                      {editingGameId && (
                        <button onClick={() => {
                          setEditingGameId(null);
                          setNewGameForm({title: '', category: 'PC Game Keys', price: '', stock: '', image: '', description: ''});
                        }} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors mt-2">
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 pr-2">
                     {gamesList.map(game => (
                        <div key={game.id} className={`bg-black border ${!game.active ? 'border-red-900/30 opacity-60' : 'border-gray-800'} rounded-lg p-4 flex gap-4 items-center transition-all`}>
                          <img src={game.image} className="w-16 h-16 rounded object-cover border border-gray-700" alt={game.title} />
                          <div className="flex-1">
                            <h5 className="text-sm font-bold text-white flex items-center gap-2">
                               {game.title}
                               {!game.active && <span className="px-2 py-0.5 bg-red-900/30 text-red-500 rounded text-[10px] uppercase">Archived</span>}
                            </h5>
                            <div className="text-xs text-gray-500 mt-1 flex gap-3">
                              <span>{displayPrice(game.price)}</span>
                              <span className={game.stock && game.stock < 3 ? 'text-red-400' : 'text-green-400'}>Stock: {game.stock}</span>
                            </div>
                          </div>
                          <button onClick={() => {
                            setEditingGameId(game.id);
                            setNewGameForm({
                               title: game.title,
                               category: game.category,
                               price: game.price.toString(),
                               stock: game.stock?.toString() || '0',
                               image: game.image,
                               description: game.description || ''
                            });
                          }} className="text-blue-500 hover:text-blue-400 p-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                          <button onClick={() => setGamesList(gamesList.map(g => g.id === game.id ? {...g, active: !g.active} : g))} className={`${game.active ? 'text-orange-500 hover:text-orange-400' : 'text-green-500 hover:text-green-400'} p-2`}>
                            {game.active ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path></svg> 
                            : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path><path d="m14 15-4 4"></path><path d="m10 15 4 4"></path></svg>}
                          </button>
                          <button onClick={() => setGamesList(gamesList.filter(g => g.id !== game.id))} className="text-red-500 hover:text-red-400 p-2"><X className="w-4 h-4"/></button>
                        </div>
                     ))}
                  </div>
                </div>
              </div>
              </div>
            )}

            {adminTab === 'categories' && (
              <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-purple-500"/> Manage Categories</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-black border border-gray-800 rounded-xl p-6">
                      <h4 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-widest">{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h4>
                      <div className="space-y-4">
                        <input type="text" placeholder="Category Name" value={newCategoryForm.name} onChange={e => setNewCategoryForm({name: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                        <button onClick={() => {
                          if (newCategoryForm.name) {
                             if (editingCategoryId) {
                                 setCategoriesList(categoriesList.map(c => c.id === editingCategoryId ? { ...c, name: newCategoryForm.name } : c));
                                 setEditingCategoryId(null);
                             } else {
                                 setCategoriesList([...categoriesList, {
                                   id: Math.max(...categoriesList.map(c => c.id), 0) + 1,
                                   name: newCategoryForm.name,
                                   active: true
                                 }]);
                             }
                             setNewCategoryForm({name: ''});
                          }
                        }} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors">
                          {editingCategoryId ? 'Update Category' : 'Save Category'}
                        </button>
                        {editingCategoryId && (
                          <button onClick={() => {
                            setEditingCategoryId(null);
                            setNewCategoryForm({name: ''});
                          }} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors mt-2">
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 pr-2">
                       {categoriesList.map(cat => (
                          <div key={cat.id} className={`bg-black border ${!cat.active ? 'border-red-900/30 opacity-60' : 'border-gray-800'} rounded-lg p-4 flex gap-4 items-center transition-all`}>
                            <div className="flex-1">
                              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                 {cat.name}
                                 {!cat.active && <span className="px-2 py-0.5 bg-red-900/30 text-red-500 rounded text-[10px] uppercase">Archived</span>}
                              </h5>
                            </div>
                            <button onClick={() => {
                              setEditingCategoryId(cat.id);
                              setNewCategoryForm({ name: cat.name });
                            }} className="text-blue-500 hover:text-blue-400 p-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                            <button onClick={() => setCategoriesList(categoriesList.map(c => c.id === cat.id ? {...c, active: !c.active} : c))} className={`${cat.active ? 'text-orange-500 hover:text-orange-400' : 'text-green-500 hover:text-green-400'} p-2`}>
                              {cat.active ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path></svg> 
                              : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path><path d="m14 15-4 4"></path><path d="m10 15 4 4"></path></svg>}
                            </button>
                            <button onClick={() => setCategoriesList(categoriesList.filter(c => c.id !== cat.id))} className="text-red-500 hover:text-red-400 p-2"><X className="w-4 h-4"/></button>
                          </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'customers' && (
              <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><User className="w-5 h-5 text-purple-500"/> Manage Customers</h3>
                  </div>
                  <div className="overflow-x-auto w-full border border-gray-800 rounded-xl">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-bold border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Purchases</th>
                          <th className="px-4 py-3">Points</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customersList.map(customer => {
                           const isEditing = editingCustomerId === customer.id;
                           return (
                             <tr key={customer.id} className="border-b border-gray-800/50 hover:bg-white/5">
                               <td className="px-4 py-3">{isEditing ? <input type="text" value={newCustomerForm.name} onChange={e => setNewCustomerForm({...newCustomerForm, name: e.target.value})} className="bg-black border border-gray-700 rounded w-full p-1" /> : customer.name}</td>
                               <td className="px-4 py-3">{isEditing ? <input type="text" value={newCustomerForm.email} onChange={e => setNewCustomerForm({...newCustomerForm, email: e.target.value})} className="bg-black border border-gray-700 rounded w-full p-1" /> : customer.email}</td>
                               <td className="px-4 py-3">{isEditing ? <input type="number" value={newCustomerForm.purchaseCount} onChange={e => setNewCustomerForm({...newCustomerForm, purchaseCount: e.target.value})} className="bg-black border border-gray-700 rounded w-20 p-1" /> : customer.purchaseCount}</td>
                               <td className="px-4 py-3">{isEditing ? <input type="number" value={newCustomerForm.points} onChange={e => setNewCustomerForm({...newCustomerForm, points: e.target.value})} className="bg-black border border-gray-700 rounded w-20 p-1" /> : customer.points}</td>
                               <td className="px-4 py-3">
                                 <span className={`px-2 py-1 text-[10px] uppercase rounded font-bold ${customer.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                   {customer.active ? 'Active' : 'Banned'}
                                 </span>
                               </td>
                               <td className="px-4 py-3 flex gap-2">
                                 {isEditing ? (
                                    <>
                                      <button onClick={() => {
                                        setCustomersList(customersList.map(c => c.id === customer.id ? {
                                          ...c,
                                          name: newCustomerForm.name,
                                          email: newCustomerForm.email,
                                          purchaseCount: parseInt(newCustomerForm.purchaseCount) || 0,
                                          points: parseInt(newCustomerForm.points) || 0
                                        } : c));
                                        setEditingCustomerId(null);
                                      }} className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-xs">Save</button>
                                      <button onClick={() => setEditingCustomerId(null)} className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs">Cancel</button>
                                    </>
                                 ) : (
                                    <>
                                      <button onClick={() => {
                                        setEditingCustomerId(customer.id);
                                        setNewCustomerForm({name: customer.name, email: customer.email, purchaseCount: customer.purchaseCount.toString(), points: customer.points.toString()});
                                      }} className="text-blue-500 hover:text-blue-400 p-1">Edit</button>
                                      <button onClick={() => setCustomersList(customersList.map(c => c.id === customer.id ? {...c, active: !c.active} : c))} className={`${customer.active ? 'text-red-500 hover:text-red-400' : 'text-green-500 hover:text-green-400'} p-1`}>
                                        {customer.active ? 'Ban' : 'Unban'}
                                      </button>
                                    </>
                                 )}
                               </td>
                             </tr>
                           )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'financials' && (
              <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-500"/> Financial Records</h3>
                  </div>
                  
                  <div className="bg-black border border-gray-800 rounded-xl p-4 flex gap-4 items-center">
                    <select value={newFinancialForm.type} onChange={e => setNewFinancialForm({...newFinancialForm, type: e.target.value})} className="bg-[#111] border border-gray-800 rounded p-2 text-white">
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                    <input type="number" placeholder="Amount" value={newFinancialForm.amount} onChange={e => setNewFinancialForm({...newFinancialForm, amount: e.target.value})} className="bg-[#111] border border-gray-800 rounded p-2 text-white w-24" />
                    <input type="text" placeholder="Description" value={newFinancialForm.description} onChange={e => setNewFinancialForm({...newFinancialForm, description: e.target.value})} className="bg-[#111] border border-gray-800 rounded p-2 text-white flex-1" />
                    <input type="date" value={newFinancialForm.date} onChange={e => setNewFinancialForm({...newFinancialForm, date: e.target.value})} className="bg-[#111] border border-gray-800 rounded p-2 text-white" />
                    <button onClick={() => {
                       if (newFinancialForm.amount && newFinancialForm.description) {
                          if (editingFinancialId) {
                             setFinancialsList(financialsList.map(f => f.id === editingFinancialId ? {
                               ...f,
                               type: newFinancialForm.type as 'income' | 'expense',
                               amount: parseFloat(newFinancialForm.amount),
                               description: newFinancialForm.description,
                               date: newFinancialForm.date
                             } : f));
                             setEditingFinancialId(null);
                          } else {
                             setFinancialsList([...financialsList, {
                               id: Math.random().toString(36).substr(2, 9),
                               type: newFinancialForm.type as 'income' | 'expense',
                               amount: parseFloat(newFinancialForm.amount),
                               description: newFinancialForm.description,
                               date: newFinancialForm.date || new Date().toISOString().split('T')[0],
                               active: true
                             }]);
                          }
                          setNewFinancialForm({type: 'income', amount: '', description: '', date: ''});
                       }
                    }} className="bg-purple-600 px-4 py-2 rounded text-white font-bold">{editingFinancialId ? 'Update' : 'Add Record'}</button>
                    {editingFinancialId && <button onClick={() => { setEditingFinancialId(null); setNewFinancialForm({type: 'income', amount: '', description: '', date: ''}); }} className="bg-gray-700 px-4 py-2 rounded text-white">Cancel</button>}
                  </div>

                  <div className="overflow-x-auto w-full border border-gray-800 rounded-xl max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-bold border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financialsList.filter(f => f.active).map(record => (
                           <tr key={record.id} className="border-b border-gray-800/50 hover:bg-white/5">
                             <td className="px-4 py-3">{record.date}</td>
                             <td className="px-4 py-3 text-xs uppercase">
                               <span className={record.type === 'income' ? 'text-green-400' : 'text-red-400'}>{record.type}</span>
                             </td>
                             <td className="px-4 py-3 text-gray-300">{record.description}</td>
                             <td className="px-4 py-3 font-mono">{displayPrice(record.amount)}</td>
                             <td className="px-4 py-3 flex gap-2">
                               <button onClick={() => {
                                 setEditingFinancialId(record.id);
                                 setNewFinancialForm({
                                   type: record.type,
                                   amount: record.amount.toString(),
                                   description: record.description,
                                   date: record.date
                                 });
                               }} className="text-blue-500 hover:text-blue-400">Edit</button>
                               <button onClick={() => setFinancialsList(financialsList.map(f => f.id === record.id ? {...f, active: false} : f))} className="text-red-500 hover:text-red-400">Delete</button>
                             </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'payments' && (
              <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-500"/> Payment Gateways & Fees</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-black border border-gray-800 rounded-xl p-6">
                      <h4 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-widest">{editingPaymentId ? 'Edit Gateway' : 'Add New Gateway'}</h4>
                      <div className="space-y-4">
                        <input type="text" placeholder="Gateway Name (e.g. Zain Cash)" value={newPaymentForm.name} onChange={e => setNewPaymentForm({...newPaymentForm, name: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                        <input type="text" placeholder="Account Details (e.g. Wallet Number)" value={newPaymentForm.accountDetails} onChange={e => setNewPaymentForm({...newPaymentForm, accountDetails: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                        <div>
                          <label className="block text-xs uppercase text-gray-500 mb-1 font-bold">Extra Surcharge Fee (%)</label>
                          <input type="number" placeholder="0" value={newPaymentForm.surcharge_percentage} onChange={e => setNewPaymentForm({...newPaymentForm, surcharge_percentage: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                        </div>
                        <button onClick={() => {
                          if (newPaymentForm.name && newPaymentForm.accountDetails) {
                             if (editingPaymentId) {
                                 setPaymentMethodsList(paymentMethodsList.map(p => p.id === editingPaymentId ? {
                                   ...p,
                                   name: newPaymentForm.name,
                                   accountDetails: newPaymentForm.accountDetails,
                                   surcharge_percentage: parseFloat(newPaymentForm.surcharge_percentage) || 0
                                 } : p));
                                 setEditingPaymentId(null);
                             } else {
                                 setPaymentMethodsList([...paymentMethodsList, {
                                   id: Math.random().toString(36).substr(2, 9),
                                   name: newPaymentForm.name,
                                   accountDetails: newPaymentForm.accountDetails,
                                   surcharge_percentage: parseFloat(newPaymentForm.surcharge_percentage) || 0,
                                   active: true
                                 }]);
                             }
                             setNewPaymentForm({name: '', accountDetails: '', surcharge_percentage: '0'});
                          }
                        }} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors">
                          {editingPaymentId ? 'Update Gateway' : 'Save Gateway'}
                        </button>
                        {editingPaymentId && (
                          <button onClick={() => {
                            setEditingPaymentId(null);
                            setNewPaymentForm({name: '', accountDetails: '', surcharge_percentage: '0'});
                          }} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors mt-2">
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 pr-2">
                       {paymentMethodsList.map(method => (
                          <div key={method.id} className={`bg-black border ${!method.active ? 'border-red-900/30 opacity-60' : 'border-gray-800'} rounded-lg p-4 flex gap-4 items-start transition-all`}>
                            <div className="flex-1">
                              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                                 {method.name}
                                 {method.surcharge_percentage > 0 && <span className="px-2 py-0.5 bg-orange-900/30 text-orange-500 rounded text-[10px] font-mono">+{method.surcharge_percentage}% FEE</span>}
                                 {!method.active && <span className="px-2 py-0.5 bg-red-900/30 text-red-500 rounded text-[10px] uppercase">Disabled</span>}
                              </h5>
                              <p className="text-xs text-gray-500 mt-1 font-mono">{method.accountDetails}</p>
                            </div>
                            <button onClick={() => {
                              setEditingPaymentId(method.id);
                              setNewPaymentForm({ 
                                name: method.name, 
                                accountDetails: method.accountDetails, 
                                surcharge_percentage: method.surcharge_percentage.toString() 
                              });
                            }} className="text-blue-500 hover:text-blue-400 p-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                            <button onClick={() => setPaymentMethodsList(paymentMethodsList.map(p => p.id === method.id ? {...p, active: !p.active} : p))} className={`${method.active ? 'text-orange-500 hover:text-orange-400' : 'text-green-500 hover:text-green-400'} p-2 text-xs font-bold uppercase`}>
                              {method.active ? 'Disable' : 'Enable'}
                            </button>
                            <button onClick={() => setPaymentMethodsList(paymentMethodsList.filter(p => p.id !== method.id))} className="text-red-500 hover:text-red-400 p-2"><X className="w-4 h-4"/></button>
                          </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'settings' && (
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-purple-500"/> Global Settings</h3>
                    <button onClick={() => {
                       if (editingSettings) {
                          setGlobalSettings({...settingsForm});
                          setEditingSettings(false);
                       } else {
                          setSettingsForm({...globalSettings});
                          setEditingSettings(true);
                       }
                    }} className="bg-purple-600 px-4 py-2 rounded text-xs font-bold text-white transition">
                      {editingSettings ? 'Save Settings' : 'Edit Settings'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2 font-bold">Store Name</label>
                      {editingSettings ? (
                        <input type="text" value={settingsForm.storeName} onChange={e => setSettingsForm({...settingsForm, storeName: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white text-sm">{globalSettings.storeName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2 font-bold">Currency Rate (1 USD to IQD)</label>
                      {editingSettings ? (
                        <input type="number" value={settingsForm.currencyRate} onChange={e => setSettingsForm({...settingsForm, currencyRate: parseFloat(e.target.value) || 1500})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white text-sm">{globalSettings.currencyRate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2 font-bold">Contact Email</label>
                      {editingSettings ? (
                        <input type="email" value={settingsForm.contactEmail} onChange={e => setSettingsForm({...settingsForm, contactEmail: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white text-sm">{globalSettings.contactEmail}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2 font-bold">Contact Phone</label>
                      {editingSettings ? (
                        <input type="text" value={settingsForm.contactPhone} onChange={e => setSettingsForm({...settingsForm, contactPhone: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white text-sm">{globalSettings.contactPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'support' && (
              <div className="max-w-6xl mx-auto h-[650px]">
              <div className="bg-[#111] border border-gray-800 rounded-xl flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
                  <h3 className="text-white font-bold flex items-center gap-2 text-lg"><MessageSquare className="w-6 h-6 text-purple-500" /> Active Support Tickets</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-gray-800">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'admin' ? 'self-end items-end' : 'self-start items-start'}`}>
                      <span className="text-[10px] text-gray-500 mb-2 flex items-center gap-2">
                        {msg.sender === 'admin' ? 'You (Admin)' : 'User'}
                        {msg.gameId && (
                           <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-[9px] uppercase tracking-wider font-bold shadow-[0_0_10px_rgba(147,51,234,0.1)]">
                             Product: {gamesList.find(g => g.id === msg.gameId)?.title || 'Unknown'}
                           </span>
                        )}
                      </span>
                      <div className={`p-4 rounded-xl text-sm shadow-lg ${
                        msg.sender === 'admin' 
                          ? 'bg-purple-600 text-white rounded-tr-sm' 
                          : 'bg-black border border-gray-800 text-gray-300 rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleAdminReply} className="p-6 border-t border-gray-800 bg-[#1a1a1a] flex gap-4">
                  <input 
                    type="text" 
                    value={adminChatMessage}
                    onChange={e => setAdminChatMessage(e.target.value)}
                    placeholder="Reply to user as Admin..." 
                    className="flex-1 bg-black border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white"
                  />
                  <button type="submit" disabled={!adminChatMessage.trim()} className="bg-purple-600 px-8 font-bold rounded-lg text-white hover:bg-purple-500 disabled:opacity-50 transition-colors">
                    Reply
                  </button>
                </form>
              </div>
              </div>
            )}

            {adminTab === 'pages' && (
              <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-purple-500"/> Manage CMS Pages</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black border border-gray-800 rounded-xl p-5 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 pr-2">
                       {cmsPages.map(page => (
                          <div key={page.id} className="bg-[#111] border border-gray-800 rounded-lg p-4 mb-3">
                            <h4 className="text-sm font-bold text-white mb-2">{page.title} <span className="text-gray-500 font-normal text-xs ml-2">/{page.slug}</span></h4>
                            <textarea 
                              className="w-full bg-black border border-gray-800 rounded p-3 text-xs text-gray-300 focus:outline-none focus:border-purple-500 min-h-[100px]"
                              value={page.content}
                              onChange={(e) => {
                                 const newPages = cmsPages.map(p => p.id === page.id ? { ...p, content: e.target.value } : p);
                                 setCmsPages(newPages);
                              }}
                            />
                            <p className="text-[10px] text-gray-500 mt-2 text-right">Auto-saved</p>
                          </div>
                       ))}
                    </div>
                    <div className="bg-black border border-gray-800 rounded-xl p-5">
                       <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest">Add New Page</h4>
                       <form onSubmit={(e) => {
                          e.preventDefault();
                          const target = e.target as any;
                          const title = target.title.value;
                          const slug = target.slug.value;
                          const content = target.content.value;
                          if (title && slug && content) {
                             setCmsPages([...cmsPages, { id: Math.max(...cmsPages.map(p=>p.id)) + 1, title, slug, content, lastUpdated: new Date().toISOString() }]);
                             target.reset();
                          }
                       }} className="flex flex-col gap-4">
                         <input name="title" type="text" placeholder="Page Title" required className="bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white w-full" />
                         <input name="slug" type="text" placeholder="URL Slug (e.g. refund-policy)" required className="bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white w-full" />
                         <textarea name="content" placeholder="Page Content" required className="bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white w-full min-h-[150px]"></textarea>
                         <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors">Create Page</button>
                       </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
        )
      ) : (
        <>
          {/* Navbar */}
      <nav className="h-20 w-full px-4 md:px-8 flex items-center justify-between border-b border-purple-900/30 bg-black/40 backdrop-blur-md z-10 flex-shrink-0 relative">
        {toastMessage && (
          <div className="fixed bottom-10 right-10 z-[300] bg-purple-600/90 backdrop-blur text-white px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] font-bold flex items-center gap-3 animate-slide-in-toast">
            <CheckCircle2 className="w-5 h-5 text-white" />
            {toastMessage}
          </div>
        )}
        <div className="flex md:hidden flex-1 items-center justify-start">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className="flex items-center justify-center flex-none md:justify-start gap-10">
          <div className="text-xl md:text-2xl font-black tracking-tighter text-white cursor-pointer text-center" onClick={() => { setActiveTab('store'); setIsMobileMenuOpen(false); }}>
            LUDEX<span className="text-purple-500">STORE</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400 tracking-widest">
             <button onClick={() => setActiveTab('store')} className={activeTab === 'store' && activeCategory !== 'Subscriptions' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].store}</button>
             <button onClick={() => { setActiveTab('store'); setActiveCategory('Subscriptions'); }} className={activeTab === 'store' && activeCategory === 'Subscriptions' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].subs || 'Subscriptions'}</button>
             <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].orders}</button>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-20 w-full h-[calc(100vh-5rem)] bg-black/90 backdrop-blur-xl z-50 md:hidden flex flex-col p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300">
             <button onClick={() => { setActiveTab('store'); setIsMobileMenuOpen(false); }} className={`p-4 text-lg text-left font-bold border-b border-purple-900/30 ${activeTab === 'store' && activeCategory !== 'Subscriptions' ? "text-purple-400" : "text-white"}`}>{t[language].store}</button>
             <button onClick={() => { setActiveTab('store'); setActiveCategory('Subscriptions'); setIsMobileMenuOpen(false); }} className={`p-4 text-lg text-left font-bold border-b border-purple-900/30 ${activeTab === 'store' && activeCategory === 'Subscriptions' ? "text-purple-400" : "text-white"}`}>{t[language].subs || 'Subscriptions'}</button>
             <button onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }} className={`p-4 text-lg text-left font-bold border-b border-purple-900/30 ${activeTab === 'orders' ? "text-purple-400" : "text-white"}`}>{t[language].orders}</button>
             
             <div className="relative mt-8 px-2">
               <div className="absolute left-5 top-3 w-5 h-5 text-gray-500">
                 <Search className="w-5 h-5" />
               </div>
               <input 
                 type="text" 
                 placeholder={t[language].search} 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-[#111] border border-purple-900/40 rounded-xl py-3 pl-12 pr-4 text-base focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 min-h-[50px] shadow-inner" 
               />
             </div>
             
             <div className="mt-auto pt-8 flex flex-col gap-4">
                 <div className="flex gap-4">
                    <button onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} className={`flex-1 py-3 rounded-lg border text-sm font-bold ${language === 'en' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-[#111] border-gray-800 text-gray-400'}`}>English</button>
                    <button onClick={() => { setLanguage('ar'); setIsMobileMenuOpen(false); }} className={`flex-1 py-3 rounded-lg border text-sm font-bold ${language === 'ar' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-[#111] border-gray-800 text-gray-400'}`}>العربية</button>
                 </div>
             </div>
          </div>
        )}

        <div className="flex flex-1 items-center justify-end gap-3 md:gap-6">
          <div className="relative hidden md:flex items-center">
            <div className="absolute left-3 w-4 h-4 text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder={t[language].search} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111] border border-purple-900/40 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 transition-colors focus:bg-purple-900/10 min-h-[44px]" 
            />
          </div>
          <div className="flex items-center gap-4">
            <div className={`relative cursor-pointer hover:text-purple-400 text-gray-400 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px] ${cartAnimating ? 'animate-bounce-cart' : ''}`} onClick={() => setActiveTab('cart')}>
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-black rounded-full shadow-[0_0_8px_#ef4444] text-[8px] flex items-center justify-center font-bold text-white transition-all transform hover:scale-110">{cart.length}</span>
              )}
            </div>
            <div className="relative">
              {isLoggedIn ? (
                <>
                  <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-8 h-8 md:w-10 md:h-10 bg-purple-900 rounded-full border border-purple-500/50 cursor-pointer overflow-hidden hover:border-purple-400 transition-colors flex items-center justify-center font-bold text-white uppercase select-none">
                     {userProfile.name.charAt(0)}
                  </div>
                  {isProfileOpen && (
                    <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 bg-[#111] border border-purple-900/50 rounded-xl shadow-xl overflow-hidden z-20 flex flex-col`}>
                      <button onClick={() => { setActiveTab('profile'); setIsProfileOpen(false); }} className="px-4 py-3 text-sm text-start hover:bg-purple-900/30 transition-colors border-b border-gray-800 flex items-center gap-2 text-white">
                        <User className="w-4 h-4" /> {t[language].profile}
                      </button>
                      <button onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }} className="px-4 py-3 text-sm text-start hover:bg-purple-900/30 transition-colors border-b border-gray-800 flex items-center gap-2 text-white">
                        <Settings className="w-4 h-4" /> {t[language].settings}
                      </button>
                      <button onClick={() => { setLanguage(l => l === 'en' ? 'ar' : 'en'); setIsProfileOpen(false); }} className="px-4 py-3 text-sm text-start hover:bg-purple-900/30 transition-colors border-b border-gray-800 text-purple-400 font-bold">
                        {t[language].lang}
                      </button>
                      <button onClick={() => { setCurrency(c => c === 'USD' ? 'IQD' : 'USD'); setIsProfileOpen(false); }} className="px-4 py-3 text-sm text-start hover:bg-purple-900/30 transition-colors border-b border-gray-800 text-purple-400 font-bold">
                        Currency ({currency})
                      </button>
                      <button onClick={() => { 
                          setIsLoggedIn(false); 
                          setUserProfile({name: '', email: '', role: 'CUSTOMER'}); 
                          setIsProfileOpen(false); 
                          if(activeTab === 'admin' || activeTab === 'profile') setActiveTab('store');
                      }} className="px-4 py-3 text-sm text-start text-red-500 hover:bg-red-500/10 transition-colors">{t[language].logout}</button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowAuthModal('login')} className="text-gray-400 hover:text-white text-sm font-bold transition-colors hidden sm:block">Sign In</button>
                  <button onClick={() => setShowAuthModal('register')} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Register</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar / Categories */}
        <aside className="w-64 border-r border-purple-900/20 bg-black/20 p-6 flex-col gap-8 hidden lg:flex">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">{t[language].categories}</h3>
            <ul className="space-y-3">
              {CATEGORIES.map(cat => (
                <li 
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
                  className={`flex items-center gap-3 text-sm p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    activeCategory === cat.name 
                      ? 'text-purple-400 bg-purple-500/10 border-l-2 border-purple-500 font-bold' 
                      : 'text-gray-400 hover:text-purple-400 hover:bg-purple-900/10 border-l-2 border-transparent'
                  }`}
                >
                  <cat.icon className="w-4 h-4 opacity-70" /> {cat.name}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Interface Area conditionally rendered */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">
          {activeTab === 'store' && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
                <div>
                  <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] leading-snug md:leading-tight font-bold tracking-tight">{t[language].discover} <span className="text-purple-500">{t[language].worlds}</span></h1>
                  <p className="text-gray-500 text-sm mt-1">{t[language].desc}</p>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 text-sm border bg-[#0a0a0a] border-purple-900/50 hover:bg-purple-900/20 transition-colors rounded-lg text-gray-300 focus:outline-none w-full md:w-auto min-h-[44px]"
                  >
                    <option value="newest">{t[language].sort || 'Newest'}</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {filteredGames.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-gray-500">
                    <p>{t[language].noGamesFound}</p>
                  </div>
                ) : (
                  filteredGames.map(game => (
                    <div key={game.id} className="group bg-[#0d0d0d] border border-purple-900/20 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:-translate-y-1 flex flex-col">
                      <div onClick={() => { setSelectedGameId(game.id); setIsGameDetailOpen(true); }} className="cursor-pointer">
                        <div className={`h-48 bg-gradient-to-br ${game.theme} relative`}>
                          <img src={game.image} alt={game.title} className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:opacity-80 transition-opacity" />
                          <div className={`absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase border ${game.badgeColor}`}>
                            {game.type}
                          </div>
                          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1">
                            {game.stock && game.stock > 0 ? (
                               <><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div><span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">{t[language].inStock}</span></>
                            ) : (
                               <><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]"></div><span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{t[language].outOfStock}</span></>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between items-stretch">
                        <div onClick={() => { setSelectedGameId(game.id); setIsGameDetailOpen(true); }} className="cursor-pointer">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h4 className="font-bold text-base leading-tight text-gray-100 group-hover:text-purple-400 transition-colors uppercase">{game.title}</h4>
                          </div>
                          <p className="text-[11px] text-gray-500 mb-6">{game.tags}</p>
                        </div>
                        <div className="flex items-end justify-between mt-auto">
                          <div onClick={() => { setSelectedGameId(game.id); setIsGameDetailOpen(true); }} className="cursor-pointer">
                            {game.originalPrice ? (
                              <span className="text-xs text-gray-500 line-through block mb-1">{displayPrice(game.originalPrice)}</span>
                            ) : (
                              <span className="block mb-1 text-transparent select-none text-xs">-</span>
                            )}
                            <p className="font-bold text-purple-400 text-xl leading-none">{displayPrice(game.price)}</p>
                          </div>
                          <button 
                            disabled={!game.stock || game.stock === 0}
                            onClick={(e) => { e.stopPropagation(); addToCart(game.id); }}
                            className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all active:scale-95 shadow-[0_4px_10px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_15px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                          >
                            {t[language].buy}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="max-w-4xl mx-auto w-full flex flex-col items-start gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{t[language].myOrders}</h2>
                <p className="text-gray-400 text-sm">{t[language].track}</p>
              </div>

              {orders.length === 0 ? (
                <div className="w-full p-10 border border-purple-900/30 rounded-2xl bg-black/20 flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-10 h-10 text-purple-900 mb-4" />
                  <p className="text-gray-400">{t[language].noOrd}</p>
                  <button onClick={() => setActiveTab('store')} className="mt-4 px-4 py-2 bg-purple-600 rounded-lg text-white text-sm font-bold hover:bg-purple-500 transition-colors">{t[language].goStore}</button>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4">
                  {orders.map(order => {
                    const game = gamesList.find(g => g.id === order.gameId);
                    return (
                      <div key={order.id} className="w-full bg-[#111] border border-purple-900/30 rounded-xl p-5 flex flex-col md:flex-row gap-6 justify-between md:items-center">
                        <div className="flex gap-4 items-center">
                          <img src={game?.image} className="w-20 h-20 rounded-lg object-cover border border-purple-900/50" alt="" />
                          <div>
                            <p className="font-bold text-white">{game?.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{t[language].id}: #{order.id}</p>
                            <p className="text-purple-400 font-bold mt-2">{displayPrice(order.amount)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-3 min-w-[200px]">
                          {order.status === 'Pending' ? (
                            <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase rounded-md flex items-center justify-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                              {t[language].verify}
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase rounded-md flex items-center justify-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              {t[language].auth}
                            </span>
                          )}
                          {order.gameKey && (
                            <div className="bg-black border border-purple-500/50 rounded-lg px-4 py-2 w-full text-center group cursor-pointer hover:bg-purple-900/20 transition-colors">
                              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{t[language].yourKey}</p>
                              <p className="font-mono text-purple-300 text-sm">{order.gameKey}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}


          {activeTab === 'cart' && (
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-white">{t[language].cart}</h2>
              {cart.length === 0 ? (
                <div className="w-full p-10 border border-purple-900/30 rounded-2xl bg-[#111] flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-10 h-10 text-purple-900 mb-4" />
                  <p className="text-gray-400">{t[language].empty}</p>
                  <button onClick={() => setActiveTab('store')} className="mt-4 px-6 py-2 bg-purple-600 rounded-lg text-white text-sm font-bold hover:bg-purple-500 transition-colors min-h-[44px] flex items-center justify-center">{t[language].goStore}</button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 flex flex-col gap-4">
                    {cart.map((gameId, index) => {
                      const game = gamesList.find(g => g.id === gameId);
                      return (
                        <div key={index} className="flex gap-4 items-center bg-[#111] border border-purple-900/30 p-5 rounded-xl relative group hover:border-purple-500/50 transition-colors">
                          <img src={game?.image} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-purple-900/50" alt={game?.title} />
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-sm md:text-base leading-tight uppercase tracking-wider">{game?.title}</h4>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase tracking-widest">{game?.type}</p>
                            <p className="text-purple-400 font-bold mt-2">{displayPrice(game?.price || 0)}</p>
                          </div>
                          <button 
                            onClick={() => setCart(c => c.filter((_, i) => i !== index))}
                            className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
                            title="Remove from cart"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-full lg:w-80 bg-[#111] rounded-xl p-6 flex flex-col gap-4 h-fit sticky top-0 border" style={{ borderColor: 'rgba(176, 38, 255, 0.3)', boxShadow: '0 0 25px rgba(176,38,255,0.1)' }}>
                    <h3 className="font-bold text-lg border-b border-gray-800 pb-3 text-white uppercase tracking-widest">{t[language].summary}</h3>
                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                      <span>{t[language].items} ({cart.length})</span>
                      <span>{displayPrice(cart.reduce((sum, id) => sum + (gamesList.find(g => g.id === id)?.price || 0), 0))}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                      <span>{t[language].fee}</span>
                      <span>{displayPrice(0)}</span>
                    </div>
                    {isEligibleForLoyaltyDiscount && (
                       <div className="flex justify-between text-sm text-green-400 font-bold mb-1">
                          <span>Loyalty ({loyaltyDiscountPercent}%)</span>
                          <span>-{displayPrice(calculateFinalPrice(cart.reduce((sum, id) => sum + (gamesList.find(g => g.id === id)?.price || 0), 0)).discountApplied)}</span>
                       </div>
                    )}
                    {calculateFinalPrice(cart.reduce((sum, id) => sum + (gamesList.find(g => g.id === id)?.price || 0), 0)).surchargeApplied > 0 && (
                       <div className="flex justify-between text-sm text-orange-400 font-bold mb-1">
                          <span>{paymentMethod} Fee ({calculateFinalPrice(0).surchargePercent}%)</span>
                          <span>+{displayPrice(calculateFinalPrice(cart.reduce((sum, id) => sum + (gamesList.find(g => g.id === id)?.price || 0), 0)).surchargeApplied)}</span>
                       </div>
                    )}
                    <div className="border-t border-gray-800 pt-4 flex justify-between font-bold text-white text-lg font-mono mt-3">
                      <span>{t[language].total}</span>
                      <span className="text-purple-400">{displayPrice(calculateFinalPrice(cart.reduce((sum, id) => sum + (gamesList.find(g => g.id === id)?.price || 0), 0)).finalPrice)}</span>
                    </div>
                    <button 
                      onClick={() => setIsCheckoutModalOpen(true)}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    >
                      {t[language].checkoutBtn}
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
                      <CreditCard className="w-3 h-3" /> {t[language].manual}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-white tracking-widest uppercase">{t[language].profOverview}</h2>
              <div className="bg-[#111] border border-purple-900/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=4c1d95" alt="Avatar" className="w-24 h-24 rounded-full border-2 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] relative z-10" />
                <div className="flex flex-col items-center sm:items-start text-center sm:text-start relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-widest">{userProfile.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 font-mono">Player ID: <span className="text-purple-400 font-bold">#LUDEX-9034</span></p>
                  <div className="flex gap-4">
                    <div className="bg-black border border-gray-800 rounded-lg p-3 text-center min-w-[100px] shadow-inner">
                      <p className="text-2xl font-black text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{orders.length}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Total</p>
                    </div>
                    <div className="bg-black border border-green-900/40 rounded-lg p-3 text-center min-w-[100px] shadow-inner">
                      <p className="text-2xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">{approvedOrdersCount}</p>
                      <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest mt-1">Verified</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loyalty Card Engine */}
              <h3 className="text-xl font-bold text-white mt-4 tracking-widest uppercase flex items-center gap-2">
                 <Zap className="w-5 h-5 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                 Loyalty Dashboard
              </h3>
              <div className="bg-[#0a0a0a] border border-purple-500/30 rounded-2xl p-6 lg:p-8 relative overflow-hidden group shadow-[0_0_30px_rgba(147,51,234,0.1)]">
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent pointer-events-none"></div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                       <h4 className="text-lg font-black text-white uppercase tracking-wider mb-2">LUDEX Elite Card</h4>
                       <p className="text-sm text-gray-400 max-w-md">Your progress towards the next loyalty reward. Connected live to Pixel Store ERP.</p>
                    </div>
                    <button onClick={() => alert('Exporting Loyalty Card Generation...')} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600/20 text-purple-400 border border-purple-500 hover:bg-purple-600 hover:text-white transition-all rounded-lg text-xs font-bold uppercase tracking-widest">
                       <Download className="w-4 h-4" /> Export Card
                    </button>
                 </div>

                 <div className="mt-10 flex items-center justify-between relative max-w-2xl mx-auto">
                    {/* Progress Bar Line */}
                    <div className="absolute left-0 right-0 h-1 bg-gray-800 top-1/2 -translate-y-1/2 z-0 rounded-full">
                       <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_#a855f7]" 
                          style={{ width: `${Math.min((approvedOrdersCount % loyaltyThreshold) / (loyaltyThreshold - 1) * 100, 100)}%` }}
                       ></div>
                    </div>

                    {/* Steps mapping based on loyaltyThreshold */}
                    {Array.from({ length: loyaltyThreshold }).map((_, i) => {
                       const isCompleted = (approvedOrdersCount % loyaltyThreshold) > i || (approvedOrdersCount > 0 && (approvedOrdersCount % loyaltyThreshold) === 0);
                       const isFinalStep = i === loyaltyThreshold - 1;
                       const isActive = (approvedOrdersCount % loyaltyThreshold) === i;

                       return (
                          <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                             <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                                isCompleted 
                                ? 'bg-purple-600 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] text-white scale-110' 
                                : isActive 
                                   ? 'bg-[#111] border-purple-400 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse-glow'
                                   : 'bg-[#111] border-gray-800 text-gray-600'
                             }`}>
                                {isFinalStep ? (
                                   <Gift className={`w-5 h-5 ${isCompleted ? 'text-white' : isActive ? 'text-purple-400' : 'text-gray-600'}`} />
                                ) : isCompleted ? (
                                   <Check className="w-5 h-5 text-white" />
                                ) : (
                                   <span className="font-bold">{i + 1}</span>
                                )}
                             </div>
                             <div className="absolute -bottom-8 whitespace-nowrap">
                                <span className={`text-[10px] uppercase font-bold tracking-widest ${isCompleted || isActive ? 'text-purple-400' : 'text-gray-600'}`}>
                                   {isFinalStep ? 'Reward' : `Purchase ${i + 1}`}
                                </span>
                             </div>
                          </div>
                       );
                    })}
                 </div>
                 
                 <div className="mt-16 text-center">
                    {isEligibleForLoyaltyDiscount ? (
                       <p className="text-green-400 text-sm font-bold animate-pulse">🎉 Congratulations! {loyaltyDiscountPercent}% Discount unlocked for your next purchase.</p>
                    ) : (
                       <p className="text-gray-500 text-xs uppercase tracking-widest">Only {loyaltyThreshold - (approvedOrdersCount % loyaltyThreshold)} purchase(s) away from your next discount.</p>
                    )}
                 </div>
              </div>

              {/* Order History */}
              <h3 className="text-xl font-bold text-white mt-4 tracking-tight">Order History</h3>
              <div className="overflow-x-auto w-full bg-[#111] border border-gray-800 rounded-xl">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-bold border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4">{t[language].id}</th>
                      <th className="px-6 py-4">{t[language].game}</th>
                      <th className="px-6 py-4">{t[language].stat}</th>
                      <th className="px-6 py-4">Key</th>
                      <th className="px-6 py-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">{t[language].noOrdYet}</td>
                      </tr>
                    )}
                    {orders.map(order => {
                      const game = gamesList.find(g => g.id === order.gameId);
                      return (
                        <tr key={order.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs">#{order.id}</td>
                          <td className="px-6 py-4 font-bold text-gray-200">
                            {game?.title}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${
                              order.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                            }`}>
                              {order.status === 'Pending' ? t[language].pend : t[language].auth}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-purple-400 font-bold">
                            {order.status === 'Approved' ? order.gameKey : '---'}
                          </td>
                          <td className="px-6 py-4 text-right">
                             {order.status === 'Approved' && (
                                <button onClick={() => setInvoiceToView(order)} className="text-xs text-blue-400 font-bold hover:text-blue-300 underline underline-offset-2">View</button>
                             )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-white">{t[language].accSet}</h2>
              <form 
                onSubmit={(e) => { e.preventDefault(); alert('Settings saved successfully!'); }}
                className="bg-[#111] border border-purple-900/30 rounded-2xl p-6 flex flex-col gap-5"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].usr}</label>
                  <input 
                    type="text" 
                    value={userProfile.name}
                    onChange={e => setUserProfile({...userProfile, name: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].eml}</label>
                  <input 
                    type="email" 
                    value={userProfile.email}
                    onChange={e => setUserProfile({...userProfile, email: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].pwd}</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors" />
                </div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-colors mt-2 self-start shadow-[0_0_15px_rgba(147,51,234,0.2)]">
                  {t[language].save}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'page' && currentSlug && (() => {
             const page = cmsPages.find(p => p.slug === currentSlug);
             if (!page) return <div className="text-white text-center py-20 font-bold">Page Not Found</div>;
             return (
               <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
                 <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{page.title}</h2>
                 <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                   {page.content}
                 </div>
               </div>
             );
          })()}
        </main>
      </div>

      {/* Game Detail Modal */}
      {isGameDetailOpen && selectedGameId !== null && (() => {
        const game = gamesList.find(g => g.id === selectedGameId);
        if (!game) return null;
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-purple-900/40 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(147,51,234,0.15)]">
              <button 
                onClick={() => setIsGameDetailOpen(false)} 
                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                style={language === 'ar' ? { left: '1rem', right: 'auto' } : {}}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gradient-to-br from-purple-900/20 to-black border-r border-purple-900/30">
                <img src={game.image} className="w-full h-full object-cover mix-blend-overlay opacity-80" alt={game.title} />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                   <div className="bg-black/80 backdrop-blur px-3 py-1.5 w-fit rounded text-xs font-bold uppercase border border-purple-500/30 text-purple-400 mb-3">{game.type}</div>
                   <h2 className="text-3xl font-black text-white">{game.title}</h2>
                </div>
              </div>
              <div className="w-full md:w-1/2 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900/50 flex flex-col gap-6">
                 <div className="flex justify-between items-start">
                   <div>
                     <p className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-1">{game.category}</p>
                     <div className="flex gap-2 items-center">
                        {game.stock && game.stock > 0 ? (
                          <><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div><span className="text-xs text-green-400 font-bold uppercase tracking-wider">{t[language].inStock} ({game.stock})</span></>
                        ) : (
                          <><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]"></div><span className="text-xs text-red-400 font-bold uppercase tracking-wider">{t[language].outOfStock}</span></>
                        )}
                     </div>
                   </div>
                   <div className="text-right">
                      {game.originalPrice && <p className="text-gray-500 line-through text-sm">{displayPrice(game.originalPrice)}</p>}
                      <p className="text-3xl font-black text-purple-400">{displayPrice(game.price)}</p>
                   </div>
                 </div>

                 <div>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{game.description || "Get your digital key instantly after payment. Full warranty included. Easy activation."}</p>
                 </div>

                 <div className="mt-auto pt-6 flex flex-col gap-3">
                   <button 
                      disabled={!game.stock || game.stock === 0}
                      onClick={() => { addToCart(game.id); setIsGameDetailOpen(false); }}
                      className="w-full py-4 rounded-xl bg-purple-600 font-black uppercase tracking-wider hover:bg-purple-500 text-white transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.4)]"
                   >
                      {t[language].buy}
                   </button>
                   <button
                      onClick={() => {
                         setIsChatOpen(true);
                         const newMessage: ChatMessage = {
                            id: Math.random().toString(),
                            sender: 'user',
                            receiver: 'admin',
                            content: `I would like to inquire about: ${game.title}`,
                            timestamp: new Date().toISOString(),
                            gameId: game.id
                         };
                         setChatHistory(prev => [...prev, newMessage]);
                         setIsGameDetailOpen(false);
                      }}
                      className="w-full py-4 rounded-xl bg-transparent border border-gray-700 text-gray-300 font-bold uppercase tracking-wider hover:border-purple-500 hover:text-purple-400 transition-all flex items-center justify-center gap-2"
                   >
                     <MessageSquare className="w-5 h-5" /> استفسر عن هذا المنتج
                   </button>
                 </div>
              </div>
            </div>
          </div>
        );
      })()}

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#111] border border-purple-900/40 rounded-2xl w-full max-w-sm shadow-[0_0_50px_rgba(147,51,234,0.3)] flex flex-col overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
              <h2 className="text-lg font-bold text-white uppercase tracking-widest">
                 {showAuthModal === 'login' ? 'System Login' : 'Create Account'}
              </h2>
              <button onClick={() => setShowAuthModal(null)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {showAuthModal === 'register' && (
                <div>
                  <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Full Name</label>
                  <input type="text" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="Felix User" />
                </div>
              )}
              <div>
                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Email Address</label>
                <input type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="felix@example.com" />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Password</label>
                <input type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" placeholder="••••••••" />
              </div>
              
              <button 
                onClick={() => {
                  if (authForm.email && authForm.password) {
                     // VERY BASIC MOCK AUTH
                     if (showAuthModal === 'login') {
                        if (authForm.email === 'admin@ludex.com') {
                           setUserProfile({ name: 'Admin User', email: 'admin@ludex.com', role: 'ADMIN' });
                        } else {
                           setUserProfile({ name: 'Regular User', email: authForm.email, role: 'CUSTOMER' });
                        }
                     } else {
                        setUserProfile({ name: authForm.name || 'New User', email: authForm.email, role: 'CUSTOMER' });
                     }
                     setIsLoggedIn(true);
                     setShowAuthModal(null);
                     setToastMessage(showAuthModal === 'login' ? 'Successfully logged in.' : 'Account created.');
                     setTimeout(() => setToastMessage(null), 3000);
                  }
                }}
                className="w-full bg-purple-600 font-bold text-white py-3 rounded-lg hover:bg-purple-500 transition-colors mt-2"
              >
                {showAuthModal === 'login' ? 'Authenticate' : 'Register Now'}
              </button>
              
              <div className="text-center mt-2">
                <button 
                  onClick={() => setShowAuthModal(showAuthModal === 'login' ? 'register' : 'login')} 
                  className="text-xs text-gray-400 hover:text-purple-400 transition-colors"
                >
                  {showAuthModal === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end md:justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e1e24] border-t md:border border-purple-900/40 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg shadow-[0_-10px_50px_rgba(147,51,234,0.3)] md:shadow-[0_0_50px_rgba(147,51,234,0.3)] flex flex-col overflow-hidden max-h-[95vh] md:max-h-[90vh] animate-in slide-in-from-bottom-5 duration-300">
            <div className="p-5 border-b border-purple-900/30 flex justify-between items-center bg-[#18181c] flex-shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-500" />
                Select Payment & Upload Receipt
              </h2>
              <button 
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900/50">
              
              {/* Payment Methods */}
              <div className="mb-6">
                 <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Select Payment Method</label>
                 <div className="grid grid-cols-2 gap-3">
                    {paymentMethodsList.filter(p => p.active).map(method => (
                       <div 
                         key={method.id} 
                         onClick={() => setPaymentMethod(method.name)}
                         className={`cursor-pointer border rounded-lg p-3 min-h-[60px] flex flex-col items-center justify-center text-sm font-bold transition-all duration-300 relative
                            ${paymentMethod === method.name ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-[#2a2a32] border-gray-700 text-gray-300 hover:border-purple-500 hover:bg-[#32323a]'}`
                         }
                       >
                          {method.name}
                          {method.surcharge_percentage > 0 && <span className={`text-[10px] uppercase mt-1 ${paymentMethod === method.name ? 'text-purple-200' : 'text-orange-400'}`}>+{method.surcharge_percentage}% FEE</span>}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Transfer Details ({paymentMethod})</label>
                  <div className="bg-[#2a2a32] border border-gray-700 rounded-lg p-4 text-sm font-mono text-white flex justify-between items-center shadow-inner">
                    <span>{paymentMethodsList.find(p => p.name === paymentMethod)?.accountDetails || 'Select a payment method'}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Total Amount ({currency})</label>
                  {isEligibleForLoyaltyDiscount && (
                    <div className="mb-2 bg-green-500/10 border border-green-500/20 text-green-400 p-2 rounded text-xs font-bold flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4" />
                       Loyalty Discount Applied: {loyaltyDiscountPercent}% off!
                    </div>
                  )}
                  {calculateFinalPrice(cart.reduce((sum, id) => sum + (gamesList.find(g => g.id === id)?.price || 0), 0)).surchargeApplied > 0 && (
                    <div className="mb-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 p-2 rounded text-xs font-bold flex flex-col gap-1">
                       <div className="flex items-center gap-2">
                           <AlertCircle className="w-4 h-4" />
                           Surcharge Fee Applied: {calculateFinalPrice(0).surchargePercent}% ({paymentMethod})
                       </div>
                    </div>
                  )}
                  <div className="relative">
                     <input type="text" readOnly value={displayPrice(calculateFinalPrice(cart.reduce((sum, id) => sum + (gamesList.find(g => g.id === id)?.price || 0), 0)).finalPrice)} className="w-full bg-[#2a2a32] border border-gray-700 rounded-lg p-4 text-base font-bold focus:outline-none focus:border-purple-500 text-white shadow-inner" />
                     {isEligibleForLoyaltyDiscount && <span className="absolute right-4 top-4 text-gray-500 line-through text-sm">{displayPrice(cart.reduce((sum, id) => sum + (gamesList.find(g => g.id === id)?.price || 0), 0))}</span>}
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-purple-500/60 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-purple-400 hover:bg-purple-900/20 transition-all cursor-pointer group relative bg-[#2a2a32]">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setReceiptFile(e.target.files[0]);
                  }
                }} />
                {receiptFile ? (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                    <p className="text-sm text-green-400 font-bold max-w-full truncate px-4">{receiptFile.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-medium mt-1">Tap to change file</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center group-hover:bg-purple-600/40 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                      <Upload className="w-6 h-6 text-purple-400 group-hover:text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                    </div>
                    <p className="text-sm text-white font-bold tracking-wide">Upload Payment Receipt</p>
                    <p className="text-[10px] text-purple-400 font-medium uppercase tracking-widest mt-1">JPEG, PNG or PDF limit 5MB</p>
                  </>
                )}
              </div>
              
              <button 
                onClick={submitOrder}
                disabled={cart.length === 0 || receiptFile === null}
                className="w-full mt-6 bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] tracking-wide uppercase"
              >
                Confirm Payment & Upload Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      <div className={`fixed bottom-28 md:bottom-20 ${language === 'ar' ? 'left-4 md:left-8 items-start' : 'right-4 md:right-8 items-end'} z-50 flex flex-col`}>
        {isChatOpen && (
          <div className="bg-[#0a0a0a] border border-purple-900/40 rounded-2xl w-72 sm:w-80 h-[400px] max-h-[60vh] mb-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className="bg-purple-900/20 border-b border-purple-900/40 p-4 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
                <h3 className="font-bold text-sm">{t[language].chatSup}</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-800">
              {chatHistory.map((msg, i) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                    msg.sender === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-sm' 
                      : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-3 border-t border-purple-900/30 bg-black/50 flex gap-2 flex-shrink-0">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={t[language].typeMsg} 
                className="flex-1 bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 min-h-[44px]"
              />
              <button 
                type="submit"
                disabled={!chatMessage.trim()}
                className="bg-purple-600 p-2 rounded-lg text-white hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors min-h-[44px] min-w-[44px] flex justify-center items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
        
        <div 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`bg-purple-600 w-12 h-12 md:w-14 md:h-14 rounded-full cursor-pointer group hover:bg-purple-500 transition-all hover:scale-105 active:scale-95 flex items-center justify-center mt-auto shadow-xl ${!isChatOpen ? 'animate-pulse-glow' : 'shadow-[0_0_30px_rgba(168,85,247,0.4)]'}`}
        >
          {isChatOpen ? (
             <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-white" />
              <div className={`absolute -top-12 ${language === 'ar' ? 'left-0' : 'right-0'} bg-white text-black px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none`}>
                {t[language].chatW}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Bar Info */}
      <footer className="w-full bg-black/60 backdrop-blur-md border-t border-purple-900/30 px-6 md:px-8 py-6 md:py-0 md:h-12 flex flex-col md:flex-row items-center justify-center md:justify-between text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium flex-shrink-0 z-10 relative gap-4 md:gap-0 mt-auto">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <span>&copy; 2026 LUDEX STORE - ALL RIGHTS RESERVED</span>
          {isLoggedIn && userProfile.role === 'ADMIN' && (
            <button 
              onClick={() => setActiveTab('admin')} 
              className="border border-purple-900 px-3 py-1 rounded text-purple-400 hover:bg-purple-900/30 transition-colors bg-black font-bold flex items-center gap-1.5"
            >
              <Shield className="w-3 h-3" /> LUDEX HQ PORTAL
            </button>
          )}
        </div>
        <div className="flex flex-wrap justify-center md:flex-row items-center gap-4 md:gap-6 text-center mt-2 md:mt-0">
          <span className="text-purple-500/80 font-bold">System Status: Optimal</span>
          {cmsPages.map(page => (
            <button 
              key={page.id} 
              onClick={() => { setActiveTab('page'); setCurrentSlug(page.slug); }} 
              className="hover:text-purple-400 transition-colors duration-300 uppercase"
            >
              {page.title}
            </button>
          ))}
        </div>
      </footer>
      </>
    )}

    {/* Invoice Modal */}
    {invoiceToView && (
       <div className="fixed inset-0 z-[200] flex flex-col items-center justify-end md:justify-center bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0a0a0a] border-t md:border border-purple-900/40 rounded-t-3xl md:rounded-xl w-full md:max-w-2xl shadow-[0_-10px_50px_rgba(168,85,247,0.2)] md:shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col max-h-[95vh] md:max-h-[90vh] animate-in slide-in-from-bottom-5 duration-300">
             <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center bg-[#111] flex-shrink-0">
                <h3 className="text-white font-bold text-lg md:text-xl flex items-center gap-2">DIGITAL INVOICE</h3>
                <button onClick={() => setInvoiceToView(null)} className="text-gray-500 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                   <X className="w-6 h-6" />
                </button>
             </div>
             <div className="p-4 md:p-8 overflow-y-auto flex-1 font-mono">
                <div className="flex justify-between items-start border-b border-gray-800 pb-6 md:pb-8 mb-6 md:mb-8">
                   <div>
                      <h2 className="text-2xl font-black text-white tracking-tighter mb-1">LUDEX<span className="text-purple-500">STORE</span></h2>
                      <p className="text-xs text-gray-500">Baghdad, Iraq</p>
                      <p className="text-xs text-gray-500 mt-4 max-w-[200px]">support@ludexstore.com<br/>0770 123 4567</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Invoice Number</p>
                      <p className="text-sm text-white font-bold">{invoiceToView.invoiceNumber || 'INV-XXXX'}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mt-4 mb-1">Date</p>
                      <p className="text-sm text-white font-bold">{new Date().toLocaleDateString()}</p>
                   </div>
                </div>
                
                <div className="mb-8 border border-gray-800 rounded-lg p-6 bg-[#111]">
                   <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Billed To</p>
                   <p className="text-sm text-white font-bold mb-1">{userProfile.name}</p>
                   <p className="text-xs text-gray-400">{userProfile.email}</p>
                </div>

                <table className="w-full text-left text-sm text-gray-300">
                   <thead>
                      <tr className="border-b border-gray-800">
                         <th className="pb-3 text-xs uppercase tracking-widest text-gray-500">Description</th>
                         <th className="pb-3 text-xs uppercase tracking-widest text-gray-500 text-right">Amount</th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr className="border-b border-gray-800/50">
                         <td className="py-4 font-bold text-white">{gamesList.find(g => g.id === invoiceToView.gameId)?.title}</td>
                         <td className="py-4 text-right">{displayPrice(invoiceToView.amount)}</td>
                      </tr>
                   </tbody>
                </table>
                
                <div className="mt-8 flex justify-between items-end border-t border-gray-800 pt-6">
                   <div className="text-xs text-gray-500 max-w-[250px] leading-relaxed">
                      Payment Method: Zain Cash / FIB (Manual Transfer)<br />
                      Thank you for shopping at Ludex Store.
                   </div>
                   <div className="text-right w-64">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-xs text-gray-400">Subtotal:</span>
                         <span className="text-sm text-white">{displayPrice(invoiceToView.amount)}</span>
                      </div>
                      {invoiceToView.discountApplied ? (
                         <div className="flex justify-between items-center mb-2 text-green-400">
                            <span className="text-xs">Loyalty Discount ({loyaltyDiscountPercent}%):</span>
                            <span className="text-sm">-{displayPrice(invoiceToView.discountApplied)}</span>
                         </div>
                      ) : null}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                         <span className="text-sm font-bold text-white uppercase tracking-widest">Total:</span>
                         <span className="text-2xl font-black text-purple-400">
                            {displayPrice(invoiceToView.finalPrice !== undefined ? invoiceToView.finalPrice : invoiceToView.amount)}
                         </span>
                      </div>
                   </div>
                </div>
             </div>
             <div className="p-6 border-t border-gray-800 bg-[#111] flex justify-end gap-4 rounded-b-xl">
                <button onClick={() => window.print()} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-lg transition-colors">
                   Print PDF
                </button>
             </div>
          </div>
       </div>
    )}
    </div>
  );
}
