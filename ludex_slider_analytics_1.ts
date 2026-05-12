import fs from 'fs';

let appText = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. GAMES_DATA map modifier to add views_count, sales_count, is_preorder
appText = appText.replace(
  /const \[gamesList, setGamesList\] = useState\(GAMES_DATA\.map\(g => \(\{\.\.\.g, active: true\}\)\)\);/g,
  `const [gamesList, setGamesList] = useState(GAMES_DATA.map(g => ({...g, active: true, views_count: Math.floor(Math.random() * 100), sales_count: Math.floor(Math.random() * 50), is_preorder: g.id % 5 === 0, release_date: g.id % 5 === 0 ? '2026-11-20' : null})));`
);

appText = appText.replace(
  /GAMES_DATA\.map\(g => \(\{\.\.\.g, active: true\}\)\)/g,
  `GAMES_DATA.map(g => ({...g, active: true, views_count: Math.floor(Math.random() * 100), sales_count: Math.floor(Math.random() * 50), is_preorder: g.id % 5 === 0, release_date: g.id % 5 === 0 ? '2026-11-20' : null}))`
);

// 2. handleOpenGameDetail functionality
const newFunction = `
  const handleOpenGameDetail = (id: number | string) => {
    setSelectedGameId(id);
    setIsGameDetailOpen(true);
    setGamesList(prev => prev.map(g => g.id === id ? {...g, views_count: (typeof g.views_count === 'number' ? g.views_count : 0) + 1} : g));
  };
`;
appText = appText.replace(
  /const addToCart = \(id: number \| string\) => \{/,
  newFunction + `\n  const addToCart = (id: number | string) => {`
);

// Replace onClick inline handlers
appText = appText.replace(/setSelectedGameId\(game\.id\); setIsGameDetailOpen\(true\);/g, 'handleOpenGameDetail(game.id);');

// 3. Sales Count increment
const approveLogic = `const gameItem = gamesList.find(g => g.id === order.gameId);
                                      if (gameItem && gameItem.stock !== undefined) {
                                          gameItem.stock = Math.max(0, gameItem.stock - 1);
                                          gameItem.sales_count = (typeof gameItem.sales_count === 'number' ? gameItem.sales_count : 0) + 1;
                                          setGamesList([...gamesList]);
                                      }`;
appText = appText.replace(
  /const gameItem = gamesList\.find\(g => g\.id === order\.gameId\);\s+if \(gameItem && gameItem\.stock !== undefined\) \{\s+gameItem\.stock = Math\.max\(0, gameItem\.stock - 1\);\s+setGamesList\(\[\.\.\.gamesList\]\);\s+\}/g,
  approveLogic
);

// 4. Promo Banners State & Admin Panel
const promoBannersState = `const [promoBanners, setPromoBanners] = useState([
   { id: '1', title: 'Summer Gaming Festival', image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=1200', target_url: '#', is_active: true, display_order: 1 }
]);
const [heroSlideIdx, setHeroSlideIdx] = useState(0);

useEffect(() => {
   const int = setInterval(() => {
      setHeroSlideIdx(prev => (prev + 1) % 5); // 5 slides max usually
   }, 5000);
   return () => clearInterval(int);
}, []);
`;
appText = appText.replace(
  /const \[promotions, setPromotions\] = useState<any\[\]>\(\[\]\);/g,
  `const [promotions, setPromotions] = useState<any[]>([]);\n  ${promoBannersState}`
);

// We need to inject the Hero slider into the Store Tab
const heroSliderHtml = `
              {/* Dynamic Hero Slider */}
              {(() => {
                const activeBanners = promoBanners.filter(b => b.is_active).sort((a,b) => a.display_order - b.display_order).map(b => ({ type: 'banner', ...b }));
                const topVisited = [...gamesList].sort((a,b) => (b.views_count || 0) - (a.views_count || 0))[0];
                const topSelling = [...gamesList].sort((a,b) => (b.sales_count || 0) - (a.sales_count || 0))[0];
                const preorders = gamesList.filter(g => g.is_preorder).slice(0, 2);
                
                const slides: any[] = [...activeBanners];
                if (topVisited) slides.push({ type: 'game', label: 'Trending 🔥', ...topVisited });
                if (topSelling) slides.push({ type: 'game', label: 'Best Seller 👑', ...topSelling });
                preorders.forEach(p => slides.push({ type: 'game', label: 'Pre-order ⏳', ...p }));

                const currentSlide = slides[heroSlideIdx % slides.length] || slides[0];

                if (!currentSlide) return null;

                return (
                  <div className="w-full h-48 md:h-72 lg:h-96 rounded-2xl overflow-hidden relative mb-8 group bg-black">
                     {slides.map((slide, i) => (
                        <div key={i} className={\`absolute inset-0 transition-opacity duration-1000 \${i === (heroSlideIdx % slides.length) ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`} onClick={() => slide.type === 'game' ? handleOpenGameDetail(slide.id) : null} style={{cursor: slide.type === 'game' ? 'pointer' : 'default'}}>
                           <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-60 mix-blend-screen" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                           <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-left">
                              {slide.type === 'game' && <span className="inline-block px-3 py-1 mb-3 text-[10px] md:text-xs font-black uppercase text-white bg-red-600 rounded drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">{slide.label}</span>}
                              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-lg">{slide.title}</h2>
                              {slide.type === 'game' && <p className="text-purple-400 font-bold mt-2 text-lg md:text-xl drop-shadow-lg">{slide.price} IQD</p>}
                           </div>
                        </div>
                     ))}
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {slides.map((_, idx) => (
                           <div key={idx} onClick={() => setHeroSlideIdx(idx)} className={\`w-2 h-2 rounded-full cursor-pointer transition-all \${idx === (heroSlideIdx % slides.length) ? 'bg-purple-500 w-4' : 'bg-gray-500 hover:bg-white'}\`}></div>
                        ))}
                     </div>
                  </div>
                );
              })()}
`;
appText = appText.replace(
  /<div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">/g,
  `${heroSliderHtml}\n              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">`
);


// 5. Admin Panel Settings for Level limits
const newSettingsHTML = `
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2 font-bold">{t[language].xpRate || 'XP Multiplier'}</label>
                      {editingSettings ? (
                        <input type="number" value={globalSettings.xpMultiplier} onChange={e => setGlobalSettings({...globalSettings, xpMultiplier: Number(e.target.value)})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white font-bold">{globalSettings.xpMultiplier} XP per USD</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2 font-bold">Bronze Tier Limit</label>
                      {editingSettings ? (
                        <input type="number" value={globalSettings.bronzeLimit || 1000} onChange={e => setGlobalSettings({...globalSettings, bronzeLimit: Number(e.target.value)})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white font-bold">{globalSettings.bronzeLimit || 1000} XP</p>
                      )}
                    </div>
                     <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2 font-bold">Silver Tier Limit</label>
                      {editingSettings ? (
                        <input type="number" value={globalSettings.silverLimit || 5000} onChange={e => setGlobalSettings({...globalSettings, silverLimit: Number(e.target.value)})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white font-bold">{globalSettings.silverLimit || 5000} XP</p>
                      )}
                    </div>
                     <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2 font-bold">Gold Tier Limit</label>
                      {editingSettings ? (
                        <input type="number" value={globalSettings.goldLimit || 10000} onChange={e => setGlobalSettings({...globalSettings, goldLimit: Number(e.target.value)})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white font-bold">{globalSettings.goldLimit || 10000} XP</p>
                      )}
                    </div>
`;

appText = appText.replace(
  /<div>\s*<label className="block text-xs uppercase text-gray-500 mb-2 font-bold">\{t\[language\]\.xpRate \|\| 'XP Multiplier'\}<\/label>\s*\{editingSettings \? \(\s*<input type="number" [^\n]*\/>\s*\) : \(\s*<p className="text-white font-bold">\{globalSettings\.xpMultiplier\} XP per USD<\/p>\s*\)\}\s*<\/div>/g,
  newSettingsHTML
);

// We need to use these tier limits in getTier()
const getTierRegex = /const getTier = \(xp: number\) => \{\s+if \(xp < 1000\) return \{ name: 'Bronze', color: 'text-orange-400', threshold: 1000 \};\s+if \(xp < 5000\) return \{ name: 'Silver', color: 'text-gray-300', threshold: 5000 \};\s+if \(xp < 10000\) return \{ name: 'Gold', color: 'text-yellow-400', threshold: 10000 \};\s+return \{ name: 'Diamond', color: 'text-cyan-400', threshold: xp \};\s+\};/g;

const newGetTier = `const getTier = (xp: number) => {
    const b = globalSettings.bronzeLimit || 1000;
    const s = globalSettings.silverLimit || 5000;
    const g = globalSettings.goldLimit || 10000;
    if (xp < b) return { name: 'Bronze', color: 'text-orange-400', threshold: b };
    if (xp < s) return { name: 'Silver', color: 'text-gray-300', threshold: s };
    if (xp < g) return { name: 'Gold', color: 'text-yellow-400', threshold: g };
    return { name: 'Diamond', color: 'text-cyan-400', threshold: xp };
  };`;

appText = appText.replace(getTierRegex, newGetTier);


// Fix Translations profile "الملف الشخصي والولاء"
appText = appText.replace(/\{t\[language\]\.profileLoyalty\}/g, '{t[language].profileMenu}');


fs.writeFileSync('src/App.tsx', appText);

let transText = fs.readFileSync('src/translations.ts', 'utf-8');
transText = transText.replace(/profOverview: "نظرة عامة على الملف",/g, 'profOverview: "نظرة عامة على الملف الشخصي",');
fs.writeFileSync('src/translations.ts', transText);

