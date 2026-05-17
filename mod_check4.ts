import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
const search = "setIsChatOpen(!isChatOpen)";
const idx = content.lastIndexOf(search);
console.log(content.slice(idx - 100, idx + 100));
