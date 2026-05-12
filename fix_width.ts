import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');
text = text.replace(/max-w-6xl mx-auto/g, 'max-w-[98%] 2xl:max-w-[1600px] w-full mx-auto');
text = text.replace(/max-w-4xl mx-auto/g, 'max-w-[95%] 2xl:max-w-[1400px] w-full mx-auto');

fs.writeFileSync('src/App.tsx', text);
console.log("widths fixed");
