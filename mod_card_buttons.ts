import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

text = text.replace(
  'className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all active:scale-95 shadow-[0_4px_10px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_15px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"',
  'className="bg-white text-black text-[10px] sm:text-xs font-bold px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg hover:bg-gray-200 transition-all active:scale-95 shadow-[0_4px_10px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_15px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap"'
);

// Also let's tighten the padding on mobile for product cards
text = text.replace(
  'div className="p-5 flex-1 flex flex-col justify-between items-stretch"',
  'div className="p-3 sm:p-5 flex-1 flex flex-col justify-between items-stretch"'
);

fs.writeFileSync('src/App.tsx', text);
