import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Reverse Pixel -> Ludex
text = text.replace(/Pixel Store/g, 'Ludex Store');
text = text.replace(/Pixel \.Store/g, 'Ludex Store');
text = text.replace(/PIXEL Elite/g, 'LUDEX Elite');
text = text.replace(/Pixel Elite/g, 'Ludex Elite');
text = text.replace(/#PIXEL-/g, '#LUDEX-');
text = text.replace(/PIXELSTORE/g, 'LUDEXSTORE');
text = text.replace(/PIXEL10/g, 'LUDEX10');
text = text.replace(/'PIXEL-' \+/g, "'LUDEX-' +");
text = text.replace(/PIXEL<span/g, 'LUDEX<span');
text = text.replace(/pixel_currency/g, 'ludex_currency');
text = text.replace(/LUDEX STORE/g, 'Ludex Store'); // Make sure casing is nice
text = text.replace(/Ludex Store ERP PORTAL/g, 'Ludex HQ Portal');
text = text.replace(/Ludex Store ERP Portal/g, 'Ludex HQ Portal');
text = text.replace(/Ludex Store ERP/g, 'Ludex HQ');

// Avatar URL feature
const oldProfileDef = `const [userProfile, setUserProfile] = useState<{name: string, email: string, role: 'CUSTOMER' | 'MODERATOR' | 'ADMIN', xp_points: number, platformPreference: string, favoriteGenres: string[], emailNotifications: boolean, twoFactorEnabled: boolean}>({ name: 'Felix user', email: 'felix@example.com', role: 'ADMIN', xp_points: 1250, platformPreference: 'PC', favoriteGenres: ['Action', 'RPG'], emailNotifications: true, twoFactorEnabled: false });`;
const newProfileDef = `const [userProfile, setUserProfile] = useState<{name: string, email: string, role: 'CUSTOMER' | 'MODERATOR' | 'ADMIN', xp_points: number, platformPreference: string, favoriteGenres: string[], emailNotifications: boolean, twoFactorEnabled: boolean, avatarUrl?: string}>({ name: 'Felix user', email: 'felix@example.com', role: 'ADMIN', xp_points: 1250, platformPreference: 'PC', favoriteGenres: ['Action', 'RPG'], emailNotifications: true, twoFactorEnabled: false, avatarUrl: '' });`;
text = text.replace(oldProfileDef, newProfileDef);

// Navbar avatar logic
text = text.replace(
  `{userProfile.name.charAt(0)}`,
  `<img src={userProfile.avatarUrl || \\\`https://api.dicebear.com/7.x/avataaars/svg?seed=\\\${userProfile.name}&backgroundColor=4c1d95\\\`} alt="Avatar" className="w-full h-full object-cover" />`
);

// Profile overview avatar
text = text.replace(
  `<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=4c1d95" alt="Avatar" className="w-24 h-24 rounded-full border-2 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] relative z-10" />`,
  `<img src={userProfile.avatarUrl || \\\`https://api.dicebear.com/7.x/avataaars/svg?seed=\\\${userProfile.name}&backgroundColor=4c1d95\\\`} alt="Avatar" className="w-24 h-24 rounded-full border-2 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] relative z-10 object-cover" />`
);

// Add avatar input in settings
const emailInputHtml = `<div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].eml}</label>`;
const avatarInputHtml = `<div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].avatarImg}</label>
                  <input 
                    type="text" 
                    value={userProfile.avatarUrl || ''}
                    onChange={e => setUserProfile({...userProfile, avatarUrl: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors mb-4" 
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].eml}</label>`;
text = text.replace(emailInputHtml, avatarInputHtml);

// Fix Secure vault titles
text = text.replace(
  `{t[language].orderHistory}`,
  `{t[language].secureVault}`
);
text = text.replace(
  `Secure Digital Vault (My Keys)`,
  `{t[language].secureVault}`
);


fs.writeFileSync('src/App.tsx', text);
