import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Rename LUDEX STORE / LUDEX HQ to Pixel Store / Pixel .Store ERP
text = text.replace(/LUDEX STORE/g, 'Pixel Store');
text = text.replace(/LUDEX HQ/g, 'Pixel .Store ERP');
text = text.replace(/LUDEX HQ PORTAL/g, 'Pixel .Store ERP');
text = text.replace(/Ludex Store/g, 'Pixel Store');
text = text.replace(/Ludex HQ/g, 'Pixel .Store ERP');
text = text.replace(/LUDEX/g, 'PIXEL');
text = text.replace(/Ludex/g, 'Pixel');

// Update userProfile state
const oldUserProfile = `const [userProfile, setUserProfile] = useState<{name: string, email: string, role: 'CUSTOMER' | 'MODERATOR' | 'ADMIN'}>({ name: 'Felix user', email: 'felix@example.com', role: 'ADMIN' });`;
const newUserProfile = `const [userProfile, setUserProfile] = useState<{name: string, email: string, role: 'CUSTOMER' | 'MODERATOR' | 'ADMIN', xp_points: number, platformPreference: string, favoriteGenres: string[], emailNotifications: boolean, twoFactorEnabled: boolean}>({ name: 'Felix user', email: 'felix@example.com', role: 'ADMIN', xp_points: 1250, platformPreference: 'PC', favoriteGenres: ['Action', 'RPG'], emailNotifications: true, twoFactorEnabled: false });`;
text = text.replace(oldUserProfile, newUserProfile);

// Ensure Currency works with localStorage
const oldCurrency = `const [currency, setCurrency] = useState<'USD' | 'IQD'>('IQD');`;
const newCurrency = `const [currency, setCurrency] = useState<'USD' | 'IQD'>((localStorage.getItem('pixel_currency') as 'USD' | 'IQD') || 'IQD');
  useEffect(() => {
    localStorage.setItem('pixel_currency', currency);
  }, [currency]);
`;
text = text.replace(oldCurrency, newCurrency);

fs.writeFileSync('src/App.tsx', text);
