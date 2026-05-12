import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement = `
              {/* Mobile Categories Slider */}
              <div className="lg:hidden w-full overflow-x-auto pb-4 mb-4 flex gap-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-purple-900/50">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className={\`flex-none snap-start px-5 py-2 rounded-full border text-sm font-bold whitespace-nowrap transition-all \${!activeCategory ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-[#111] border-gray-800 text-gray-400 hover:text-white'}\`}
                >
                  {t[language].allGames || 'All Games'}
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
                    className={\`flex-none snap-start px-5 py-2 rounded-full border text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all \${activeCategory === cat.name ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-[#111] border-gray-800 text-gray-400 hover:text-white'}\`}
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
`;

// Replace lines 2428 to 2432 with the new content
text = text.replace(
  `              <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
                <div>
                  <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] leading-snug md:leading-tight font-bold tracking-tight">{t[language].discover} <span className="text-purple-500">{t[language].worlds}</span></h1>
                  <p className="text-gray-500 text-sm mt-1">{t[language].desc}</p>
                </div>`,
  replacement
);

fs.writeFileSync('src/App.tsx', text);
