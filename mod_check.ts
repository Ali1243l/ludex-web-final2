import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
console.log(content.slice(-500));
