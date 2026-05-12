import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix category display in Sidebar
const catTarget = `<cat.icon className="w-4 h-4 opacity-70" /> {cat.name}`;
const catRepl = `<cat.icon className="w-4 h-4 opacity-70" /> {cat.name === 'PC Game Keys' ? t[language].pcKeys : cat.name === 'Console Subs' ? t[language].consoleSubs : cat.name === 'In-game Currency' ? t[language].inGameCurrency : cat.name === 'Software' ? t[language].software : cat.name}`;
text = text.replace(new RegExp(catTarget.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), catRepl);

// Fix active category border for RTL
const borderTarget = `? 'text-purple-400 bg-purple-500/10 border-l-2 border-purple-500 font-bold' 
                        : 'text-gray-400 hover:text-purple-400 hover:bg-purple-900/10 border-l-2 border-transparent'`;
const borderRepl = `? 'text-purple-400 bg-purple-500/10 border-s-2 border-purple-500 font-bold' 
                        : 'text-gray-400 hover:text-purple-400 hover:bg-purple-900/10 border-s-2 border-transparent'`;
text = text.replace(borderTarget, borderRepl);

// Fix border right in Categories sidebar
const borderRightTarget = `<aside className="w-64 border-r border-purple-900/20 bg-black/20 p-6 flex-col gap-8 hidden lg:flex">`;
const borderRightRepl = `<aside className="w-64 border-e border-purple-900/20 bg-black/20 p-6 flex-col gap-8 hidden lg:flex">`;
text = text.replace(borderRightTarget, borderRightRepl);

// Fix search input padding & placement
const searchTarget = `<div className="absolute left-3 w-4 h-4 text-gray-500">`;
const searchRepl = `<div className="absolute start-3 w-4 h-4 text-gray-500">`;
text = text.replace(new RegExp(searchTarget.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), searchRepl);

const searchTarget2 = `<div className="absolute left-5 top-3 w-5 h-5 text-gray-500">`;
const searchRepl2 = `<div className="absolute start-5 top-3 w-5 h-5 text-gray-500">`;
text = text.replace(new RegExp(searchTarget2.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), searchRepl2);

const inputTarget = `className="bg-[#111] border border-purple-900/40 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 transition-colors focus:bg-purple-900/10 min-h-[44px]"`;
const inputRepl = `className="bg-[#111] border border-purple-900/40 rounded-full py-2 ps-10 pe-4 text-sm w-64 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 transition-colors focus:bg-purple-900/10 min-h-[44px]"`;
text = text.replace(new RegExp(inputTarget.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), inputRepl);

const inputTarget2 = `className="w-full bg-[#111] border border-purple-900/40 rounded-xl py-3 pl-12 pr-4 text-base focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 min-h-[50px] shadow-inner"`;
const inputRepl2 = `className="w-full bg-[#111] border border-purple-900/40 rounded-xl py-3 ps-12 pe-4 text-base focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 min-h-[50px] shadow-inner"`;
text = text.replace(new RegExp(inputTarget2.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), inputRepl2);


// Also fix Actions column being squeezed - ensuring horizontal scroll spacing is nice
// The table containers already have 'overflow-x-auto'. Let's ensure the left/right padding is sufficient.
const thTarget = `<th className="px-6 py-4">`;
const thRepl = `<th className="px-6 py-4 whitespace-nowrap">`;
text = text.replace(new RegExp(thTarget.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), thRepl);

fs.writeFileSync('src/App.tsx', text);
console.log("RTL details fixed");
