import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove the wrongly placed getTier
const wrongLogic = `
  const getTier = (xp: number) => {
    if (xp < 1000) return { name: 'Bronze', color: 'text-orange-400', threshold: 1000 };
    if (xp < 5000) return { name: 'Silver', color: 'text-gray-300', threshold: 5000 };
    if (xp < 10000) return { name: 'Gold', color: 'text-yellow-400', threshold: 10000 };
    return { name: 'Diamond', color: 'text-cyan-400', threshold: xp };
  };
  const currentTier = getTier(userProfile.xp_points || 0);
  const xpPercentage = currentTier.name === 'Diamond' ? 100 : Math.min(((userProfile.xp_points || 0) / currentTier.threshold) * 100, 100);
`;

text = text.replace(wrongLogic, '');

// Inject correctly around line 506 (before displayPrice)
const properLogic = `
  // Calculate price with currency
  const getTier = (xp: number) => {
    if (xp < 1000) return { name: 'Bronze', color: 'text-orange-400', threshold: 1000 };
    if (xp < 5000) return { name: 'Silver', color: 'text-gray-300', threshold: 5000 };
    if (xp < 10000) return { name: 'Gold', color: 'text-yellow-400', threshold: 10000 };
    return { name: 'Diamond', color: 'text-cyan-400', threshold: xp };
  };
  const currentTier = getTier(userProfile.xp_points || 0);
  const xpPercentage = currentTier.name === 'Diamond' ? 100 : Math.min(((userProfile.xp_points || 0) / currentTier.threshold) * 100, 100);

`;

text = text.replace('  // Calculate price with currency', properLogic);

// Fix logout userProfile
text = text.replace(
  `setUserProfile({name: '', email: '', role: 'CUSTOMER'});`,
  `setUserProfile({name: '', email: '', role: 'CUSTOMER', xp_points: 0, platformPreference: 'PC', favoriteGenres: [], emailNotifications: false, twoFactorEnabled: false});`
);

fs.writeFileSync('src/App.tsx', text);
