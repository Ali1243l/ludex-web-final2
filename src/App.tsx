/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingBag, MessageSquare, Gamepad2, Monitor, Coins, Zap, X, Send, CreditCard, Upload, User, Settings, Home, ListOrdered, AlertCircle, CheckCircle2, Shield, Key, Package, Layers, Clock, Gift, Download, Check, Menu, Filter, ChevronDown, LogOut, Star, Tag, TrendingUp } from 'lucide-react';
import { supabase } from './supabase'; // Keep it for storage for now
import { signUp, signIn, signOut, getCurrentUser, fetchUserAttributes, signInWithRedirect, deleteUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { t } from './translations';

import { AuthModal } from './AuthModal';
const GAMES_DATA = [
  { id: 1, title: "Elden Ring: Shadow of the Erdtree", category: "PC Game Keys", type: "Global Key", originalPrice: 39.99, price: 34.50, stock: 12, rating: 4.8, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg", description: "Venture into the Land of Shadow with the newest expansion. Discover hidden secrets and battle fearsome new bosses." },
  { id: 2, title: "Grand Theft Auto V", category: "Console Subs", type: "PS5 Premium Edition", originalPrice: 39.99, price: 19.99, stock: 150, rating: 4.8, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg", description: "Includes the complete GTAV story experience, Grand Theft Auto Online, and the Criminal Enterprise Starter Pack for PS5." },
  { id: 3, title: "EA SPORTS FC 24", category: "PC Game Keys", type: "Nintendo Switch", originalPrice: 69.99, price: 35.00, stock: 5, rating: 4.2, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900.jpg", description: "A new era for The World's Game on Nintendo Switch: 19,000+ fully licensed players, 700+ teams, and 30+ leagues playing together." },
  { id: 4, title: "Call of Duty: Modern Warfare III", category: "PC Game Keys", type: "Xbox Series X", originalPrice: 69.99, price: 55.00, stock: 18, rating: 4.0, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1938090/library_600x900.jpg", description: "A direct sequel to the record-breaking Call of Duty: Modern Warfare II." },
  { id: 5, title: "PlayStation Plus Deluxe - 12 Months", category: "Console Subs", type: "Subscription", originalPrice: 159.99, price: 135.00, stock: 3, rating: 4.7, image: "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?auto=format&fit=crop&q=80&w=600", description: "Enjoy all PlayStation Plus Essential benefits, access to hundreds of games, and exclusive classic titles." },
  { id: 6, title: "Xbox Game Pass Ultimate - 3 Months", category: "Console Subs", type: "Subscription", originalPrice: 49.99, price: 39.99, stock: 25, rating: 4.9, image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600", description: "Unlimited access to over 100 high-quality console and PC games, plus Xbox Live Gold and EA Play." },
  { id: 7, title: "Cyberpunk 2077: Phantom Liberty", category: "PC Game Keys", type: "Global Key", originalPrice: 29.99, price: 25.50, stock: 50, rating: 4.5, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg", description: "A new spy-thriller adventure for Cyberpunk 2077. Return as cyber-enhanced mercenary V and embark on a high-stakes mission." },
  { id: 8, title: "Baldur's Gate 3", category: "PC Game Keys", type: "Global Key", originalPrice: null, price: 59.99, stock: 22, rating: 5.0, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg", description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival." },
  { id: 9, title: "Hogwarts Legacy", category: "PC Game Keys", type: "Global Key", originalPrice: 59.99, price: 42.50, stock: 8, rating: 4.6, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900.jpg", description: "An immersive, open-world action RPG set in the world first introduced in the Harry Potter books." },
  { id: 10, title: "Valorant Points (1000 VP) TR", category: "In-game Currency", type: "Riot PIN", originalPrice: null, price: 10.50, stock: 120, rating: 4.9, image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=600", description: "In-game currency to purchase skins, battle passes and Radianite points in Valorant." },
  { id: 11, title: "Steam $50 Gift Card (US)", category: "In-game Currency", type: "Steam Wallet", originalPrice: null, price: 52.00, stock: 0, rating: 4.7, image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=600", description: "Top up your Steam Wallet instantly to buy games, software, and more. Code is delivered instantly upon approval." },
  { id: 12, title: "Roblox 1000 Robux", category: "In-game Currency", type: "Robux", originalPrice: null, price: 9.99, stock: 55, rating: 4.6, image: "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?auto=format&fit=crop&q=80&w=600", description: "Get Robux to purchase upgrades for your avatar or buy special abilities in games." }
];

interface Order {
  id: string;
  gameId: number;
  status: 'Pending' | 'Approved';
  receiptUploaded: boolean;
  receiptUrl?: string;
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
  { id: 3, title: 'About Us', slug: 'about', content: 'About Pixel Store.', lastUpdated: new Date().toISOString() }
];

const getAuthToken = async (): Promise<string | null> => {
   try {
      const { fetchAuthSession } = await import('aws-amplify/auth');
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() || (await getAuthToken());
   } catch {
      return (await getAuthToken());
   }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'orders' | 'admin' | 'profile' | 'settings' | 'cart' | 'page' | 'user_dashboard'>('store');
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('Zain Cash');
  
  // New States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleGamesCount, setVisibleGamesCount] = useState(12);
  const [userDashboardTab, setUserDashboardTab] = useState<'profile' | 'orders' | 'settings'>('profile');


  const [paymentMethodsList, setPaymentMethodsList] = useState([
     { id: 'p1', name: 'Zain Cash', accountDetails: 'Wallet Number: 0770 123 4567', surcharge_percentage: 0, active: true },
     { id: 'p2', name: 'Mastercard', accountDetails: 'Direct link will be emailed.', surcharge_percentage: 20, active: true },
     { id: 'p3', name: 'AsiaHawala', accountDetails: 'Wallet Number: 0770 987 6543', surcharge_percentage: 0, active: true },
     { id: 'p4', name: 'FIB', accountDetails: 'IBAN: IQ12345678901234567890', surcharge_percentage: 0, active: true }
  ]);
  const [newPaymentForm, setNewPaymentForm] = useState({ name: '', accountDetails: '', surcharge_percentage: '0' });
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);
  const [authForm, setAuthForm] = useState({email: '', password: '', name: ''});

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<(number | string)[]>([ ]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGameDetailOpen, setIsGameDetailOpen] = useState(false);
  const [isGameDetailLoading, setIsGameDetailLoading] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<number | string | null>(null);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'games' | 'categories' | 'customers' | 'users' | 'orders' | 'financials' | 'payments' | 'settings' | 'support' | 'pages' | 'promotions' | 'promo_codes' | 'subscriptions' | 'products' | 'transactions' | 'sales' | 'macros'>('dashboard');
  const [adminMenuState, setAdminMenuState] = useState({ catalog: false, marketing: false, sales: false, ledger: false, system: false });
  const toggleAdminMenu = (menu: 'catalog' | 'marketing' | 'sales' | 'ledger' | 'system') => setAdminMenuState(prev => ({ ...prev, [menu]: !prev[menu] }));
  
  // Real DB States
  const [subList, setSubList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [salesList, setSalesList] = useState<any[]>([]);
  const [transList, setTransList] = useState<any[]>([]);
  const [settingsList, setSettingsList] = useState<any[]>([]);
  const [publicProducts, setPublicProducts] = useState<any[]>([]);
  const [promoModal, setPromoModal] = useState<{isOpen: boolean, product: any, discountPrice: string, isFeatured: boolean}>({
    isOpen: false, product: null, discountPrice: '', isFeatured: false
  });

  // Universal CRUD State
  const [crudModal, setCrudModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    table: string;
    item: any;
    fields: { name: string, label: string, type: 'text' | 'number' | 'boolean' | 'select' | 'password', options?: string[] }[];
  }>({
    isOpen: false, mode: 'create', table: '', item: null, fields: []
  });
  const [isLoadingStore, setIsLoadingStore] = useState(true);

  const handleCrudSubmit = async (formData: any) => {
    try {
      const token = (await getAuthToken());
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
      const endpoint = crudModal.mode === 'create' 
         ? `/api/admin/${crudModal.table}` 
         : `/api/admin/${crudModal.table}/${crudModal.item.id}`;
      const method = crudModal.mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(endpoint, { method, headers, body: JSON.stringify(formData) });
      if (res.ok) {
         setCrudModal({ ...crudModal, isOpen: false });
         setToastMessage('Saved successfully!');
         setTimeout(() => setToastMessage(null), 3000);
         // Re-fetch depending on table
         if (crudModal.table === 'subscriptions') {
            const r = await fetch('/api/admin/subscriptions', { headers });
            if (r.ok) setSubList(await r.json());
         }
         else if (crudModal.table === 'products') {
            const r = await fetch('/api/admin/products', { headers });
            if (r.ok) setProductList(await r.json());
         }
         else if (crudModal.table === 'sales') {
            const r = await fetch('/api/admin/sales', { headers });
            if (r.ok) setSalesList(await r.json());
         }
         else if (crudModal.table === 'transactions') {
            const r = await fetch('/api/admin/transactions', { headers });
            if (r.ok) setTransList(await r.json());
         }
         else if (crudModal.table === 'settings') {
            const r = await fetch('/api/admin/settings', { headers });
            if (r.ok) setSettingsList(await r.json());
         }
      } else {
         const d = await res.json();
         setToastMessage("Error: " + (d.error || 'Failed to save data.'));
         setTimeout(() => setToastMessage(null), 5000);
      }
    } catch(e: any) {
      console.error(e);
      setToastMessage("Failed to save data.");
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleQuickUpdate = async (table: string, id: string | number, data: any) => {
    try {
      const token = (await getAuthToken());
      const res = await fetch(`/api/admin/${table}/${id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
         body: JSON.stringify(data)
      });
      if (res.ok) {
         setToastMessage('Updated successfully!');
         setTimeout(() => setToastMessage(null), 3000);
         // Re-fetch depending on table
         const headers = { 'Authorization': `Bearer ${token}` };
         if (table === 'subscriptions') {
            const r = await fetch('/api/admin/subscriptions', { headers });
            if (r.ok) setSubList(await r.json());
         }
         else if (table === 'products') {
            const r = await fetch('/api/admin/products', { headers });
            if (r.ok) setProductList(await r.json());
         }
         else if (table === 'sales') {
            const r = await fetch('/api/admin/sales', { headers });
            if (r.ok) setSalesList(await r.json());
         }
         else if (table === 'transactions') {
            const r = await fetch('/api/admin/transactions', { headers });
            if (r.ok) setTransList(await r.json());
         }
         else if (table === 'settings') {
            const r = await fetch('/api/admin/settings', { headers });
            if (r.ok) setSettingsList(await r.json());
         }
      } else {
         const d = await res.json();
         setToastMessage("Error: " + (d.error || 'Failed to update data.'));
         setTimeout(() => setToastMessage(null), 5000);
      }
    } catch(e) { console.error(e); }
  };

  const handleCrudDelete = async (table: string, id: string | number) => {
    // Custom logic to avoid blocking iframe. Using a toast for success, and skipping confirm due to iframe blocks.
    try {
      const token = (await getAuthToken());
      const res = await fetch(`/api/admin/${table}/${id}`, {
         method: 'DELETE',
         headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok || res.status === 204) {
         setToastMessage('Item deleted!');
         setTimeout(() => setToastMessage(null), 3000);
         // Re-fetch depending on table
         const headers = { 'Authorization': `Bearer ${token}` };
         if (table === 'subscriptions') {
            const r = await fetch('/api/admin/subscriptions', { headers });
            if (r.ok) setSubList(await r.json());
         }
         else if (table === 'products') {
            const r = await fetch('/api/admin/products', { headers });
            if (r.ok) setProductList(await r.json());
         }
         else if (table === 'sales') {
            const r = await fetch('/api/admin/sales', { headers });
            if (r.ok) setSalesList(await r.json());
         }
         else if (table === 'transactions') {
            const r = await fetch('/api/admin/transactions', { headers });
            if (r.ok) setTransList(await r.json());
         }
         else if (table === 'settings') {
            const r = await fetch('/api/admin/settings', { headers });
            if (r.ok) setSettingsList(await r.json());
         }
      } else {
         const d = await res.json();
         setToastMessage("Error: " + (d.error || 'Failed to delete.'));
         setTimeout(() => setToastMessage(null), 5000);
      }
    } catch(e) { console.error(e); }
  };


  // Promotions / Announcements
  

  
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  useEffect(() => {
     const int = setInterval(() => {
        setHeroSlideIdx(prev => (prev + 1));
     }, 5000);
     return () => clearInterval(int);
  }, []);

const [promotions, setPromotions] = useState([
    { id: '1', title: 'Summer Gaming Festival', description: 'Up to 50% off on top titles!', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200', linkToCategory: 'Special Offers', active: true }
  ]);
const [usersList, setUsersList] = useState<any[]>([]);
  const [newPromotion, setNewPromotion] = useState({ id: '', title: '', description: '', imageUrl: '', linkToCategory: '', active: true });

  // Promo Codes
  const [promoCodes, setPromoCodes] = useState([
    { id: '1', code: 'PIXEL10', discountPercent: 10, expiryDate: '2026-12-31', usageLimit: 100, usedCount: 0, active: true },
  ]);
  const [activePromoCode, setActivePromoCode] = useState<any>(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [newPromoCode, setNewPromoCode] = useState({ id: '', code: '', discountPercent: '', expiryDate: '', usageLimit: '', usedCount: 0, active: true });

  const [language, setLanguage] = useState<'en' | 'ar'>('ar');
  const [currency, setCurrency] = useState<'USD' | 'IQD'>((localStorage.getItem('pixel_currency') as 'USD' | 'IQD') || 'IQD');
  useEffect(() => {
    localStorage.setItem('pixel_currency', currency);
  }, [currency]);

  const [globalSettings, setGlobalSettings] = useState({
     currencyRate: 1500,
     storeName: "Pixel Store",
     contactEmail: "support@pixelstore.com",
     contactPhone: "0770 123 4567",
     xpMultiplier: 10
  });
  const currencyRate = globalSettings.currencyRate;
  const [gamesList, setGamesList] = useState(GAMES_DATA.map(g => ({...g, active: true, views_count: Math.floor(Math.random() * 100), sales_count: Math.floor(Math.random() * 50), is_preorder: g.id % 5 === 0, release_date: g.id % 5 === 0 ? '2026-11-20' : null})));
  const [publishModal, setPublishModal] = useState<{isOpen: boolean, subscription: any, costPrice: string, sellingPrice: string, image: string, type: string, category: string}>({
      isOpen: false, subscription: null, costPrice: '', sellingPrice: '', image: '', type: 'Account', category: 'Game'
  });
  const [cmsPages, setCmsPages] = useState<CMSPage[]>(INITIAL_PAGES);
  
  const [categoriesList, setCategoriesList] = useState([
    { id: 'cat_action', name: 'Action & Adventure', active: true },
    { id: 'cat_fps', name: 'FPS & Shooters', active: true },
    { id: 'cat_rpg', name: 'RPG & Open World', active: true }
  ]);
  const [financialsList, setFinancialsList] = useState<{id: string, type: 'income' | 'expense', amount: number, description: string, date: string, active: boolean}[]>([]);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartAnimating, setCartAnimating] = useState(false);

  // Session inactivity timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // 15 minutes of inactivity
    const INACTIVITY_LIMIT = 15 * 60 * 1000;
    
    const resetTimer = () => {
       clearTimeout(timeout);
       if (isLoggedIn) {
          timeout = setTimeout(() => {
             setIsLoggedIn(false);
             setUserProfile(null);
             if (activeTab === 'admin' || activeTab === 'user_dashboard' || activeTab === 'profile' || activeTab === 'settings' || activeTab === 'orders' || activeTab === 'cart') {
                setActiveTab('store');
             }
             setToastMessage('Session expired due to inactivity.');
             setTimeout(() => setToastMessage(null), 3000);
          }, INACTIVITY_LIMIT);
       }
    };

    resetTimer();
    
    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));
    
  
  return () => {
       clearTimeout(timeout);
       activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isLoggedIn, activeTab]);

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
    const fetchPublicData = async () => {
      try {
        const res = await fetch('/api/public/products');
        if (res.ok) {
           const dbProducts = await res.json();
           setPublicProducts(dbProducts);
           const mappedDb = dbProducts.map((p: any) => ({
              id: p.id,
              title: p.name,
              category: p.category,
              type: p.type || 'Digital',
              originalPrice: null,
              price: Number(p.sellingPrice) || 0,
              stock: 99,
              rating: 5,
              image: p.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
              description: `Storefront item for ${p.name}`,
              active: true
           }));
           // Avoid injecting duplicates into gamesList if they already exist (e.g. by name/id)
           setGamesList(prev => {
              const base = Object.keys(prev).length && prev[0].title ? prev : GAMES_DATA.map(g => ({...g, active: true, views_count: Math.floor(Math.random() * 100), sales_count: Math.floor(Math.random() * 50), is_preorder: g.id % 5 === 0, release_date: g.id % 5 === 0 ? '2026-11-20' : null}));
              // filter out any previously dynamically added items (we'll just append to GAMES_DATA)
              return [...GAMES_DATA.map(g => ({...g, active: true, views_count: Math.floor(Math.random() * 100), sales_count: Math.floor(Math.random() * 50), is_preorder: g.id % 5 === 0, release_date: g.id % 5 === 0 ? '2026-11-20' : null})), ...mappedDb];
           });
        }
      } catch (e) {
        console.error("Failed to fetch public products", e);
      }

      try {
        const resPromo = await fetch('/api/public/showcase');
        if (resPromo.ok) {
           const dbPromos = await resPromo.json();
           if (dbPromos && dbPromos.length > 0) {
              setPromotions(dbPromos.map((p: any) => ({
                 id: p.id,
                 title: p.title || '',
                 description: p.description || '',
                 imageUrl: p.image_url || p.imageUrl || '',
                 linkToCategory: p.link_to_category || p.linkToCategory || '',
                 active: p.active !== false
              })));
           }
        }
      } catch (e) {
        console.error("Failed to fetch showcase", e);
      } finally {
        setTimeout(() => setIsLoadingStore(false), 800);
      }
    };
    fetchPublicData();
  }, []);

  useEffect(() => {
    if (activeTab === 'admin') {
       const fetchAdminData = async () => {
         const token = (await getAuthToken());
         const headers = { 'Authorization': `Bearer ${token}` };
         try {
           if (['dashboard', 'subscriptions'].includes(adminTab)) {
              const res = await fetch('/api/admin/subscriptions', { headers });
              if (res.ok) setSubList(await res.json());
           }
           if (['dashboard', 'products', 'promotions'].includes(adminTab)) {
              const res = await fetch('/api/admin/products', { headers });
              if (res.ok) setProductList(await res.json());
           }
           if (['dashboard', 'promotions'].includes(adminTab)) {
              const res = await fetch('/api/admin/promotions', { headers });
              if (res.ok) setPromotions(await res.json());
           }
           if (['dashboard', 'sales'].includes(adminTab)) {
              const res = await fetch('/api/admin/sales', { headers });
              if (res.ok) setSalesList(await res.json());
           }
           if (['dashboard', 'transactions'].includes(adminTab)) {
              const res = await fetch('/api/admin/transactions', { headers });
              if (res.ok) setTransList(await res.json());
           }
           if (['users'].includes(adminTab)) {
              try {
                const { data, error } = await supabase.from('profiles').select('*');
                if (error) {
                   console.error("Supabase select error (admin users):", error);
                } else if (data) {
                   setUsersList(data);
                }
              } catch(e) {
                 console.error("Failed to fetch admin backend profiles", e);
              }
           }
           if (['dashboard', 'macros'].includes(adminTab)) {
              const res = await fetch('/api/admin/settings', { headers });
              if (res.ok) setSettingsList(await res.json());
           }
         } catch(e) {
           console.error("Failed to fetch admin backend data", e);
         }
       };
       if (isLoggedIn) {
          fetchAdminData();
       }
    }
  }, [activeTab, adminTab, isLoggedIn]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    let isMounted = true;
    const checkUser = async () => {
      try {
        console.log('[Auth Hub] Checking for active user session...');
        const user = await getCurrentUser();
        if (user) {
          console.log('[Auth Hub] Cognito session found. User:', user.userId);
          
          let attributes: any = {};
          try {
             attributes = await fetchUserAttributes();
          } catch (attrErr: any) {
             console.error('[Auth Hub] Error fetching attributes:', attrErr);
             // If we can't get attributes (e.g. scope missing), the session is invalid for our app.
             // We MUST sign out to clear the zombie session!
             await signOut();
             throw new Error('Zombie session cleaned. User must re-authenticate properly.');
          }

          if (isMounted) setIsLoggedIn(true);

          const userId = user.userId || attributes.sub;
          const userEmail = attributes.email;
          const userDisplayName = attributes.name || '';

          // Query Supabase directly
          console.log('[Supabase Sync] Querying profile for:', userId);
          try {
            const { data: existingProfile, error: selectError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle();

            if (selectError) {
              console.error('[Supabase Sync] select error:', selectError.message);
            }

            let profileData = existingProfile;

            // If profile does not exist, immediately INSERT
            if (!existingProfile && userId && userEmail) {
              console.log('[Supabase Sync] Profile NOT FOUND. Inserting new user profile.');
              const isAdmin = userEmail === 'admin@pixel.com';
              const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([{
                  id: userId,
                  email: userEmail,
                  display_name: userDisplayName || '',
                  role: isAdmin ? 'ADMIN' : 'USER',
                  platforms: [],
                  interests: []
                }])
                .select()
                .single();

              if (insertError) {
                console.error('[Supabase Sync] Insert error (new profile):', insertError.message);
              } else {
                console.log('[Supabase Sync] Success inserting new profile.', newProfile);
                profileData = newProfile;
              }
            } else if (existingProfile) {
                console.log('[Supabase Sync] Profile FOUND for', existingProfile.email);
                if (existingProfile.email !== userEmail) {
                  // optional: update email if drifted
                  console.log('[Supabase Sync] Email drifted. Updating to', userEmail);
                  await supabase.from('profiles').update({ email: userEmail }).eq('id', userId);
                }
            }

            if (isMounted && profileData) {
              setUserProfile((prev: any) => ({
                 ...prev,
                 ...profileData
              }));

              // Strict Onboarding Guard
              if (!profileData.display_name || !profileData.platforms || profileData.platforms.length === 0) {
                 console.log('[Onboarding Guard] Missing platforms. Enforcing onboarding flow.');
                 // The early return in render handles the redirect, but we can also set tab
                 setActiveTab('onboarding');
              } else {
                 console.log('[Auth Hub] User ready. Continuing to the application.');
              }
            }
          } catch(e) { 
            console.error('[Supabase Sync] Execution error:', e); 
          }
        } else {
           console.log('[Auth Hub] No active user session.');
        }
      } catch (err) {
        console.log('[Auth Hub] Not logged in currently.', err);
        if (isMounted) setIsLoggedIn(false);
      }
    };
    checkUser();

    // Listen for Auth changes in Hub
    console.log('[Auth Hub] Registering auth listener...');
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      console.log(`[Auth Hub] Event fired: ${payload.event}`);
      switch (payload.event) {
        case 'signedIn':
        case 'signUp':
        case 'autoSignIn':
          console.log('[Auth Hub] Triggering checkUser()...');
          checkUser();
          break;
        case 'signedOut':
          console.log('[Auth Hub] Triggering logout state cleanup...');
          if (isMounted) setIsLoggedIn(false);
          break;
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (showAuthModal && isLoggedIn) {
      setShowAuthModal(null);
    }
  }, [showAuthModal, isLoggedIn]);

  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: '1', sender: 'admin', receiver: 'user', content: 'Welcome to Pixel Store! How can I help you today?', timestamp: new Date().toISOString() }
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

  
  const handleOpenGameDetail = (id: number | string) => {
    setSelectedGameId(id);
    setIsGameDetailOpen(true);
    setIsGameDetailLoading(true);
    setTimeout(() => setIsGameDetailLoading(false), 800);
    setGamesList(prev => prev.map(g => g.id === id ? {...g, views_count: (typeof g.views_count === 'number' ? g.views_count : 0) + 1} : g));
  };

  const addToCart = (id: number | string) => {
    setCart(prev => [...prev, id]);
    setToastMessage("Item added to cart successfully!");
    setCartAnimating(true);
    setTimeout(() => setCartAnimating(false), 400); // match duration
    setTimeout(() => setToastMessage(null), 3000);
  };


  // Calculate price with currency
  const getTier = (xp: number) => {
    const b = globalSettings.bronzeLimit || 1000;
    const s = globalSettings.silverLimit || 5000;
    const g = globalSettings.goldLimit || 10000;
    if (xp < b) return { name: 'Bronze', color: 'text-orange-400', threshold: b };
    if (xp < s) return { name: 'Silver', color: 'text-gray-300', threshold: s };
    if (xp < g) return { name: 'Gold', color: 'text-yellow-400', threshold: g };
    return { name: 'Diamond', color: 'text-cyan-400', threshold: xp };
  };
  const currentTier = getTier(userProfile?.xp_points || 0);
  const xpPercentage = currentTier.name === 'Diamond' ? 100 : Math.min(((userProfile?.xp_points || 0) / currentTier.threshold) * 100, 100);


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
     if (activePromoCode) {
        discountAmount += (price - discountAmount) * (activePromoCode.discountPercent / 100);
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

  const applyPromoCode = () => {
    setPromoError('');
    if (!promoCodeInput.trim()) return;
    
    const code = promoCodes.find(p => p.code.toLowerCase() === promoCodeInput.trim().toLowerCase() && p.active);
    if (!code) {
      setPromoError('Invalid or inactive promo code.');
      return;
    }
    
    if (code.usedCount >= code.usageLimit) {
      setPromoError('Promo code usage limit reached.');
      return;
    }
    
    if (new Date(code.expiryDate) < new Date()) {
      setPromoError('Promo code has expired.');
      return;
    }
    
    setActivePromoCode(code);
    setPromoCodeInput('');
  };

  const removePromoCode = () => {
    setActivePromoCode(null);
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      setToastMessage("Cart is empty!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (paymentMethod !== 'CREDIT_CARD' && !receiptFile) {
      setToastMessage("Warning: Please upload a payment receipt screenshot!");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    
    let receiptUrl = '';
    if (receiptFile) {
       const fileExt = receiptFile.name.split('.').pop();
       const fileName = `receipt-\${Math.random().toString(36).substring(2, 10)}.\${fileExt}`;
       try {
         const { data, error } = await supabase.storage.from('receipts').upload(fileName, receiptFile);
         if (error) {
            setToastMessage('Error uploading receipt: ' + error.message);
            setTimeout(() => setToastMessage(null), 3000);
            return;
         }
         receiptUrl = data.path;
       } catch(err) {
         console.error(err);
         setToastMessage('Failed to connect to storage.');
         setTimeout(() => setToastMessage(null), 3000);
         return;
       }
    }

    const newOrders = cart.map(gameId => {
      const gamePrice = gamesList.find(g => g.id === gameId)?.price || 0;
      const { finalPrice, discountApplied } = calculateFinalPrice(gamePrice);
      return {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        gameId,
        status: 'Pending' as const,
        receiptUploaded: receiptFile !== null,
        receiptUrl,
        amount: gamePrice,
        finalPrice,
        discountApplied
      };
    });
    setOrders(prev => [...prev, ...newOrders]);
    
    if (activePromoCode) {
       setPromoCodes(promoCodes.map(p => p.id === activePromoCode.id ? { ...p, usedCount: p.usedCount + 1 } : p));
    }
    
    setCart([]);
    setReceiptFile(null);
    setIsCheckoutModalOpen(false);
    setActiveTab('orders');

    // Telegram Notification API logic
    try {
       const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
       const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
       
       if (botToken && chatId) {
          const totalAmount = newOrders.reduce((sum, o) => sum + o.finalPrice, 0);
          const orderIds = newOrders.map(o => o.id).join(', ');
          
          const message = `🔔 *New Order Received!*\n\n👤 *Customer:* ${userProfile?.display_name || userProfile?.email}\n💰 *Total Price:* $${totalAmount.toFixed(2)}\n🆔 *Order IDs:* ${orderIds}\n🔗 [View in HQ Portal](${window.location.origin}/?tab=admin)`;
                          
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  chat_id: chatId,
                  text: message,
                  parse_mode: 'Markdown'
              })
          });
       }
    } catch (e) {
       console.error('Failed to send Telegram notification', e);
    }
  };

  const approveOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { 
        ...o, 
        status: 'Approved', 
        gameKey: 'PIXEL-' + Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
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

  if (isLoggedIn && userProfile && (!userProfile?.display_name || !userProfile?.platforms || userProfile?.platforms.length === 0)) {
     return (
        <div className="bg-[#050505] min-h-screen font-sans text-white flex flex-col items-center justify-center p-4 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-purple-900/10 blur-[150px] pointer-events-none rounded-full" />
            
            <div className="max-w-2xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in zoom-in-95 duration-500 relative z-10">
               
               <div className="text-center mb-4 flex flex-col items-center gap-2">
                 <div className="flex items-center gap-2 mb-2">
                    <Gamepad2 className="w-8 h-8 text-purple-500" />
                    <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-600">LUDEX</span>
                 </div>
               </div>

               <div className="bg-[#0a0a0a] border border-purple-900/50 rounded-3xl p-8 md:p-12 w-full shadow-[0_0_80px_rgba(147,51,234,0.1)] flex flex-col gap-8">
                 <div className="text-center space-y-3">
                   <div className="w-20 h-20 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                     <User className="w-10 h-10 text-purple-400" />
                   </div>
                   <h2 className="text-3xl font-black text-white tracking-wide">
                     {language === 'ar' ? 'أكمل ملفك الشخصي' : 'Complete Your Profile'}
                   </h2>
                   <p className="text-gray-400 text-sm max-w-md mx-auto">
                     {language === 'ar' ? 'خطوة واحدة أخيرة قبل أن تتمكن من استكشاف المتجر وشراء الألعاب والوصول إلى العروض الحصرية.' : 'One last step before you can explore the store, purchase games, and access exclusive deals.'}
                   </p>
                 </div>

                 <form className="flex flex-col gap-6" onSubmit={async (e) => {
                    e.preventDefault();
                    if (!userProfile?.display_name || !userProfile?.platforms || userProfile?.platforms.length === 0) {
                        setToastMessage(language === 'ar' ? 'يرجى إكمال الحقول المطلوبة' : 'Please fill all required fields');
                        setTimeout(() => setToastMessage(null), 3000);
                        return;
                    }
                    try {
                        let uId = userProfile?.id;
                        if (!uId) {
                          try {
                            const currentUser = await getCurrentUser();
                            const attributes = await fetchUserAttributes();
                            uId = currentUser?.userId || attributes?.sub;
                          } catch (e) {
                            console.error('Error fetching current user:', e);
                          }
                        }
                        if (!uId) {
                          setToastMessage('Error updating profile: missing user ID.');
                          return;
                        }

                        console.log('[Onboarding] Saving onboarding data for user:', uId);
                        const { data, error } = await supabase.from('profiles').update({
                           display_name: userProfile?.display_name,
                           platforms: userProfile?.platforms,
                           interests: userProfile?.interests || []
                        }).eq('id', uId).select().single();
                        
                        if (!error && data) {
                           console.log('[Onboarding] Profile updated successfully.');
                           setToastMessage(language === 'ar' ? 'تم تجهيز حسابك بنجاح!' : 'Profile updated successfully!');
                           setUserProfile({ ...userProfile, ...data });
                           setTimeout(() => setToastMessage(null), 2000);
                           setActiveTab('store');
                        } else {
                           console.error('[Onboarding] Supabase profile update error:', error);
                           setToastMessage('Error updating profile');
                           setTimeout(() => setToastMessage(null), 3000);
                        }
                    } catch(err) {
                        console.error('[Onboarding Error]', err);
                    }
                 }}>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                        <User className="w-4 h-4 text-purple-500" />
                        {language === 'ar' ? 'اسم العرض' : 'Display Name'}
                        <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={userProfile?.display_name || ''} 
                        onChange={e => setUserProfile({...userProfile, display_name: e.target.value})} 
                        className="w-full bg-[#111] border border-gray-800 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-all placeholder:text-gray-600 font-bold" 
                        placeholder={language === 'ar' ? 'مثال: MasterChief99' : 'e.g. MasterChief99'} 
                        required 
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                        <Monitor className="w-4 h-4 text-purple-500" />
                        {language === 'ar' ? 'منصات اللعب' : 'Platforms'}
                        <span className="text-gray-600 text-[10px] ml-1">{language === 'ar' ? '(اختر واحدة على الأقل)' : '(Select at least one)'}</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'].map(plat => (
                           <button type="button" key={plat} onClick={() => {
                              const curr = userProfile?.platforms || [];
                              setUserProfile({...userProfile, platforms: curr.includes(plat) ? curr.filter((p:string) => p !== plat) : [...curr, plat]});
                           }} className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all active:scale-95 flex items-center gap-2 ${userProfile?.platforms?.includes(plat) ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(147,51,234,0.2)]' : 'bg-[#111] border-gray-800 text-gray-400 hover:border-gray-600'}`}>
                             {plat === 'PC' && <Monitor className="w-4 h-4" />}
                             {plat === 'PlayStation' && <Gamepad2 className="w-4 h-4" />}
                             {plat === 'Xbox' && <Gamepad2 className="w-4 h-4" />}
                             {plat === 'Nintendo' && <Gamepad2 className="w-4 h-4" />}
                             {plat}
                           </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                        <Star className="w-4 h-4 text-purple-500" />
                        {language === 'ar' ? 'الاهتمامات' : 'Interests'}
                        <span className="text-gray-600 text-[10px] ml-1">{language === 'ar' ? '(اختياري)' : '(Optional)'}</span>
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['Action', 'RPG', 'Strategy', 'Sports', 'Racing', 'FPS'].map(int => (
                           <button type="button" key={int} onClick={() => {
                              const curr = userProfile?.interests || [];
                              setUserProfile({...userProfile, interests: curr.includes(int) ? curr.filter((i:string) => i !== int) : [...curr, int]});
                           }} className={`px-5 py-2.5 rounded-xl text-[13px] font-bold border transition-all active:scale-95 flex items-center ${userProfile?.interests?.includes(int) ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(147,51,234,0.2)]' : 'bg-[#111] border-gray-800 text-gray-400 hover:border-gray-600'}`}>
                             {int}
                           </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 group">
                        {language === 'ar' ? 'بدء اللعب' : 'Start Playing'}
                        <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                      </button>
                    </div>
                 </form>
               </div>
            </div>
            
            {toastMessage && (
               <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] bg-[#111] border border-purple-500/50 backdrop-blur-md min-w-[300px] text-white px-6 py-4 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.3)] font-bold flex items-center justify-center gap-3 animate-in slide-in-from-top-4 duration-300 pointer-events-none">
                 <CheckCircle2 className="w-5 h-5 text-purple-400" />
                 {toastMessage}
               </div>
            )}
        </div>
     );
  }

  return (
    <>
    <div dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen h-screen bg-[#050505] text-[#F3F4F6] font-sans flex flex-col overflow-hidden relative select-none pb-20 md:pb-0">
      {/* Atmospheric Background Glow */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      {activeTab === 'admin' ? (
        (!isLoggedIn || userProfile?.role !== 'ADMIN') ? (
           <div className="flex-1 flex flex-col items-center justify-center relative z-20 h-full w-full bg-[#050505]">
             <div className="text-center space-y-6">
                 <h1 className="text-9xl font-black text-purple-900/40">404</h1>
                 <h2 className="text-3xl font-black text-white px-4">PAGE NOT FOUND</h2>
                 <p className="text-gray-500 max-w-sm mx-auto px-4">The route you are trying to access does not exist or you don't have authorization.</p>
                 <button onClick={() => { setActiveTab('store'); setActiveCategory(null); }} className="mt-8 px-8 py-3 bg-[#111] border border-purple-900/50 rounded-xl text-white font-bold hover:bg-purple-900/20 transition-all flex items-center gap-2 mx-auto">
                    Return to Home
                 </button>
             </div>
           </div>
        ) : (
        <div className="flex-1 flex overflow-hidden z-10 w-full h-full bg-[#050505]">
          {/* Admin Sidebar */}
          <div className="w-64 bg-[#0a0a0a] border-e border-purple-900/40 p-4 flex flex-col gap-2 relative z-20 overflow-y-auto custom-scrollbar flex-shrink-0 h-full">
            <div className="px-4 py-6 border-b border-gray-800 mb-6 flex flex-col gap-2">
              <h3 className="font-black text-purple-500 text-xl flex items-center gap-2">
                <Shield className="w-6 h-6" /> Pixel HQ
              </h3>
              <p className="text-[10px] text-green-400 mt-1 uppercase font-mono bg-green-500/10 px-2 py-1 rounded inline-block w-fit">/pixel-hq-portal</p>
            </div>
            
            <button 
              onClick={() => setAdminTab('dashboard')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'dashboard' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Layers className="w-4 h-4" /> {t[language].dashboard}
            </button>
            <button 
              onClick={() => setAdminTab('support')} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${adminTab === 'support' ? 'bg-purple-600/20 text-green-400 border border-green-500/30' : 'text-green-500 hover:bg-white/5 hover:text-green-400'}`}
            >
              <MessageSquare className="w-4 h-4" /> Support Chat
            </button>
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => toggleAdminMenu('catalog')} 
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3"><Package className="w-4 h-4" /> {t[language].catalogStock}</div>
                <ChevronDown className={`w-4 h-4 transition-transform ${adminMenuState.catalog ? 'rotate-180' : ''}`} />
              </button>
              {adminMenuState.catalog && (
                <div className="pl-6 flex flex-col gap-1">
                  <button onClick={() => setAdminTab('subscriptions')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'subscriptions' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Key className="w-4 h-4" />{t[language].adminSubs}</button>
                  <button onClick={() => setAdminTab('products')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'products' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><ShoppingBag className="w-4 h-4" />{t[language].adminProds}</button>
                  <button onClick={() => setAdminTab('games')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'games' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Package className="w-4 h-4" />{t[language].adminInv}</button>
                  <button onClick={() => setAdminTab('categories')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'categories' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Layers className="w-4 h-4" />{t[language].adminCats}</button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <button 
                onClick={() => toggleAdminMenu('sales')} 
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3"><User className="w-4 h-4" /> {t[language].salesCrm}</div>
                <ChevronDown className={`w-4 h-4 transition-transform ${adminMenuState.sales ? 'rotate-180' : ''}`} />
              </button>
              {adminMenuState.sales && (
                <div className="pl-6 flex flex-col gap-1">
                  <button onClick={() => setAdminTab('sales')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'sales' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><ShoppingBag className="w-4 h-4" />{t[language].adminSales}</button>
                  <button onClick={() => setAdminTab('orders')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'orders' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><ShoppingBag className="w-4 h-4" />{t[language].adminOrdLeg}</button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <button 
                onClick={() => toggleAdminMenu('ledger')} 
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3"><CreditCard className="w-4 h-4" /> {t[language].finLedger}</div>
                <ChevronDown className={`w-4 h-4 transition-transform ${adminMenuState.ledger ? 'rotate-180' : ''}`} />
              </button>
              {adminMenuState.ledger && (
                <div className="pl-6 flex flex-col gap-1">
                  <button onClick={() => setAdminTab('transactions')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'transactions' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><CreditCard className="w-4 h-4" />{t[language].adminTrans}</button>
                  <button onClick={() => setAdminTab('financials')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'financials' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><CreditCard className="w-4 h-4" />{t[language].adminFin}</button>
                  <button onClick={() => setAdminTab('payments')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'payments' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><CreditCard className="w-4 h-4" />{t[language].adminPay}</button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <button 
                onClick={() => toggleAdminMenu('system')} 
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3"><Settings className="w-4 h-4" /> {t[language].sysTools}</div>
                <ChevronDown className={`w-4 h-4 transition-transform ${adminMenuState.system ? 'rotate-180' : ''}`} />
              </button>
              {adminMenuState.system && (
                <div className="pl-6 flex flex-col gap-1">
                  <button onClick={() => setAdminTab('macros')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'macros' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Settings className="w-4 h-4" />{t[language].adminMac}</button>
                  <button onClick={() => setAdminTab('settings')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'settings' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Settings className="w-4 h-4" />{t[language].adminSet}</button>
                  <button onClick={() => setAdminTab('users')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'users' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Shield className="w-4 h-4" />{language === 'ar' ? 'المستخدمين والصلاحيات' : 'Users & Roles'}</button>
                  <button onClick={() => setAdminTab('pages')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'pages' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Layers className="w-4 h-4" />{t[language].adminPages}</button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <button 
                onClick={() => toggleAdminMenu('marketing')} 
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <div className="flex items-center gap-3"><Star className="w-4 h-4" /> {t[language].marketing}</div>
                <ChevronDown className={`w-4 h-4 transition-transform ${adminMenuState.marketing ? 'rotate-180' : ''}`} />
              </button>
              {adminMenuState.marketing && (
                <div className="pl-6 flex flex-col gap-1">
                  <button onClick={() => setAdminTab('promotions')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'promotions' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Star className="w-4 h-4" />{t[language].adminPromos}</button>
                  <button onClick={() => setAdminTab('promo_codes')} className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'promo_codes' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Tag className="w-4 h-4" />{t[language].adminPromoCodes}</button>
                </div>
              )}
            </div>

            <div className="mt-auto border-t border-gray-800 pt-4 flex flex-col gap-2">
              <button onClick={() => { setActiveTab('store'); setActiveCategory(null); }} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors px-4 py-2 text-xs">
                ← {t[language].exitDashboard}
              </button>
              <button 
                onClick={async () => { 
                          try {
                             await signOut();
                          } catch (e) {
                             console.error('Sign out error:', e);
                          }
                          setIsLoggedIn(false); 
                  setUserProfile(null); 
                  setActiveTab('store'); 
                  setActiveCategory(null); 
                }} 
                className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition-colors px-4 py-2 text-xs rounded-lg"
              >
                <LogOut className="w-4 h-4" /> Logout
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
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2"><ShoppingBag className="w-3 h-3 text-orange-400" /> {t[language].pendingOrdersText}</p>
                    <p className="text-4xl font-black text-orange-400 mt-2">{orders.filter(o => o.status === 'Pending').length}</p>
                  </div>
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2"><TrendingUp className="w-3 h-3 text-green-400" /> {t[language].totalRev}</p>
                    <p className="text-4xl font-black text-green-400 mt-2">{displayPrice(orders.filter(o => o.status === 'Approved').reduce((acc, o) => acc + (o.finalPrice !== undefined ? o.finalPrice : o.amount), 0))}</p>
                  </div>
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2"><Package className="w-3 h-3 text-red-500" /> {t[language].lowStockAlerts}</p>
                    <p className="text-4xl font-black text-red-500 mt-2">{gamesList.filter(g => (g.stock || 0) < 3).length}</p>
                  </div>
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2"><User className="w-3 h-3 text-blue-400" /> {t[language].activeCustomers || 'Active Users'}</p>
                    <p className="text-4xl font-black text-blue-400 mt-2">{usersList.length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                   <div className="bg-[#111] border border-gray-800 rounded-xl p-6 relative overflow-hidden text-sm relative shadow-xl">
                     <h3 className="text-white font-bold text-lg mb-4">{t[language].recentSales}</h3>
                     <div className="space-y-4">
                       <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded border border-gray-800">
                          <div>
                            <p className="text-white font-bold">Xbox Game Pass Ultimate</p>
                            <p className="text-xs text-gray-500">felix@example.com</p>
                          </div>
                          <span className="text-green-400 font-bold">+$89.99</span>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded border border-gray-800">
                          <div>
                            <p className="text-white font-bold">PUBG Mobile 8100 UC</p>
                            <p className="text-xs text-gray-500">ahmed@example.com</p>
                          </div>
                          <span className="text-green-400 font-bold">+$94.99</span>
                       </div>
                     </div>
                   </div>

                   <div className="bg-purple-900/10 border border-purple-500/30 rounded-xl p-8 relative overflow-hidden shadow-xl">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-transparent"></div>
                     <h3 className="text-xl font-bold text-white mb-2">{t[language].sysSec}</h3>
                     <ul className="text-xs text-gray-400 space-y-3 mt-4 font-mono">
                       <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t[language].sec1}</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t[language].sec2}</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t[language].sec3}</li>
                       <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t[language].sec4}</li>
                     </ul>
                   </div>
                </div>
              </div>
            )}

            {adminTab === 'subscriptions' && (
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Key className="w-5 h-5 text-purple-500"/> {t[language].manageSubs}</h3>
                    <div className="flex gap-2">
                       <button onClick={() => setCrudModal({
                          isOpen: true, mode: 'create', table: 'subscriptions', item: null, fields: [
                             { name: 'name', label: 'Subscription Name', type: 'text' },
                             { name: 'account_username', label: 'Email / Username', type: 'text' },
                             { name: 'account_password', label: 'Password', type: 'text' },
                             { name: 'category', label: 'Category', type: 'text' },
                             { name: 'status', label: 'Status', type: 'select', options: ['active', 'sold'] },
                             { name: 'sell_count', label: 'Sell Count', type: 'number' }
                          ]
                       })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2">
                         <span className="text-lg leading-none">+</span> Add New Account
                       </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-[#1a1a1a] text-xs uppercase font-bold border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">{t[language].idCol}</th>
                          <th className="px-4 py-3">{t[language].nameCol}</th>
                          <th className="px-4 py-3">{t[language].username}</th>
                          <th className="px-4 py-3">{t[language].passwordUpper}</th>
                          <th className="px-4 py-3">{t[language].catCol}</th>
                          <th className="px-4 py-3">{t[language].statusMsg}</th>
                          <th className="px-4 py-3">{t[language].sellCount}</th>
                          <th className="px-4 py-3">{t[language].actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {subList.map((item, index) => (
                           <tr key={index} className="hover:bg-white/5 transition-colors">
                              <td title={item.id} className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{String(item.id).substring(0, 8)}...</td>
                              <td className="px-4 py-3 font-bold text-white" dir="ltr">{item.name}</td>
                              <td className="px-4 py-3">{item.account_username}</td>
                              <td className="px-4 py-3 font-mono text-purple-400">••••••••</td>
                              <td className="px-4 py-3">
                                 <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-[10px] uppercase tracking-wider">{item.category}</span>
                              </td>
                              <td className="px-4 py-3">
                                 <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${item.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{item.status || 'Active'}</span>
                              </td>
                              <td className="px-4 py-3 font-mono">{item.sell_count || 0}</td>
                              <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => setCrudModal({
                                   isOpen: true, mode: 'edit', table: 'subscriptions', item: item, fields: [
                                     { name: 'name', label: 'Subscription Name', type: 'text' },
                                     { name: 'account_username', label: 'Email / Username', type: 'text' },
                                     { name: 'account_password', label: 'Password (leave MASKED to keep)', type: 'password' },
                                     { name: 'category', label: 'Category', type: 'text' },
                                     { name: 'status', label: 'Status', type: 'select', options: ['active', 'sold'] },
                                     { name: 'sell_count', label: 'Sell Count', type: 'number' }
                                   ]
                                })} className="text-blue-400 hover:text-blue-300 text-xs font-bold">{t[language].editBtn}</button>
                                <button title={t[language].markSold} onClick={() => handleQuickUpdate('subscriptions', item.id, { ...item, status: 'sold', account_password: 'MASKED' })} className="text-green-400 hover:text-green-300 text-xs font-bold">{t[language].markSold}</button>
                                <button onClick={() => setPublishModal({isOpen: true, subscription: item, costPrice: '', sellingPrice: '', image: '', type: 'Account', category: item.category || 'Game'})} className="text-purple-400 hover:text-purple-300 text-[10px] uppercase font-black bg-purple-500/10 px-2 py-1 rounded border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">{t[language].publishBtn}</button>
                                 <button onClick={() => handleCrudDelete('subscriptions', item.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">{t[language].deleteBtn}</button>
                              </td>
                           </tr>
                        ))}
                        {subList.length === 0 && (
                          <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500 italic">No subscriptions found. Click "Add New Account" to begin.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'products' && (
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-purple-500"/> {t[language].manageProds}</h3>
                    <div className="flex gap-2">
                       <button onClick={() => setCrudModal({
                          isOpen: true, mode: 'create', table: 'products', item: null, fields: [
                             { name: 'name', label: 'Product Name', type: 'text' },
                             { name: 'costPrice', label: 'Cost Price ($)', type: 'number' },
                             { name: 'sellingPrice', label: 'Selling Price ($)', type: 'number' },
                             { name: 'supplier', label: 'Supplier', type: 'text' },
                             { name: 'category', label: 'Category', type: 'text' },
                             { name: 'type', label: 'Game Type/Region', type: 'text' },
                             { name: 'image_url', label: 'Image URL', type: 'text' },
                          ]
                       })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2">
                         <span className="text-lg leading-none">+</span> Add New Product
                       </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-[#1a1a1a] text-xs uppercase font-bold border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">{t[language].idCol}</th>
                          <th className="px-4 py-3">{t[language].nameCol}</th>
                          <th className="px-4 py-3">{t[language].costPriceCol}</th>
                          <th className="px-4 py-3">{t[language].sellPriceCol}</th>
                          <th className="px-4 py-3">{t[language].supplierCol}</th>
                          <th className="px-4 py-3">{t[language].catCol}</th>
                          <th className="px-4 py-3">{t[language].typeCol}</th>
                          <th className="px-4 py-3">{t[language].actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {productList.map((item, index) => (
                           <tr key={index} className="hover:bg-white/5 transition-colors">
                              <td title={item.id} className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{String(item.id).substring(0, 8)}...</td>
                              <td className="px-4 py-3 font-bold text-white max-w-[120px] truncate">{item.name}</td>
                              <td className="px-4 py-3 text-red-400 font-mono">${item.costPrice}</td>
                              <td className="px-4 py-3 text-green-400 font-mono">${item.sellingPrice}</td>
                              <td className="px-4 py-3">{item.supplier}</td>
                              <td className="px-4 py-3">
                                 <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-[10px] uppercase tracking-wider">{item.category}</span>
                              </td>
                              <td className="px-4 py-3">{item.type}</td>
                              <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                                 <button onClick={() => setPublishModal({isOpen: true, subscription: item as any, costPrice: String(item.costPrice || ''), sellingPrice: String(item.sellingPrice || ''), image: (item as any).image_url || '', type: item.type || 'Digital', category: item.category || 'Game'})} className="text-purple-400 hover:text-purple-300 text-[10px] uppercase font-black bg-purple-500/10 px-2 py-1 rounded border border-purple-500/30">{t[language].publishBtn}</button>
                                 <button onClick={() => setCrudModal({
                                    isOpen: true, mode: 'edit', table: 'products', item: item, fields: [
                                     { name: 'name', label: 'Product Name', type: 'text' },
                                     { name: 'costPrice', label: 'Cost Price ($)', type: 'number' },
                                     { name: 'sellingPrice', label: 'Selling Price ($)', type: 'number' },
                                     { name: 'supplier', label: 'Supplier', type: 'text' },
                                     { name: 'category', label: 'Category', type: 'text' },
                                     { name: 'type', label: 'Game Type/Region', type: 'text' },
                                     { name: 'image_url', label: 'Image URL', type: 'text' }
                                   ]
                                })} className="text-blue-400 hover:text-blue-300 text-xs font-bold">{t[language].editBtn}</button>
                                <button onClick={() => handleCrudDelete('products', item.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">{t[language].deleteBtn}</button>
                              </td>
                           </tr>
                        ))}
                        {productList.length === 0 && (
                          <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500 italic">No products found in storefront.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'orders' && (
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
              <div className="overflow-x-auto w-full bg-[#111] border border-gray-800 rounded-xl">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-bold border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">{t[language].id}</th>
                      <th className="px-6 py-4 whitespace-nowrap">{t[language].game}</th>
                      <th className="px-6 py-4 whitespace-nowrap">{t[language].rect}</th>
                      <th className="px-6 py-4 whitespace-nowrap">{t[language].stat}</th>
                      <th className="px-6 py-4 whitespace-nowrap">{t[language].amount}</th>
                      <th className="px-6 py-4 whitespace-nowrap">{t[language].act}</th>
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
                                 }} className="text-blue-500 hover:text-blue-400 p-1" title={t[language].editOrder}>
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                 </button>
                                 {order.status === 'Pending' && (
                                  <button 
                                    onClick={() => {
                                      const gameItem = gamesList.find(g => g.id === order.gameId);
                                      if (gameItem && gameItem.stock !== undefined) {
                                          gameItem.stock = Math.max(0, gameItem.stock - 1);
                                          gameItem.sales_count = (typeof gameItem.sales_count === 'number' ? gameItem.sales_count : 0) + 1;
                                          setGamesList([...gamesList]);
                                      }
                                      approveOrder(order.id);
                                    }}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded text-[10px] font-bold transition-colors"
                                  >
                                    Approve
                                  </button>
                                 )}
                                 <button onClick={() => setOrders(orders.filter(o => o.id !== order.id))} className="text-red-500 hover:text-red-400 p-1" title={t[language].deleteOrder}>
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
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
              <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2"><Package className="w-5 h-5 text-purple-500"/> {t[language].manageInv}</h3>
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
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-purple-500"/> {t[language].manageCats}</h3>
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

            {adminTab === 'users' && (
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Shield className="w-5 h-5 text-purple-500"/> {language === 'ar' ? 'إدارة المستخدمين والصلاحيات' : 'Manage Users & Roles'}</h3>
                  </div>
                  <div className="overflow-x-auto w-full border border-gray-800 rounded-xl">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-bold border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">{language === 'ar' ? 'الاسم' : 'Name'}</th>
                          <th className="px-4 py-3">{t[language].eml}</th>
                          <th className="px-4 py-3">{language === 'ar' ? 'الصلاحية' : 'Role'}</th>
                          <th className="px-4 py-3">{language === 'ar' ? 'المنصات' : 'Platforms'}</th>
                          <th className="px-4 py-3 text-right">{t[language].actionsCol}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800 bg-[#0a0a0a]">
                        {usersList.length === 0 ? (
                            <tr><td colSpan={5} className="py-8 text-center text-gray-600">{language === 'ar' ? 'لا يوجد مستخدمين مسجلين' : 'No users found'}</td></tr>
                        ) : usersList.map((user, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-4 font-bold text-white">{user.display_name || user.email || 'N/A'}</td>
                            <td className="px-4 py-4">{user.email}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.role === 'ADMIN' ? 'bg-purple-900/40 text-purple-400 border border-purple-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                                {user.role || 'USER'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-gray-400 text-[10px] font-bold">
                                {user.platforms && user.platforms.length > 0 ? user.platforms.join(', ') : 'None'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right flex flex-wrap items-center justify-end gap-2">
                               <button 
                                 onClick={async () => {
                                    try {
                                       const token = (await getAuthToken());
                                       const res = await fetch(`/api/admin/profiles/${user.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                          body: JSON.stringify({ role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' })
                                       });
                                       if(res.ok) {
                                          setToastMessage('Role updated successfully.');
                                          setTimeout(()=>setToastMessage(null), 3000);
                                          const { data: refreshed, error: refErr } = await supabase.from('profiles').select('*');
                                          if (refErr) console.error("Supabase select error (refetching users 1):", refErr);
                                          if (refreshed) setUsersList(refreshed);
                                       }
                                    } catch(e) { console.error(e) }
                                 }}
                                 className="px-3 py-1 bg-purple-600/20 text-purple-400 hover:bg-purple-600/40 rounded text-[10px] font-bold transition-colors whitespace-nowrap">
                                 {user.role === 'ADMIN' ? (language === 'ar' ? 'إزالة كأدمن' : 'Demote Admin') : (language === 'ar' ? 'ترقية لأدمن' : 'Promote to Admin')}
                               </button>
                               <button 
                                 onClick={async () => {
                                    if(window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم نهائيا؟' : 'Are you sure you want to permanently delete this user?')) {
                                       try {
                                          const token = (await getAuthToken());
                                          const res = await fetch(`/api/admin/profiles/cognito/${user.id}`, {
                                             method: 'DELETE',
                                             headers: { 'Authorization': `Bearer ${token}` }
                                          });
                                          if(res.ok) {
                                             setToastMessage('User deleted successfully.');
                                             setTimeout(()=>setToastMessage(null), 3000);
                                             const { data: refreshed, error: refErr } = await supabase.from('profiles').select('*');
                                             if (refErr) console.error("Supabase select error (refetching users 3):", refErr);
                                             if (refreshed) setUsersList(refreshed);
                                          } else {
                                             const err = await res.json();
                                             setToastMessage(`Error: ${err.error}`);
                                             setTimeout(()=>setToastMessage(null), 3000);
                                          }
                                       } catch(e) { console.error(e) }
                                    }
                                 }}
                                 className="px-3 py-1 bg-red-900/40 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 rounded text-[10px] font-bold transition-colors whitespace-nowrap">
                                 {language === 'ar' ? 'حذف المستخدم' : 'Delete User'}
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'financials' && (
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-500"/> {t[language].finRecords}</h3>
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
                    {editingFinancialId && <button onClick={() => { setEditingFinancialId(null); setNewFinancialForm({type: 'income', amount: '', description: '', date: ''}); }} className="bg-gray-700 px-4 py-2 rounded text-white">{t[language].cancelText}</button>}
                  </div>

                  <div className="overflow-x-auto w-full border border-gray-800 rounded-xl max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-bold border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">{t[language].date}</th>
                          <th className="px-4 py-3">{t[language].typeCol}</th>
                          <th className="px-4 py-3">{t[language].descriptionCol}</th>
                          <th className="px-4 py-3">{t[language].amount}</th>
                          <th className="px-4 py-3">{t[language].actions}</th>
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
                               }} className="text-blue-500 hover:text-blue-400">{t[language].editBtn}</button>
                               <button onClick={() => setFinancialsList(financialsList.map(f => f.id === record.id ? {...f, active: false} : f))} className="text-red-500 hover:text-red-400">{t[language].deleteBtn}</button>
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
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-500"/> {t[language].payGateways}</h3>
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

            {adminTab === 'sales' && (
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-purple-500"/> {t[language].adminSales}</h3>
                    <button onClick={() => setCrudModal({
                          isOpen: true, mode: 'create', table: 'sales', item: null, fields: [
                             { name: 'productName', label: 'Product Name', type: 'text' },
                             { name: 'price', label: 'Final Price ($)', type: 'number' },
                             { name: 'customerName', label: 'Customer Name', type: 'text' },
                             { name: 'customerUsername', label: 'Customer Username/Email', type: 'text' },
                             { name: 'notes', label: 'Notes', type: 'text' },
                          ]
                    })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2">
                       <span className="text-lg leading-none">+</span> Manually Add Sale
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-[#1a1a1a] text-xs uppercase font-bold border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">{t[language].idCol}</th>
                          <th className="px-4 py-3">{t[language].productName}</th>
                          <th className="px-4 py-3">{t[language].finalPrice}</th>
                          <th className="px-4 py-3">{t[language].customerUsername}</th>
                          <th className="px-4 py-3">{t[language].notes}</th>
                          <th className="px-4 py-3">{t[language].date}</th>
                          <th className="px-4 py-3">{t[language].actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {salesList.map((item, index) => (
                           <tr key={index} className="hover:bg-white/5 transition-colors">
                              <td title={item.id} className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{String(item.id).substring(0, 8)}...</td>
                              <td className="px-4 py-3 font-bold text-white">{item.productName}</td>
                              <td className="px-4 py-3 text-green-400 font-mono">${item.price}</td>
                              <td className="px-4 py-3">{item.customerName} ({item.customerUsername})</td>
                              <td className="px-4 py-3 text-xs">{item.notes}</td>
                              <td className="px-4 py-3 text-xs">{new Date(item.date).toLocaleDateString()}</td>
                              <td className="px-4 py-3 flex gap-2">
                                {(item.notes || '').includes('Receipt:') && (
                                  <button className="text-green-400 hover:text-green-300 text-xs font-bold" onClick={() => {
                                      const url = item.notes.split('Receipt: ')[1];
                                      if (url) window.open(url, '_blank');
                                  }}>View Receipt</button>
                                )}
                                <button onClick={() => setCrudModal({
                                    isOpen: true, mode: 'edit', table: 'sales', item: item, fields: [
                                       { name: 'productName', label: 'Product Name', type: 'text' },
                                       { name: 'price', label: 'Final Price ($)', type: 'number' },
                                       { name: 'customerName', label: 'Customer Name', type: 'text' },
                                       { name: 'customerUsername', label: 'Customer Username/Email', type: 'text' },
                                       { name: 'notes', label: 'Notes', type: 'text' },
                                    ]
                                })} className="text-blue-400 hover:text-blue-300 text-xs font-bold">{t[language].editBtn}</button>
                                <button onClick={() => handleCrudDelete('sales', item.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">{t[language].deleteBtn}</button>
                              </td>
                           </tr>
                        ))}
                        {salesList.length === 0 && (
                          <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500 italic">No sales records found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'transactions' && (
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-500"/> {t[language].transTreasury}</h3>
                    <button onClick={() => setCrudModal({
                          isOpen: true, mode: 'create', table: 'transactions', item: null, fields: [
                             { name: 'type', label: 'Type', type: 'select', options: ['income', 'expense'] },
                             { name: 'amount', label: 'Amount ($)', type: 'number' },
                             { name: 'description', label: 'Description', type: 'text' },
                             { name: 'person', label: 'Person/Entity', type: 'text' },
                             { name: 'notes', label: 'Notes', type: 'text' },
                          ]
                    })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2">
                       <span className="text-lg leading-none">+</span> Add Transaction
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-[#1a1a1a] text-xs uppercase font-bold border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">{t[language].idCol}</th>
                          <th className="px-4 py-3">{t[language].typeCol}</th>
                          <th className="px-4 py-3">{t[language].amount}</th>
                          <th className="px-4 py-3">{t[language].personEntity}</th>
                          <th className="px-4 py-3">{t[language].descriptionCol}</th>
                          <th className="px-4 py-3">{t[language].notes}</th>
                          <th className="px-4 py-3">{t[language].date}</th>
                          <th className="px-4 py-3">{t[language].actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {transList.map((item, index) => (
                           <tr key={index} className="hover:bg-white/5 transition-colors">
                              <td title={item.id} className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{String(item.id).substring(0, 8)}...</td>
                              <td className="px-4 py-3">
                                 <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${item.type === 'income' ? 'bg-green-500/10 text-green-400' : item.type === 'expense' ? 'bg-red-500/10 text-red-400' : 'bg-gray-500/10 text-gray-400'}`}>{item.type}</span>
                              </td>
                              <td className={`px-4 py-3 font-mono ${item.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>${item.amount}</td>
                              <td className="px-4 py-3">{item.person}</td>
                              <td className="px-4 py-3">{item.description}</td>
                              <td className="px-4 py-3 text-xs">{item.notes}</td>
                              <td className="px-4 py-3 text-xs font-mono">{new Date(item.created_at || Date.now()).toLocaleDateString()}</td>
                              <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => setCrudModal({
                                    isOpen: true, mode: 'edit', table: 'transactions', item: item, fields: [
                                       { name: 'type', label: 'Type', type: 'select', options: ['income', 'expense'] },
                                       { name: 'amount', label: 'Amount ($)', type: 'number' },
                                       { name: 'description', label: 'Description', type: 'text' },
                                       { name: 'person', label: 'Person/Entity', type: 'text' },
                                       { name: 'notes', label: 'Notes', type: 'text' },
                                    ]
                                })} className="text-blue-400 hover:text-blue-300 text-xs font-bold">{t[language].editBtn}</button>
                                <button onClick={() => handleCrudDelete('transactions', item.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">{t[language].deleteBtn}</button>
                              </td>
                           </tr>
                        ))}
                        {transList.length === 0 && (
                          <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500 italic">No transactions found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'macros' && (
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-purple-500"/> {t[language].setMacros}</h3>
                    <button onClick={() => setCrudModal({
                          isOpen: true, mode: 'create', table: 'settings', item: null, fields: [
                             { name: 'type', label: 'Type', type: 'text' },
                             { name: 'key', label: 'Key', type: 'text' },
                             { name: 'value', label: 'Value', type: 'text' },
                          ]
                    })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2">
                       <span className="text-lg leading-none">+</span> Add Macro
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-[#1a1a1a] text-xs uppercase font-bold border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">{t[language].idCol}</th>
                          <th className="px-4 py-3">{t[language].typeCol}</th>
                          <th className="px-4 py-3">{t[language].keyCol}</th>
                          <th className="px-4 py-3">{t[language].valueCol}</th>
                          <th className="px-4 py-3">{t[language].actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {settingsList.map((item, index) => (
                           <tr key={index} className="hover:bg-white/5 transition-colors">
                              <td title={item.id} className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{String(item.id).substring(0, 8)}...</td>
                              <td className="px-4 py-3">
                                 <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-[10px] uppercase tracking-wider">{item.type}</span>
                              </td>
                              <td className="px-4 py-3 font-mono text-white">{item.key}</td>
                              <td className="px-4 py-3 text-xs">{item.value?.substring(0, 50)}{item.value?.length > 50 ? '...' : ''}</td>
                              <td className="px-4 py-3 flex gap-2">
                                <button onClick={() => setCrudModal({
                                    isOpen: true, mode: 'edit', table: 'settings', item: item, fields: [
                                       { name: 'type', label: 'Type', type: 'text' },
                                       { name: 'key', label: 'Key', type: 'text' },
                                       { name: 'value', label: 'Value', type: 'text' },
                                    ]
                                })} className="text-blue-400 hover:text-blue-300 text-xs font-bold">{t[language].editBtn}</button>
                                <button onClick={() => handleCrudDelete('settings', item.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">{t[language].deleteBtn}</button>
                              </td>
                           </tr>
                        ))}
                        {settingsList.length === 0 && (
                          <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500 italic">No settings or macros defined.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'settings' && (
              <div className="max-w-[95%] 2xl:max-w-[1400px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-purple-500"/> {t[language].globSet}</h3>
                    <button onClick={() => {
                       if (editingSettings) {
                          setGlobalSettings({...settingsForm});
                          setEditingSettings(false);
                       } else {
                          setSettingsForm({...globalSettings});
                          setEditingSettings(true);
                       }
                    }} className="bg-purple-600 px-4 py-2 rounded text-xs font-bold text-white transition">
                      {editingSettings ? t[language].saveSettings : t[language].editSettings}
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
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto h-[650px]">
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
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-purple-500"/> {t[language].managePages}</h3>
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

            {adminTab === 'promotions' && (
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Star className="w-5 h-5 text-purple-500"/> {t[language].prodOffers}</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="bg-[#1a1a1a] text-xs uppercase font-bold border-b border-gray-800">
                        <tr>
                          <th className="px-4 py-3">{t[language].idCol}</th>
                          <th className="px-4 py-3">{t[language].nameCol}</th>
                          <th className="px-4 py-3">{t[language].originalPrice}</th>
                          <th className="px-4 py-3">{t[language].discountPrice}</th>
                          <th className="px-4 py-3">{t[language].featured}</th>
                          <th className="px-4 py-3">{t[language].catCol}</th>
                          <th className="px-4 py-3">{t[language].actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {productList.map((item, index) => (
                           <tr key={index} className="hover:bg-white/5 transition-colors">
                              <td title={item.id} className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{String(item.id).substring(0, 8)}...</td>
                              <td className="px-4 py-3 font-bold text-white" dir="ltr">{item.name}</td>
                              <td className={`px-4 py-3 font-mono ${item.discountPrice ? 'line-through text-gray-500' : 'text-green-400'}`}>${item.sellingPrice}</td>
                              <td className="px-4 py-3 font-mono text-purple-400 font-bold">{item.discountPrice ? `$${item.discountPrice}` : '-'}</td>
                              <td className="px-4 py-3">
                                 {item.isFeatured ? <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Featured</span> : '-'}
                              </td>
                              <td className="px-4 py-3">
                                 <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-[10px] uppercase tracking-wider">{item.category}</span>
                              </td>
                              <td className="px-4 py-3">
                                <button onClick={() => setPromoModal({isOpen: true, product: item, discountPrice: item.discountPrice || '', isFeatured: item.isFeatured || false})} className="bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white px-3 py-1 rounded transition-colors text-xs font-bold border border-purple-500/30">
                                  Apply Offer
                                </button>
                              </td>
                           </tr>
                        ))}
                        {productList.length === 0 && (
                          <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500 italic">No products available. Add products first.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <hr className="border-gray-800 my-4" />
                  
                  {/* Legacy Banners Section retained visually */}
                  <h3 className="text-white font-bold text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-purple-500"/> Featured Banners</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4 bg-black border border-gray-800 rounded-xl p-5 h-[400px] overflow-y-auto">
                       <h4 className="font-bold text-white text-sm">Add New Promotion Banner</h4>
                       <input type="text" placeholder="Title" value={newPromotion.title} onChange={e => setNewPromotion({...newPromotion, title: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                       <input type="text" placeholder="Description" value={newPromotion.description} onChange={e => setNewPromotion({...newPromotion, description: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                       <input type="text" placeholder="Image URL" value={newPromotion.imageUrl} onChange={e => setNewPromotion({...newPromotion, imageUrl: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                       <input type="text" placeholder="Link To Category (Optional)" value={newPromotion.linkToCategory} onChange={e => setNewPromotion({...newPromotion, linkToCategory: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                       
                       <button onClick={async () => {
                          if (newPromotion.title && newPromotion.imageUrl) {
                             try {
                               const token = (await getAuthToken());
                               const body = { title: newPromotion.title, description: newPromotion.description, image_url: newPromotion.imageUrl, link_to_category: newPromotion.linkToCategory, active: true };
                               let newId = Math.random().toString();
                               let success = false;
                               try {
                                   const res = await fetch('/api/admin/promotions', {
                                     method: 'POST',
                                     headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + token },
                                     body: JSON.stringify(body)
                                   });
                                   if (res.ok) {
                                      let saved = await res.json();
                                      saved = { ...saved, imageUrl: saved.image_url, linkToCategory: saved.link_to_category };
                                      setPromotions([...promotions, saved]);
                                      success = true;
                                   }
                               } catch(e) { console.error("Banner add error", e); }
                               
                               if (!success) {
                                  setPromotions([...promotions, { ...body, id: newId, imageUrl: body.image_url, linkToCategory: body.link_to_category, active: true }]);
                               }
                               setNewPromotion({ id: '', title: '', description: '', imageUrl: '', linkToCategory: '', active: true });
                             } catch(e) { console.error(e); }
                          }
                       }} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors mt-auto">{t[language].addBanner}</button>
                    </div>
                    <div className="bg-black border border-gray-800 rounded-xl p-5 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 pr-2">
                       {promotions.map(promo => (
                          <div key={promo.id} className={`bg-[#111] border border-gray-800 rounded-lg p-4 mb-3 ${!promo.active ? 'opacity-50' : ''}`}>
                             <div className="flex justify-between items-start mb-2">
                               <h5 className="font-bold text-white text-sm">{promo.title}</h5>
                               <div className="flex gap-2">
                                 <button onClick={async () => {
                                      const newActive = !promo.active;
                                      const token = (await getAuthToken());
                                      try {
                                          const res = await fetch("/api/admin/promotions/" + promo.id, {
                                             method: 'PUT',
                                             headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + token },
                                             body: JSON.stringify({ active: newActive })
                                          });
                                      } catch(e) {}
                                      setPromotions(promotions.map(p => p.id === promo.id ? {...p, active: newActive} : p));
                                 }} className={`${promo.active ? 'text-green-500 hover:text-green-400' : 'text-gray-500 hover:text-gray-400'}`}><CheckCircle2 className="w-4 h-4" /></button>
                                 <button onClick={async () => {
                                      const token = (await getAuthToken());
                                      try {
                                          const res = await fetch("/api/admin/promotions/" + promo.id, {
                                             method: 'DELETE',
                                             headers: { 'Authorization': "Bearer " + token }
                                          });
                                      } catch(e) {}
                                      setPromotions(promotions.filter(p => p.id !== promo.id));
                                 }} className="text-red-500 hover:text-red-400"><X className="w-4 h-4"/></button>
                               </div>
                             </div>
                             <p className="text-xs text-gray-400 mb-2 truncate">{promo.description}</p>
                             <img src={promo.imageUrl} alt={promo.title} className="w-full h-24 object-cover rounded border border-gray-800" />
                          </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminTab === 'promo_codes' && (
              <div className="max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto flex flex-col gap-6">
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Tag className="w-5 h-5 text-purple-500"/> {t[language].manageCodes}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4 bg-black border border-gray-800 rounded-xl p-5 h-[500px] overflow-y-auto">
                       <h4 className="font-bold text-white text-sm">Create Promo Code</h4>
                       <input type="text" placeholder="Code (e.g. PIXEL10)" value={newPromoCode.code} onChange={e => setNewPromoCode({...newPromoCode, code: e.target.value.toUpperCase()})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white uppercase" />
                       <input type="number" placeholder="Discount Percentage (%)" value={newPromoCode.discountPercent} onChange={e => setNewPromoCode({...newPromoCode, discountPercent: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                       <input type="date" placeholder="Expiry Date" value={newPromoCode.expiryDate} onChange={e => setNewPromoCode({...newPromoCode, expiryDate: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                       <input type="number" placeholder="Usage Limit" value={newPromoCode.usageLimit} onChange={e => setNewPromoCode({...newPromoCode, usageLimit: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" />
                       
                       <button onClick={() => {
                          if (newPromoCode.code && newPromoCode.discountPercent) {
                             setPromoCodes([...promoCodes, { 
                               id: Math.random().toString(), 
                               code: newPromoCode.code, 
                               discountPercent: parseFloat(newPromoCode.discountPercent),
                               expiryDate: newPromoCode.expiryDate || '2099-12-31',
                               usageLimit: parseInt(newPromoCode.usageLimit) || 1000,
                               usedCount: 0,
                               active: true 
                             }]);
                             setNewPromoCode({ id: '', code: '', discountPercent: '', expiryDate: '', usageLimit: '', usedCount: 0, active: true });
                          }
                       }} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors mt-auto">{t[language].createCode}</button>
                    </div>
                    <div className="bg-black border border-gray-800 rounded-xl p-5 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 pr-2">
                       {promoCodes.map(code => (
                          <div key={code.id} className={`bg-[#111] border border-gray-800 rounded-lg p-4 mb-3 ${!code.active ? 'opacity-50' : ''}`}>
                             <div className="flex justify-between items-start mb-2">
                               <h5 className="font-bold text-purple-400 text-lg tracking-widest">{code.code}</h5>
                               <div className="flex gap-2">
                                 <button onClick={() => setPromoCodes(promoCodes.map(p => p.id === code.id ? {...p, active: !p.active} : p))} className={`${code.active ? 'text-green-500 hover:text-green-400' : 'text-gray-500 hover:text-gray-400'}`}><CheckCircle2 className="w-4 h-4" /></button>
                                 <button onClick={() => setPromoCodes(promoCodes.filter(p => p.id !== code.id))} className="text-red-500 hover:text-red-400"><X className="w-4 h-4"/></button>
                               </div>
                             </div>
                             <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-3">
                                <div className="bg-black p-2 rounded">Discount: <span className="text-white font-bold">{code.discountPercent}%</span></div>
                                <div className="bg-black p-2 rounded">Used: <span className="text-white font-bold">{code.usedCount} / {code.usageLimit}</span></div>
                                <div className="bg-black p-2 rounded col-span-2">Expires: <span className="text-white font-bold">{code.expiryDate}</span></div>
                             </div>
                          </div>
                       ))}
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
      <nav className="h-16 md:h-20 w-full px-4 md:px-8 flex items-center justify-between border-b border-purple-900/30 bg-[#050505]/80 backdrop-blur-md z-10 flex-shrink-0 relative">
        <div className="flex items-center justify-center flex-none md:justify-start gap-10">
          <div className="text-xl md:text-2xl font-black tracking-tighter text-white cursor-pointer text-center hidden md:block" onClick={() => { setActiveTab('store'); setActiveCategory(null); setIsMobileMenuOpen(false); }}>
            PIXEL<span className="text-purple-500">STORE</span>
          </div>
          {/* Mobile Logo Only */}
          <div className="text-xl font-black tracking-tighter text-white cursor-pointer md:hidden flex items-center gap-2" onClick={() => { setActiveTab('store'); setActiveCategory(null); }}>
            <span className="bg-purple-600 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.5)]">L</span>
            <span>PIXEL<span className="text-purple-500">STORE</span></span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400 tracking-widest">
             <button onClick={() => { setActiveTab('store'); setActiveCategory(null); }} className={activeTab === 'store' && activeCategory !== 'Subscriptions' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].store}</button>
             <button onClick={() => { setActiveTab('store'); setActiveCategory('Subscriptions'); }} className={activeTab === 'store' && activeCategory === 'Subscriptions' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].subs || 'Subscriptions'}</button>
             <button onClick={() => { setActiveTab('user_dashboard'); setUserDashboardTab('orders'); }} className={activeTab === 'user_dashboard' && userDashboardTab === 'orders' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].orders}</button>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-6">
          <div className="relative hidden md:flex items-center">
            <div className="absolute start-3 w-4 h-4 text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder={t[language].search} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111] border border-purple-900/40 rounded-full py-2 ps-10 pe-4 text-sm w-64 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 transition-colors focus:bg-purple-900/10 min-h-[44px]" 
            />
          </div>
          
          {/* Mobile Search Icon */}
          <div className="md:hidden flex items-center justify-center p-2 text-gray-400 hover:text-white cursor-pointer" onClick={() => { setIsMobileMenuOpen(true) }}>
             <Search className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && userProfile?.role === 'ADMIN' && (
              <div 
                className="relative cursor-pointer text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px] hidden md:flex"
                onClick={() => { setActiveTab('admin'); setAdminTab('support'); }}
                title={t[language].hqSupChat}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-black shadow-[0_0_8px_#22c55e] animate-pulse"></span>
              </div>
            )}
            
            <div className={`relative cursor-pointer hover:text-purple-400 text-gray-400 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px] hidden md:flex ${cartAnimating ? 'animate-bounce-cart' : ''}`} onClick={() => setActiveTab('cart')}>
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-black rounded-full shadow-[0_0_8px_#ef4444] text-[8px] flex items-center justify-center font-bold text-white transition-all transform hover:scale-110">{cart.length}</span>
              )}
            </div>
            
            <div className="relative">
              {isLoggedIn ? (
                <>
                  <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-8 h-8 md:w-10 md:h-10 bg-purple-900 rounded-full border border-purple-500/50 cursor-pointer overflow-hidden hover:border-purple-400 transition-colors flex items-center justify-center font-bold text-white uppercase select-none">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.display_name || userProfile?.email}&backgroundColor=4c1d95`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  {isProfileOpen && (
                    <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 bg-[#111] border border-purple-900/50 rounded-xl shadow-xl overflow-hidden z-20 flex flex-col`}>
                      {userProfile?.role === 'ADMIN' && (
                        <button onClick={() => { setActiveTab('admin'); setIsProfileOpen(false); }} className="px-4 py-3 text-sm text-start hover:bg-purple-900/30 transition-colors border-b border-gray-800 flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest">
                          <Shield className="w-4 h-4" /> Pixel HQ Portal
                        </button>
                      )}
                      <button onClick={() => { setActiveTab('user_dashboard'); setUserDashboardTab('profile'); setIsProfileOpen(false); }} className="px-4 py-3 text-sm text-start hover:bg-purple-900/30 transition-colors border-b border-gray-800 flex items-center gap-2 text-white">
                        <User className="w-4 h-4" /> {t[language].profile}
                      </button>
                      <button onClick={() => { setActiveTab('user_dashboard'); setUserDashboardTab('settings'); setIsProfileOpen(false); }} className="px-4 py-3 text-sm text-start hover:bg-purple-900/30 transition-colors border-b border-gray-800 flex items-center gap-2 text-white">
                        <Settings className="w-4 h-4" /> {t[language].settings}
                      </button>
                      <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-black/50">
                        <span className="text-xs font-bold text-gray-400">Language</span>
                        <div className="flex bg-[#111] rounded-md border border-purple-900/30 p-1">
                          <button onClick={() => setLanguage('en')} className={`px-2 py-1 text-[10px] rounded font-bold transition-colors ${language === 'en' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}>EN</button>
                          <button onClick={() => setLanguage('ar')} className={`px-2 py-1 text-[10px] rounded font-bold transition-colors ${language === 'ar' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}>عربي</button>
                        </div>
                      </div>
                      <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-black/50">
                        <span className="text-xs font-bold text-gray-400">Currency</span>
                        <div className="flex bg-[#111] rounded-md border border-purple-900/30 p-1">
                          <button onClick={() => setCurrency('USD')} className={`px-2 py-1 text-[10px] rounded font-bold transition-colors ${currency === 'USD' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}>USD</button>
                          <button onClick={() => setCurrency('IQD')} className={`px-2 py-1 text-[10px] rounded font-bold transition-colors ${currency === 'IQD' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}>IQD</button>
                        </div>
                      </div>
                      <button onClick={async () => { 
                          try {
                             await signOut();
                          } catch (e) {
                             console.error('Sign out error:', e);
                          }
                          setIsLoggedIn(false); 
                          setUserProfile(null); 
                          setIsProfileOpen(false); 
                          if(activeTab === 'admin' || activeTab === 'profile') { setActiveTab('store'); setActiveCategory(null); }
                      }} className="px-4 py-3 text-sm text-start text-red-500 hover:bg-red-500/10 transition-colors">{t[language].logout}</button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center gap-2">
                    <button onClick={() => setShowAuthModal('login')} className="text-gray-400 hover:text-white text-sm font-bold transition-colors">{t[language].signIn}</button>
                    <button onClick={() => setShowAuthModal('register')} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">{t[language].register}</button>
                  </div>
                  <div className="md:hidden">
                    <button onClick={() => setShowAuthModal('login')} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 uppercase">
                      <User className="w-3.5 h-3.5" />
                      {t[language].signIn}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile slide-out drawer (Moved outside nav for proper fixed positioning) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] md:hidden flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Drawer */}
          <div className="relative w-[300px] max-w-[80vw] h-full bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-purple-500/30 shadow-[5px_0_30px_rgba(168,85,247,0.3)] flex flex-col p-6 overflow-y-auto animate-in slide-in-from-left duration-300 z-10">
             <div className="flex justify-between items-center mb-10">
               <div className="text-xl font-black tracking-tighter text-white">
                 PIXEL<span className="text-purple-500">STORE</span>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-white/5 rounded-full">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <button onClick={() => { setActiveTab('store'); setActiveCategory(null); setIsMobileMenuOpen(false); }} className={`p-4 text-lg text-left font-bold border-b border-purple-900/30 ${activeTab === 'store' && activeCategory !== 'Subscriptions' ? "text-purple-400" : "text-white"}`}>{t[language].store}</button>
             <button onClick={() => { setActiveTab('store'); setActiveCategory('Subscriptions'); setIsMobileMenuOpen(false); }} className={`p-4 text-lg text-left font-bold border-b border-purple-900/30 ${activeTab === 'store' && activeCategory === 'Subscriptions' ? "text-purple-400" : "text-white"}`}>{t[language].subs || 'Subscriptions'}</button>
             <button onClick={() => { setActiveTab('user_dashboard'); setUserDashboardTab('orders'); setIsMobileMenuOpen(false); }} className={`p-4 text-lg text-left font-bold border-b border-purple-900/30 ${activeTab === 'user_dashboard' && userDashboardTab === 'orders' ? "text-purple-400" : "text-white"}`}>{t[language].orders}</button>
             
             {isLoggedIn && userProfile?.role === 'ADMIN' && (
               <button onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }} className={`p-4 text-lg text-left font-bold border-b border-purple-900/30 flex items-center gap-2 ${activeTab === 'admin' ? "text-purple-400" : "text-purple-500"}`}>
                  <Shield className="w-5 h-5" /> Pixel HQ Portal
               </button>
             )}

             <div className="relative mt-8 px-2">
             <div className="absolute start-5 top-3 w-5 h-5 text-gray-500">
               <Search className="w-5 h-5" />
             </div>
             <input 
               type="text" 
               placeholder={t[language].search} 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-[#111] border border-purple-900/40 rounded-xl py-3 ps-12 pe-4 text-base focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 min-h-[50px] shadow-inner" 
             />
           </div>
           
           {!isLoggedIn && (
             <div className="flex flex-col gap-3 mt-6">
               <button onClick={() => { setShowAuthModal('login'); setIsMobileMenuOpen(false); }} className="w-full py-3 bg-[#111] border border-gray-800 rounded-lg text-white font-bold hover:bg-[#1a1a2e]">{t[language].signIn}</button>
               <button onClick={() => { setShowAuthModal('register'); setIsMobileMenuOpen(false); }} className="w-full py-3 bg-purple-600 rounded-lg text-white font-bold hover:bg-purple-500">{t[language].register}</button>
             </div>
           )}

           <div className="mt-auto pt-8 flex flex-col gap-4">
               <div className="flex gap-4">
                  <button onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} className={`flex-1 py-3 rounded-lg border text-sm font-bold ${language === 'en' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-[#111] border-gray-800 text-gray-400'}`}>English</button>
                  <button onClick={() => { setLanguage('ar'); setIsMobileMenuOpen(false); }} className={`flex-1 py-3 rounded-lg border text-sm font-bold ${language === 'ar' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-[#111] border-gray-800 text-gray-400'}`}>العربية</button>
               </div>
           </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar / Categories */}
        {(activeTab === 'store') && (
          <aside className="w-64 border-e border-purple-900/20 bg-black/20 p-6 flex-col gap-8 hidden lg:flex overflow-y-auto custom-scrollbar flex-shrink-0 h-full">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">{t[language].categories}</h3>
              <ul className="space-y-3">
                {CATEGORIES.map(cat => (
                  <li 
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
                    className={`flex items-center gap-3 text-sm p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      activeCategory === cat.name 
                        ? 'text-purple-400 bg-purple-500/10 border-s-2 border-purple-500 font-bold' 
                        : 'text-gray-400 hover:text-purple-400 hover:bg-purple-900/10 border-s-2 border-transparent'
                    }`}
                  >
                    <cat.icon className="w-4 h-4 opacity-70" /> {cat.name === 'PC Game Keys' ? t[language].pcKeys : cat.name === 'Console Subs' ? t[language].consoleSubs : cat.name === 'In-game Currency' ? t[language].inGameCurrency : cat.name === 'Software' ? t[language].software : cat.name}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {/* User Dashboard Sidebar */}
        {activeTab === 'user_dashboard' && (
          <aside className="w-64 border-e border-purple-900/20 bg-[#0a0a0a] flex flex-col hidden lg:flex shadow-[5px_0_15px_rgba(0,0,0,0.5)] z-10 relative overflow-y-auto custom-scrollbar flex-shrink-0 h-full">
             <div className="p-6 border-b border-gray-800 bg-[#111]">
               <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t[language].userDashboard}</h2>
               <p className="text-xl font-black text-white truncate">{userProfile?.display_name || userProfile?.email}</p>
             </div>
             <div className="p-4 flex-1 flex flex-col gap-2">
                <button 
                  onClick={() => setUserDashboardTab('profile')} 
                  className={`flex items-center gap-3 text-sm p-3 rounded-lg transition-colors font-bold ${userDashboardTab === 'profile' ? 'bg-purple-900/40 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <User className="w-4 h-4" /> {t[language].profileMenu}
                </button>
                <button 
                  onClick={() => setUserDashboardTab('orders')} 
                  className={`flex items-center gap-3 text-sm p-3 rounded-lg transition-colors font-bold ${userDashboardTab === 'orders' ? 'bg-purple-900/40 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <ShoppingBag className="w-4 h-4" /> {t[language].secureVault}
                </button>
                <button 
                  onClick={() => setUserDashboardTab('settings')} 
                  className={`flex items-center gap-3 text-sm p-3 rounded-lg transition-colors font-bold ${userDashboardTab === 'settings' ? 'bg-purple-900/40 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Settings className="w-4 h-4" /> {t[language].accSet}
                </button>
             </div>
             <div className="p-4 border-t border-gray-800">
               <button onClick={async () => { 
                          try {
                             await signOut();
                          } catch (e) {
                             console.error('Sign out error:', e);
                          }
                          setIsLoggedIn(false); 
                   setUserProfile(null); 
                   setActiveTab('store');
                   setActiveCategory(null);
               }} className="flex items-center gap-3 text-sm p-3 rounded-lg transition-colors font-bold text-red-500 hover:bg-red-500/10 w-full">
                 <LogOut className="w-4 h-4" /> Logout
               </button>
             </div>
          </aside>
        )}

        {/* Main Interface Area conditionally rendered */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">
          {activeTab === 'store' && (
            <>
              {/* Dynamic Unified Banners */}
              {!activeCategory && !searchQuery && (() => {
                  if (isLoadingStore) {
                    return (
                      <div className="mb-6 sm:mb-10 w-full overflow-hidden rounded-2xl border border-gray-800 bg-[#151515] animate-skeleton h-64 md:h-80 relative flex items-center p-8 md:p-12">
                         <div className="flex-1 max-w-lg space-y-4">
                           <div className="w-24 h-6 bg-gray-800 rounded-full"></div>
                           <div className="w-full h-10 md:h-12 bg-gray-800 rounded-lg"></div>
                           <div className="w-3/4 h-10 md:h-12 bg-gray-800 rounded-lg"></div>
                           <div className="w-full h-4 bg-gray-800 rounded mt-6"></div>
                           <div className="w-2/3 h-4 bg-gray-800 rounded"></div>
                           <div className="w-32 h-12 bg-gray-800 rounded-lg mt-8"></div>
                         </div>
                      </div>
                    );
                  }
                  
                  const activeBanners = promotions.filter((b: any) => b.active).map((b: any) => ({ type: 'banner', label: 'Featured Promo', banner: b, title: b.title, desc: b.description, imageUrl: b.imageUrl || b.image_url, link: b.linkToCategory }));
                  const topVisited = [...publicProducts].sort((a: any, b: any) => (b.views_count || 0) - (a.views_count || 0))[0];
                  const topSelling = [...publicProducts].sort((a: any, b: any) => (b.sales_count || 0) - (a.sales_count || 0))[0];
                  
                  const slides: any[] = [...activeBanners];
                  if (topVisited) slides.push({ type: 'game', label: 'Trending 🔥', title: topVisited.name, desc: 'Join thousands of active players right now!', imageUrl: topVisited.coverImage, targetId: topVisited.id });
                  if (topSelling) slides.push({ type: 'game', label: 'Best Seller 👑', title: topSelling.name, desc: '#1 Top Selling Game!', imageUrl: topSelling.coverImage, targetId: topSelling.id });

                  if (slides.length === 0) return null;
                  const currentSlide = slides[heroSlideIdx % slides.length];
                  if (!currentSlide) return null;

                  return (
                    <div className="mb-6 sm:mb-10 w-full overflow-hidden rounded-2xl border border-purple-500/30 relative group bg-black shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col md:flex-row h-auto md:h-80">
                       <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10 bg-gradient-to-r from-black via-black/90 to-transparent">
                          <span className="text-purple-400 font-black tracking-widest text-xs uppercase mb-3 px-3 py-1 bg-purple-900/30 rounded-full w-fit">
                             {currentSlide.label}
                          </span>
                          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 line-clamp-2">{currentSlide.title}</h2>
                          <p className="text-gray-400 text-sm md:text-base max-w-md mb-6 line-clamp-2">{currentSlide.desc}</p>
                          {currentSlide.type === 'banner' && currentSlide.link && (
                            <button 
                              onClick={() => setActiveCategory(currentSlide.link)}
                              className="w-fit bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                            >
                              Explore Now
                            </button>
                          )}
                          {currentSlide.type === 'game' && currentSlide.targetId && (
                            <button 
                              onClick={() => handleOpenGameDetail(currentSlide.targetId)}
                              className="w-fit bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                            >
                              View Deals
                            </button>
                          )}
                          
                          <div className="mt-8 flex gap-2 z-20">
                              {slides.map((_, idx) => (
                                 <div key={idx} onClick={() => setHeroSlideIdx(idx)} className={"w-2 h-2 rounded-full cursor-pointer transition-all " + (idx === (heroSlideIdx % slides.length) ? 'bg-purple-500 w-4' : 'bg-gray-500 hover:bg-white')}></div>
                              ))}
                          </div>
                       </div>
                       
                       <div className="w-full md:w-2/3 h-48 md:h-full absolute right-0 top-0 bottom-0 z-0 cursor-pointer" onClick={() => {
                          if (currentSlide.type === 'game' && currentSlide.targetId) {
                              handleOpenGameDetail(currentSlide.targetId);
                          } else if (currentSlide.type === 'banner' && currentSlide.link) {
                              setActiveCategory(currentSlide.link);
                          }
                       }}>
                         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10 md:hidden"></div>
                         <img 
                           key={currentSlide.imageUrl}
                           src={currentSlide.imageUrl} 
                           alt={currentSlide.title} 
                           className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 animate-[fadeIn_0.5s_ease-out]"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 md:hidden"></div>
                         <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black z-10"></div>
                         <div className="absolute inset-0 border-[3px] border-purple-500/10 rounded-2xl z-20 pointer-events-none"></div>
                        </div>
                    </div>
                  );
              })()}

              {/* Exclusive Offers Section */}
              {!activeCategory && !searchQuery && publicProducts.filter(p => p.discountPrice || p.isFeatured).length > 0 && (
                <div className="mb-10 w-full overflow-hidden flex flex-col gap-4 animate-in fade-in duration-500">
                  <div className="flex items-center gap-3">
                     <Zap className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                     <h2 className="text-2xl font-black italic tracking-wide text-white uppercase"><span className="text-purple-400">Exclusive</span> Offers</h2>
                     <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-500/50 to-transparent ml-4"></div>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-purple-900/50">
                    {publicProducts.filter(p => p.discountPrice || p.isFeatured).map(product => (
                      <div key={product.id} className="min-w-[280px] w-[280px] snap-start bg-[#0a0a0a] border border-purple-900/30 rounded-xl overflow-hidden relative group hover:border-purple-500/50 transition-all hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col cursor-pointer" onClick={() => {
                          const matchingGame = gamesList.find(g => g.id === product.id);
                          if(matchingGame) {
                            setSelectedGameId(matchingGame.id);
                            setIsGameDetailOpen(true);
                          } else {
                            // Mock opening detail for fetched db product if not in legacy list
                            console.log("Open product details", product.id);
                          }
                      }}>
                         {/* Badge */}
                         {product.discountPrice && (
                           <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[10px] uppercase font-black px-2 py-1 rounded shadow-[0_0_10px_#dc2626]">SALE</div>
                         )}
                         {product.isFeatured && !product.discountPrice && (
                           <div className="absolute top-3 left-3 z-20 bg-purple-600 text-white text-[10px] uppercase font-black px-2 py-1 rounded shadow-[0_0_10px_#9333ea]">FEATURED</div>
                         )}
                         <div className="h-40 bg-gradient-to-br from-purple-900/40 to-black relative overflow-hidden">
                           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop')] bg-cover opacity-50 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"></div>
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                         </div>
                         <div className="p-3 sm:p-5 flex flex-col flex-1 z-10 -mt-8 sm:-mt-10">
                           <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1 drop-shadow-md">{product.category}</p>
                           <h3 className="text-sm sm:text-lg font-black text-white leading-tight mb-1 sm:mb-2 line-clamp-2 sm:truncate">{product.name}</h3>
                           <div className="mt-auto pt-4 flex items-center justify-between">
                             <div className="flex flex-col">
                               {product.discountPrice ? (
                                  <>
                                    <span className="text-xs text-gray-500 line-through font-mono">${product.sellingPrice}</span>
                                    <span className="text-base sm:text-xl font-black text-green-400 font-mono shadow-green-500/20 drop-shadow-lg">${product.discountPrice}</span>
                                  </>
                               ) : (
                                  <span className="text-xl font-black text-white font-mono">${product.sellingPrice}</span>
                               )}
                             </div>
                             <button className="bg-white/10 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors border border-white/10 group-hover:border-purple-500/50" onClick={(e) => {
                                 e.stopPropagation();
                                 const item = {
                                    id: product.id,
                                    title: product.name,
                                    price: product.discountPrice ? Number(product.discountPrice) : Number(product.sellingPrice),
                                    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop'
                                 };
                                 addToCart(product.id);
                             }}>
                               <ShoppingBag className="w-4 h-4" />
                             </button>
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Mobile Categories Slider */}
              <div className="lg:hidden w-full overflow-x-auto pb-4 mb-4 flex gap-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-purple-900/50">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className={`flex-none snap-start px-5 py-2 rounded-full border text-sm font-bold whitespace-nowrap transition-all ${!activeCategory ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-[#111] border-gray-800 text-gray-400 hover:text-white'}`}
                >
                  {t[language].allGames || 'All Games'}
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
                    className={`flex-none snap-start px-5 py-2 rounded-full border text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${activeCategory === cat.name ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-[#111] border-gray-800 text-gray-400 hover:text-white'}`}
                  >
                    <cat.icon className="w-4 h-4 opacity-70" />
                    {cat.name === 'PC Game Keys' ? t[language].pcKeys : cat.name === 'Console Subs' ? t[language].consoleSubs : cat.name === 'In-game Currency' ? t[language].inGameCurrency : cat.name === 'Software' ? t[language].software : cat.name}
                  </button>
                ))}
              </div>

              
              

              
              

              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
                <div>
                  <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] leading-snug md:leading-tight font-bold tracking-tight">{t[language].discover} <span className="text-purple-500">{t[language].worlds}</span></h1>
                  <p className="text-gray-500 text-sm mt-1">{t[language].desc}</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-sm border bg-[#0a0a0a] border-purple-900/50 hover:bg-purple-900/20 transition-colors rounded-lg text-white font-bold min-h-[44px]"
                  >
                    <Filter className="w-4 h-4" /> Filters
                  </button>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 text-sm border bg-[#0a0a0a] border-purple-900/50 hover:bg-purple-900/20 transition-colors rounded-lg text-gray-300 focus:outline-none w-full md:w-auto min-h-[44px] cursor-pointer"
                  >
                    <option value="newest" className="text-gray-200 bg-[#111]">{t[language].newest}</option>
                    <option value="price_low" className="text-gray-200 bg-[#111]">{t[language].priceLow}</option>
                    <option value="price_high" className="text-gray-200 bg-[#111]">{t[language].priceHigh}</option>
                  </select>
                </div>
              </div>
              
              {isFilterOpen && (
                <div className="mb-6 p-4 bg-[#111] border border-purple-900/30 rounded-xl flex flex-wrap gap-4 animate-in slide-in-from-top-2 duration-200">
                   <div className="flex flex-col gap-2">
                     <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Platform</label>
                     <select className="bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none">
                       <option value="all">All Platforms</option>
                       <option value="pc">PC</option>
                       <option value="ps">PlayStation</option>
                       <option value="xbox">Xbox</option>
                     </select>
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Price Range</label>
                     <select className="bg-black border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none">
                       <option value="all">Any Price</option>
                       <option value="under20">Under $20</option>
                       <option value="20to50">$20 - $50</option>
                       <option value="over50">Over $50</option>
                     </select>
                   </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 w-full">
                {isLoadingStore ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-[#151515] border border-gray-800 rounded-xl flex flex-col h-full animate-skeleton overflow-hidden">
                      <div className="aspect-[3/4] sm:aspect-[2/3] bg-gray-800/20 relative"></div>
                      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="h-4 bg-gray-800/50 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-800/50 rounded w-1/2"></div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="h-6 bg-gray-800/50 rounded w-1/3"></div>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/50 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : filteredGames.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-gray-500">
                    <p>{t[language].noGamesFound}</p>
                  </div>
                ) : (
                  filteredGames.slice(0, visibleGamesCount).map((game, index) => (
                    <div key={game.id} style={{ animationDelay: `${(index % 12) * 50}ms` }} className="group bg-[#151515] border border-transparent rounded-xl flex flex-col h-full hover:border-[#bc13fe] transition-all duration-300 hover:shadow-[0_0_10px_rgba(188,19,254,0.4)] relative overflow-hidden transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both">
                      <div onClick={() => { handleOpenGameDetail(game.id); }} className="cursor-pointer">
                        <div className={`aspect-[3/4] sm:aspect-[2/3] bg-[#0a0a0a] relative rounded-t-xl overflow-hidden`}>
                          <img src={game.image} alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className={`absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/80 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[8px] sm:text-[10px] font-bold uppercase border ${game.badgeColor} max-w-[80%] truncate`}>
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
                      <div className="p-4 flex-1 flex flex-col justify-between items-stretch z-10 bg-[#151515]">
                        <div onClick={() => { handleOpenGameDetail(game.id); }} className="cursor-pointer">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h4 className="font-bold text-xs sm:text-base leading-tight text-gray-100 group-hover:text-purple-400 transition-colors uppercase line-clamp-2">{game.title}</h4>
                          </div>
                          <div className="flex items-center gap-2 mb-3 text-gray-400 mt-1">
  {game.category.includes('Console') || game.type.includes('PS5') || game.type.includes('Xbox') || game.type.includes('Nintendo') ? <Gamepad2 className="w-3 h-3 text-gray-500" /> : <Monitor className="w-3 h-3 text-gray-500" />}
  <p className="text-[10px] uppercase font-bold tracking-wider">{game.type}</p>
</div>
                        </div>
                        <div className="flex items-end justify-between mt-auto">
                          <div onClick={() => { handleOpenGameDetail(game.id); }} className="cursor-pointer">
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
                            className="bg-white text-black text-[10px] sm:text-xs font-bold px-3 sm:px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all active:scale-95 md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_4px_10px_rgba(255,255,255,0.1)]"
                          >
                            {t[language].buy}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {filteredGames.length > visibleGamesCount && (
                <div className="flex justify-center mt-10">
                   <button 
                     onClick={() => setVisibleGamesCount(prev => prev + 12)}
                     className="px-8 py-3 bg-[#111] border border-purple-900/50 rounded-xl text-white font-bold hover:bg-purple-900/20 hover:border-purple-500 transition-all flex items-center justify-center min-h-[44px]"
                   >
                     Load More
                   </button>
                </div>
              )}
            </>
          )}

          {(activeTab === 'orders' || (activeTab === 'user_dashboard' && userDashboardTab === 'orders')) && (
            <div className="max-w-[95%] 2xl:max-w-[1400px] w-full mx-auto w-full flex flex-col items-start gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{t[language].myOrders}</h2>
                <p className="text-gray-400 text-sm">{t[language].track}</p>
              </div>

              {orders.length === 0 ? (
                <div className="w-full p-10 border border-purple-900/30 rounded-2xl bg-black/20 flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-10 h-10 text-purple-900 mb-4" />
                  <p className="text-gray-400">{t[language].noOrd}</p>
                  <button onClick={() => { setActiveTab('store'); setActiveCategory(null); }} className="mt-4 px-4 py-2 bg-purple-600 rounded-lg text-white text-sm font-bold hover:bg-purple-500 transition-colors">{t[language].goStore}</button>
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
            <div className="max-w-[95%] 2xl:max-w-[1400px] w-full mx-auto w-full flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-white">{t[language].cart}</h2>
              {cart.length === 0 ? (
                <div className="w-full p-10 border border-purple-900/30 rounded-2xl bg-[#111] flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-10 h-10 text-purple-900 mb-4" />
                  <p className="text-gray-400">{t[language].empty}</p>
                  <button onClick={() => { setActiveTab('store'); setActiveCategory(null); }} className="mt-4 px-6 py-2 bg-purple-600 rounded-lg text-white text-sm font-bold hover:bg-purple-500 transition-colors min-h-[44px] flex items-center justify-center">{t[language].goStore}</button>
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
                    
                    <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Promo Code" 
                          value={promoCodeInput}
                          onChange={e => setPromoCodeInput(e.target.value)}
                          className="flex-1 bg-black border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:border-purple-500 text-white"
                        />
                        <button onClick={applyPromoCode} className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">Apply</button>
                      </div>
                      {promoError && <p className="text-xs text-red-500">{promoError}</p>}
                      {activePromoCode && (
                        <div className="flex justify-between items-center bg-purple-900/20 border border-purple-500/30 rounded p-2 mt-2">
                           <span className="text-xs text-purple-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {activePromoCode.code} Applied</span>
                           <button onClick={removePromoCode} className="text-gray-400 hover:text-white"><X className="w-3 h-3" /></button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                      <span>{t[language].items} ({cart.length})</span>
                      <span>{displayPrice(cart.reduce((sum, id) => sum + (gamesList.find(g => g.id === id)?.price || 0), 0))}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                      <span>{t[language].serviceFee}</span>
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

          {(activeTab === 'profile' || (activeTab === 'user_dashboard' && userDashboardTab === 'profile')) && (
            userProfile ? (
            <div className="max-w-[95%] 2xl:max-w-[1400px] w-full mx-auto w-full flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-white tracking-widest uppercase">{t[language].profOverview}</h2>
              <div className="bg-[#111] border border-purple-900/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.display_name || userProfile?.email}&backgroundColor=4c1d95`} alt="Avatar" className="w-24 h-24 rounded-full border-2 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] relative z-10 object-cover" />
                <div className="flex flex-col items-center sm:items-start text-center sm:text-start relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-widest">{userProfile?.display_name || userProfile?.email}</h3>
                  <p className="text-gray-400 text-sm mb-4 font-mono">Player ID: <span className="text-purple-400 font-bold">#PIXEL-9034</span></p>
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

              {/* Pixel Elite Gamer Card */}
              <h3 className="text-xl font-bold text-white mt-4 tracking-widest uppercase flex items-center gap-2">
                 <Zap className="w-5 h-5 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                 Pixel Elite Loyalty
              </h3>
              <div className="bg-[#0a0a0a] border border-purple-500/30 rounded-2xl p-6 lg:p-8 relative overflow-hidden group shadow-[0_0_30px_rgba(147,51,234,0.1)]">
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent pointer-events-none"></div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="flex-1 w-full">
                       <div className="flex items-center gap-4 mb-3">
                          <h4 className="text-lg font-black text-white uppercase tracking-wider">PIXEL Elite Card</h4>
                          <span className={`px-3 py-1 bg-black border border-gray-800 rounded-full font-bold text-[10px] uppercase tracking-widest ${currentTier.color}`}>
                             {currentTier.name} Tier
                          </span>
                       </div>
                       <p className="text-sm text-gray-400 mb-6 max-w-md">Earn {globalSettings.xpMultiplier} XP for every $1 spent. Unlock exclusive rewards by reaching higher tiers!</p>
                       
                       <div className="mb-2 flex justify-between items-end">
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">XP Progress</span>
                         <span className="text-xs font-bold text-purple-400">{userProfile?.xp_points || 0} / {currentTier.name === 'Diamond' ? 'MAX' : currentTier.threshold} XP</span>
                       </div>
                       {/* Progress Bar Line */}
                       <div className="h-2 bg-gray-800 rounded-full w-full max-w-2xl relative overflow-hidden">
                          <div 
                             className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-1000 shadow-[0_0_15px_#a855f7]`} 
                             style={{ width: `${xpPercentage}%`, right: language === 'ar' ? 0 : 'auto', left: language === 'ar' ? 'auto' : 0 }}
                          ></div>
                       </div>
                    </div>

                    <button onClick={() => setToastMessage('Exporting Gamer Card... Please wait.')} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600/20 text-purple-400 border border-purple-500 hover:bg-purple-600 hover:text-white transition-all rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                       <Download className="w-4 h-4" /> Export Card
                    </button>
                 </div>
              </div>

              {/* {t[language].secureVault} */}
              <h3 className="text-xl font-bold text-white mt-4 tracking-tight">{t[language].orderHistory}</h3>
              <div className="overflow-x-auto w-full bg-[#111] border border-gray-800 rounded-xl">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-[#1a1a1a] text-xs uppercase text-gray-500 font-bold border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">{t[language].id}</th>
                      <th className="px-6 py-4 whitespace-nowrap">{t[language].game}</th>
                      <th className="px-6 py-4 whitespace-nowrap">{t[language].stat}</th>
                      <th className="px-6 py-4 whitespace-nowrap">{t[language].keyCol}</th>
                      <th className="px-6 py-4 text-right">{t[language].invoice}</th>
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
                            {order.status === 'Approved' ? (
                               <div className="flex items-center gap-3">
                                  <span className="blur-sm hover:blur-none transition-all duration-300 cursor-pointer select-all px-2 py-1 bg-purple-900/20 rounded border border-purple-500/20">
                                     {order.gameKey}
                                  </span>
                                  <button onClick={() => { navigator.clipboard.writeText(order.gameKey || ''); setToastMessage('Key Copied to Clipboard!'); }} className="text-gray-400 hover:text-white" title="Copy to Clipboard">
                                    <svg xmlns="http://www.w0.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                  </button>
                               </div>
                            ) : '---'}
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
            ) : null
          )}

          {(activeTab === 'settings' || (activeTab === 'user_dashboard' && userDashboardTab === 'settings')) && (
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-white">{t[language].accSet}</h2>
              <form 
                onSubmit={async (e) => { 
                  e.preventDefault(); 
                  try {
                    let uId = userProfile?.id;
                    if (!uId) {
                      try {
                        const currentUser = await getCurrentUser();
                        const attributes = await fetchUserAttributes();
                        uId = currentUser?.userId || attributes?.sub;
                      } catch (e) {
                        console.error('Error fetching current user:', e);
                      }
                    }
                    if (!uId) {
                      setToastMessage('Error saving settings: missing user ID.');
                      return;
                    }
                    const token = await getAuthToken();
                    const res = await fetch(`/api/admin/profiles/${uId}`, {
                       method: 'PUT',
                       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                       body: JSON.stringify({ display_name: userProfile?.display_name, platforms: userProfile?.platforms, interests: userProfile?.interests })
                    });
                    if (res.ok) {
                       setToastMessage('Settings saved successfully!');
                    } else {
                       setToastMessage('Failed to save settings.');
                    }
                  } catch(err) { console.error(err); setToastMessage('Error saving settings.'); }
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="bg-[#111] border border-purple-900/30 rounded-2xl p-6 flex flex-col gap-5"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].usr}</label>
                  <input 
                    type="text" 
                    value={userProfile?.display_name || ''}
                    onChange={e => setUserProfile({...userProfile, display_name: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{language === 'ar' ? 'المنصات' : 'Platforms'}</label>
                  <div className="flex flex-wrap gap-2">
                    {['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'].map(plat => (
                       <button type="button" key={plat} onClick={() => {
                          const curr = userProfile?.platforms || [];
                          setUserProfile({...userProfile, platforms: curr.includes(plat) ? curr.filter((p:string) => p !== plat) : [...curr, plat]});
                       }} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${userProfile?.platforms?.includes(plat) ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-black border-gray-800 text-gray-400 hover:border-gray-600'}`}>{plat}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{language === 'ar' ? 'الاهتمامات' : 'Interests'}</label>
                  <div className="flex flex-wrap gap-2">
                    {['Action', 'RPG', 'Strategy', 'Sports', 'Racing', 'FPS'].map(int => (
                       <button type="button" key={int} onClick={() => {
                          const curr = userProfile?.interests || [];
                          setUserProfile({...userProfile, interests: curr.includes(int) ? curr.filter((i:string) => i !== int) : [...curr, int]});
                       }} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${userProfile?.interests?.includes(int) ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-black border-gray-800 text-gray-400 hover:border-gray-600'}`}>{int}</button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 items-center mt-4">
                  <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-[0_0_15px_rgba(147,51,234,0.2)]">
                    {t[language].save}
                  </button>
                  <button 
                    type="button" 
                    onClick={async () => {
                      if(window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف الحساب؟' : 'Are you sure you want to delete your account? This action cannot be undone.')) {
                         try {
                             const user = await getCurrentUser();
                             if (user?.userId) {
                               await fetch(`/api/public/profiles/${user.userId}`, { method: 'DELETE' });
                             }
                             try {
                               await deleteUser();
                             } catch(origErr) {
                               // Fallback to our backend if federated user self-delete fails
                               if (user?.userId) {
                                   const token = await getAuthToken();
                                   const fallbackRes = await fetch(`/api/admin/profiles/cognito/${user.userId}`, {
                                       method: 'DELETE',
                                       headers: { 'Authorization': `Bearer ${token}` }
                                   });
                                   if (!fallbackRes.ok) throw origErr;
                               } else {
                                   throw origErr;
                               }
                             }
                             setIsLoggedIn(false);
                             setUserProfile(null);
                             setActiveTab('store');
                             setToastMessage('Account deleted successfully.');
                             setTimeout(() => { setToastMessage(null); window.location.reload(); }, 2000);
                         } catch (err: any) {
                             const errMsg = err.message || err.toString() || 'Error deleting account.';
                             setToastMessage(errMsg);
                             setTimeout(() => setToastMessage(null), 5000);
                             console.error(err);
                         }
                      }
                    }}
                    className="bg-red-600/10 text-red-500 hover:bg-red-500 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors border border-red-500/30 hover:border-transparent">
                    {language === 'ar' ? 'حذف حسابي' : 'Delete My Account'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'page' && currentSlug && (() => {
             const page = cmsPages.find(p => p.slug === currentSlug);
             if (!page) return <div className="text-white text-center py-20 font-bold">Page Not Found</div>;
             return (
               <div className="max-w-[95%] 2xl:max-w-[1400px] w-full mx-auto w-full flex flex-col gap-6">
                 <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{page.title}</h2>
                 <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                   {page.content}
                 </div>
               </div>
             );
          })()}
        </main>
      </div>

      
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-purple-900/40 z-[90] flex items-center justify-around pb-safe shadow-[0_-5px_30px_rgba(168,85,247,0.15)] pb-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <button onClick={() => { setActiveTab('store'); setActiveCategory(null); }} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'store' ? 'text-purple-400' : 'text-gray-500 hover:text-purple-300 transition-colors'}`}>
          <Home className={`w-6 h-6 ${activeTab === 'store' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t[language].store}</span>
        </button>
        <button onClick={() => { setActiveTab('cart'); }} className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'cart' ? 'text-purple-400' : 'text-gray-500 hover:text-purple-300 transition-colors'}`}>
          <ShoppingBag className={`w-6 h-6 ${cartAnimating ? 'animate-bounce-cart' : ''} ${activeTab === 'cart' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}`} />
          {cart.length > 0 && (
             <span className="absolute top-[8px] right-[20px] w-4 h-4 bg-red-500 border-2 border-[#0a0a0a] rounded-full text-[9px] flex items-center justify-center font-bold text-white scale-110 shadow-[0_0_8px_#ef4444] animate-in zoom-in">{cart.length}</span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider">{t[language].cart || 'Cart'}</span>
        </button>
        {isLoggedIn ? (
          <button onClick={() => { setActiveTab('user_dashboard'); setUserDashboardTab('orders'); }} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'user_dashboard' && userDashboardTab === 'orders' ? 'text-purple-400' : 'text-gray-500 hover:text-purple-300 transition-colors'}`}>
            <ListOrdered className={`w-6 h-6 ${activeTab === 'user_dashboard' && userDashboardTab === 'orders' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t[language].orders}</span>
          </button>
        ) : (
          <button onClick={() => { setShowAuthModal('login') }} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-purple-300 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t[language].signIn}</span>
          </button>
        )}
        <button onClick={() => setIsMobileMenuOpen(true)} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isMobileMenuOpen ? 'text-purple-400' : 'text-gray-500 hover:text-purple-300 transition-colors'}`}>
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Menu</span>
        </button>
      </div>
      
      {/* Bottom Bar Info */}

      <footer className="hidden md:flex w-full bg-black/60 backdrop-blur-md border-t border-purple-900/30 px-6 md:px-8 py-6 md:py-0 md:h-12 flex-col md:flex-row items-center justify-center md:justify-between text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium flex-shrink-0 z-10 relative gap-4 md:gap-0 mt-auto">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <span>&copy; 2026 Pixel Store - ALL RIGHTS RESERVED</span>
          {isLoggedIn && userProfile?.role === 'ADMIN' && (
            <button 
              onClick={() => setActiveTab('admin')} 
              className="border border-purple-900 px-3 py-1 rounded text-purple-400 hover:bg-purple-900/30 transition-colors bg-black font-bold flex items-center gap-1.5"
            >
              <Shield className="w-3 h-3" /> Pixel HQ Portal
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
    </div>

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
                      <h2 className="text-2xl font-black text-white tracking-tighter mb-1">PIXEL<span className="text-purple-500">STORE</span></h2>
                      <p className="text-xs text-gray-500">Baghdad, Iraq</p>
                      <p className="text-xs text-gray-500 mt-4 max-w-[200px]">support@pixelstore.com<br/>0770 123 4567</p>
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
                   <p className="text-sm text-white font-bold mb-1">{userProfile?.display_name || userProfile?.email}</p>
                   <p className="text-xs text-gray-400">{userProfile?.email}</p>
                </div>

                <table className="w-full text-left text-sm text-gray-300">
                   <thead>
                      <tr className="border-b border-gray-800">
                         <th className="pb-3 text-xs uppercase tracking-widest text-gray-500">{t[language].descriptionCol}</th>
                         <th className="pb-3 text-xs uppercase tracking-widest text-gray-500 text-right">{t[language].amount}</th>
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
                      Thank you for shopping at Pixel Store.
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
          {/* Publish Modal */}
      {publishModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setPublishModal({...publishModal, isOpen: false})}></div>
          <div className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] border border-purple-900/50 rounded-2xl w-full max-w-lg p-8 relative shadow-[0_0_80px_rgba(147,51,234,0.3)] animate-in zoom-in-95 duration-300" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            
            <div className="absolute top-0 right-0 w-full h-full bg-purple-600/5 rounded-2xl pointer-events-none"></div>

            <div className="flex justify-between items-center mb-2 relative z-10">
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 uppercase tracking-widest flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-purple-500" />
                {t[language].publishItemTitle}
              </h3>
              <button type="button" onClick={() => setPublishModal({...publishModal, isOpen: false})} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-gray-400 hover:text-white hover:bg-purple-900/50 transition-colors border border-gray-800 hover:border-purple-500/50">✕</button>
            </div>
            
            <p className="text-xs text-gray-500 mb-4">{t[language].publishSubtitle}</p>
            <div className="mb-6 bg-black/80 p-4 rounded-xl border border-purple-900/30 flex items-center gap-3 relative z-10 shadow-inner">
               <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
               <p className="text-md text-white font-mono break-all line-clamp-2" dir="ltr">{publishModal.subscription?.name || publishModal.subscription?.title}</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const newGame = {
                 id: Math.max(...gamesList.map(g => g.id), 0) + 1,
                 title: publishModal.subscription?.name || publishModal.subscription?.title || 'Unknown',
                 price: parseFloat(publishModal.sellingPrice),
                 category: publishModal.category,
                 type: publishModal.type,
                 image: publishModal.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
                 stock: 1,
                 rating: 5.0,
                 description: "Account published from admin dashboard."
              };
              setGamesList([...gamesList, newGame]);
              
              try {
                await fetch('/api/admin/products', {
                   method: 'POST',
                   headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${(await getAuthToken())}`
                   },
                   body: JSON.stringify({
                      name: newGame.title,
                      costPrice: parseFloat(publishModal.costPrice) || 0,
                      sellingPrice: newGame.price,
                      supplier: publishModal.subscription?.supplier || publishModal.subscription?.account_username || 'Local',
                      category: newGame.category,
                      type: newGame.type,
                      image_url: newGame.image
                   })
                });
              } catch (err) {}
              
              setPublishModal({...publishModal, isOpen: false});
              setToastMessage('Subscription published successfully!');
              setTimeout(() => setToastMessage(null), 3000);
            }} className="flex flex-col gap-4 relative z-10">
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 text-start">{t[language].costPriceOpt}</label>
                    <div className="relative">
                      <span className={"absolute top-1/2 -translate-y-1/2 text-purple-500 font-bold " + (language === 'ar' ? 'right-3' : 'left-3')}>$</span>
                      <input dir="ltr" type="number" step="0.01" value={publishModal.costPrice} onChange={e => setPublishModal({...publishModal, costPrice: e.target.value})} className={"w-full bg-[#111] border border-gray-800 rounded-xl py-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-all focus:bg-purple-900/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] " + (language === 'ar' ? 'pr-8 pl-3' : 'pl-8 pr-3')} placeholder={t[language].placeholder0} />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-2 text-start">{t[language].sellPriceRequired}</label>
                    <div className="relative">
                      <span className={"absolute top-1/2 -translate-y-1/2 text-purple-500 font-bold " + (language === 'ar' ? 'right-3' : 'left-3')}>$</span>
                      <input dir="ltr" type="number" step="0.01" required value={publishModal.sellingPrice} onChange={e => setPublishModal({...publishModal, sellingPrice: e.target.value})} className={"w-full bg-[#111] border border-gray-800 rounded-xl py-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-all focus:bg-purple-900/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] " + (language === 'ar' ? 'pr-8 pl-3' : 'pl-8 pr-3')} placeholder={t[language].placeholder0} />
                    </div>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 text-start">{t[language].catSelect}</label>
                    <select value={publishModal.category} onChange={e => setPublishModal({...publishModal, category: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-all focus:bg-purple-900/10 cursor-pointer">
                       <option value="PC Game Keys">PC Game Keys</option>
                       <option value="Console Subs">Console Subs</option>
                       <option value="In-game Currency">In-game Currency</option>
                       <option value="Software">Software</option>
                       <option value="Subscription">Subscription</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 text-start">{t[language].typeRegInput}</label>
                    <input dir="ltr" type="text" value={publishModal.type} onChange={e => setPublishModal({...publishModal, type: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 text-white text-start transition-all focus:bg-purple-900/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)]" placeholder={t[language].placeholderReg} />
                 </div>
               </div>

               <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 text-start">{t[language].coverImgOpt}</label>
                  <input dir="ltr" type="text" value={publishModal.image} onChange={e => setPublishModal({...publishModal, image: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 text-white text-start transition-all focus:bg-purple-900/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)]" placeholder={t[language].leaveEmpty} />
               </div>

               <div className="flex items-center gap-3 mt-6">
                 <button type="button" onClick={() => setPublishModal({...publishModal, isOpen: false})} className="flex-1 bg-black border border-gray-800 text-white py-3.5 rounded-xl hover:bg-gray-900 hover:border-gray-600 transition-all font-bold text-sm">
                   {t[language].cancelText}
                 </button>
                 <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3.5 rounded-xl hover:from-purple-500 hover:to-purple-700 transition-all font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                   {t[language].confirmPub}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

          {/* Generic CRUD Modal */}
      {crudModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-md p-6 relative shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 capitalize">{crudModal.mode} {crudModal.table}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const data: any = {};
              crudModal.fields.forEach(f => {
                const val = fd.get(f.name);
                if (f.type === 'number') data[f.name] = Number(val);
                else if (f.type === 'boolean') data[f.name] = fd.get(f.name) === 'on' ? true : false;
                else data[f.name] = val;
              });
              handleCrudSubmit(data);
            }} className="flex flex-col gap-4">
              {crudModal.fields.map(f => (
                <div key={f.name}>
                  <label className="text-xs font-bold text-gray-500 uppercase">{f.label}</label>
                  {f.type === 'select' ? (
                     <select name={f.name} defaultValue={crudModal.item?.[f.name]} className="w-full bg-black border border-gray-800 rounded p-2 text-white font-mono mt-1 focus:outline-none focus:border-purple-500">
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                     </select>
                  ) : f.type === 'boolean' ? (
                     <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" name={f.name} defaultChecked={crudModal.item?.[f.name]} className="w-4 h-4 accent-purple-500" />
                        <span className="text-sm font-bold text-gray-300">Yes / No</span>
                     </div>
                  ) : (
                    <input 
                      type={f.type === 'password' ? 'text' : f.type === 'number' ? 'number' : 'text'} 
                      step={f.type === 'number' ? 'any' : undefined}
                      name={f.name}
                      defaultValue={f.type === 'password' && crudModal.mode === 'edit' ? 'MASKED' : crudModal.item?.[f.name]} 
                      className="w-full bg-black border border-gray-800 rounded p-2 text-white font-mono mt-1 focus:outline-none focus:border-purple-500" 
                      required
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 justify-end mt-4">
                <button type="button" onClick={() => setCrudModal({...crudModal, isOpen: false})} className="px-4 py-2 text-gray-400 hover:text-white font-bold text-sm transition-colors">{t[language].cancelText}</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold text-sm transition-colors">{t[language].save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Game Detail Modal */}
      {promoModal.isOpen && promoModal.product && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111] border border-purple-900/50 rounded-xl w-full max-w-md p-6 relative shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Apply Offer: {promoModal.product.name}</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Original Price</label>
                <p className="text-white font-mono">${promoModal.product.sellingPrice}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Discount Price (Optional)</label>
                <input 
                  type="number" 
                  value={promoModal.discountPrice} 
                  onChange={e => setPromoModal({...promoModal, discountPrice: e.target.value})} 
                  placeholder="e.g. 19.99"
                  className="w-full bg-black border border-gray-800 rounded p-2 text-white font-mono mt-1 focus:outline-none focus:border-purple-500" 
                />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <input 
                  type="checkbox" 
                  id="isFeatured"
                  checked={promoModal.isFeatured} 
                  onChange={e => setPromoModal({...promoModal, isFeatured: e.target.checked})} 
                  className="w-4 h-4 accent-purple-500" 
                />
                <label htmlFor="isFeatured" className="text-sm font-bold text-gray-300">Feature this product on Storefront</label>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <button 
                  onClick={() => setPromoModal({isOpen: false, product: null, discountPrice: '', isFeatured: false})} 
                  className="px-4 py-2 text-gray-400 hover:text-white font-bold text-sm transition-colors"
                >{t[language].cancelText}</button>
                <button 
                  onClick={async () => {
                    const dp = parseFloat(promoModal.discountPrice) || null;
                    try {
                      const token = (await getAuthToken());
                      const res = await fetch(`/api/admin/products/${promoModal.product.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({
                          discountPrice: dp,
                          isFeatured: promoModal.isFeatured
                        })
                      });
                      if (res.ok) {
                        setPromoModal({isOpen: false, product: null, discountPrice: '', isFeatured: false});
                        // Refresh list
                        const resList = await fetch('/api/admin/products', { headers: { 'Authorization': `Bearer ${token}` } });
                        if (resList.ok) setProductList(await resList.json());
                        // Refresh public
                        const publicRes = await fetch('/api/public/products');
                        if (publicRes.ok) setPublicProducts(await publicRes.json());
                      }
                    } catch(e) { console.error(e); }
                  }} 
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold text-sm transition-colors"
                >Save Offer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isGameDetailOpen && selectedGameId !== null && (() => {
        const game = gamesList.find(g => g.id === selectedGameId);
        if (!game) return null;
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-0 lg:p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className={`bg-[#151515] border border-purple-900/40 rounded-none lg:rounded-2xl w-full h-full lg:h-auto lg:max-h-[90vh] lg:max-w-4xl overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(147,51,234,0.15)] animate-[slideInUp_0.3s_ease-out] ${isGameDetailLoading ? 'animate-skeleton' : ''}`}>
              <button 
                onClick={() => setIsGameDetailOpen(false)} 
                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                style={language === 'ar' ? { left: '1rem', right: 'auto' } : {}}
              >
                <X className="w-5 h-5" />
              </button>
              
              {isGameDetailLoading ? (
                 <>
                    <div className="w-full md:w-1/2 h-64 md:h-full relative bg-gray-800/20 border-b md:border-r border-gray-800 flex flex-col justify-end p-8">
                       <div className="w-20 h-6 bg-gray-700/50 rounded mb-3"></div>
                       <div className="w-3/4 h-8 bg-gray-700/50 rounded"></div>
                    </div>
                    <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col gap-6 bg-[#151515]">
                       <div>
                         <div className="w-1/3 h-4 bg-gray-700/50 rounded mb-2"></div>
                         <div className="w-1/4 h-8 bg-gray-700/50 rounded mb-4"></div>
                         <div className="flex gap-1 mb-6">
                            <div className="w-4 h-4 bg-gray-700/50 rounded"></div><div className="w-4 h-4 bg-gray-700/50 rounded"></div><div className="w-4 h-4 bg-gray-700/50 rounded"></div>
                         </div>
                         <div className="space-y-2">
                           <div className="w-full h-3 bg-gray-700/50 rounded"></div>
                           <div className="w-full h-3 bg-gray-700/50 rounded"></div>
                           <div className="w-2/3 h-3 bg-gray-700/50 rounded"></div>
                         </div>
                       </div>
                       <div className="mt-auto pt-6 border-t border-gray-800">
                          <div className="w-full h-12 bg-gray-700/50 rounded-lg"></div>
                       </div>
                    </div>
                 </>
              ) : (
                 <>
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

                 <div className="mt-6 border-t border-purple-900/30 pt-6">
                    <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">{language === 'ar' ? 'التقييمات والتعليقات' : 'Reviews & Comments'}</h3>
                    <div className="flex items-center gap-2 mb-6">
                       <div className="flex text-yellow-400">
                         {[1, 2, 3, 4, 5].map(star => (
                           <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={star <= (game.rating || 4.5) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                         ))}
                       </div>
                       <span className="text-gray-400 text-sm font-bold">{game.rating || 4.5} / 5</span>
                    </div>
                    <div className="flex flex-col gap-4">
                       <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                             <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center text-xs font-bold text-purple-400">A</div>
                             <div>
                                <p className="text-sm font-bold text-gray-300">Ahmed M.</p>
                                <p className="text-[10px] text-gray-500">2 days ago</p>
                             </div>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">Instant delivery and code worked perfectly. Will definitively buy again.</p>
                       </div>
                       <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                             <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-xs font-bold text-blue-400">Z</div>
                             <div>
                                <p className="text-sm font-bold text-gray-300">Zahra K.</p>
                                <p className="text-[10px] text-gray-500">1 week ago</p>
                             </div>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">Great customer support. Fast and reliable store!</p>
                       </div>
                    </div>
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
              </>
              )}
            </div>
          </div>
        );
      })()}

      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-auto md:left-auto md:bottom-10 md:right-10 z-[300] bg-[#111] border border-purple-500 backdrop-blur w-[90%] md:w-auto md:min-w-[300px] text-white px-6 py-4 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.4)] font-bold flex items-center gap-3 animate-in fade-in duration-300 pointer-events-none">
          <CheckCircle2 className="w-5 h-5 text-purple-400" />
          {toastMessage}
        </div>
      )}

      {showAuthModal && (
        <AuthModal 
          initialMode={showAuthModal} 
          language={language as any} 
          onClose={() => setShowAuthModal(null)} 
          onSuccess={() => {
            setShowAuthModal(null);
            setToastMessage(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Successfully logged in');
            setTimeout(() => setToastMessage(null), 3000);
            window.location.reload();
          }} 
        />
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
                  {activePromoCode && (
                    <div className="mb-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 p-2 rounded text-xs font-bold flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4" />
                       Promo Code ({activePromoCode.code}): {activePromoCode.discountPercent}% off!
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
            </>
          )}
        </div>
      </div>

    </>
  );
}
