import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
const idx = content.lastIndexOf("  );");
console.log(content.slice(idx, idx + 50));
