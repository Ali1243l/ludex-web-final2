import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
const idx = content.lastIndexOf("  );");
content = content.slice(0, idx + 6); // "  );\n}\n"
fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Fixed!');
