import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Admin Sidebar
text = text.replace(
  'className="w-64 bg-[#0a0a0a] border-e border-purple-900/40 p-4 flex flex-col gap-2 relative z-20 overflow-y-auto custom-scrollbar"',
  'className="w-64 bg-[#0a0a0a] border-e border-purple-900/40 p-4 flex flex-col gap-2 relative z-20 overflow-y-auto custom-scrollbar flex-shrink-0 h-full"'
);

// User Dashboard Sidebar
text = text.replace(
  'className="w-64 border-e border-purple-900/20 bg-[#0a0a0a] flex flex-col hidden lg:flex shadow-[5px_0_15px_rgba(0,0,0,0.5)] z-10 relative overflow-y-auto custom-scrollbar"',
  'className="w-64 border-e border-purple-900/20 bg-[#0a0a0a] flex flex-col hidden lg:flex shadow-[5px_0_15px_rgba(0,0,0,0.5)] z-10 relative overflow-y-auto custom-scrollbar flex-shrink-0 h-full"'
);

// Store Categories Sidebar
text = text.replace(
  'className="w-64 border-e border-purple-900/20 bg-black/20 p-6 flex-col gap-8 hidden lg:flex"',
  'className="w-64 border-e border-purple-900/20 bg-black/20 p-6 flex-col gap-8 hidden lg:flex overflow-y-auto custom-scrollbar flex-shrink-0 h-full"'
);

fs.writeFileSync('src/App.tsx', text);
