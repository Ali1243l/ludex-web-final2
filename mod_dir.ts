import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

text = text.replace(
  '<div className="min-h-screen h-screen bg-[#050505] text-[#F3F4F6] font-sans flex flex-col overflow-hidden relative select-none">',
  '<div dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen h-screen bg-[#050505] text-[#F3F4F6] font-sans flex flex-col overflow-hidden relative select-none">'
);

fs.writeFileSync('src/App.tsx', text);
