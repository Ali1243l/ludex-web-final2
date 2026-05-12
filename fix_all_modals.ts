import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('{isGameDetailOpen'));
const endIdx = lines.findIndex(l => l.includes('</h3>')) - 1; // line before </h3>

if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
   let extracted = lines.slice(startIdx - 1, endIdx + 1).join('\n'); // Include empty line before startIdx
   
   lines.splice(startIdx - 1, (endIdx + 1) - (startIdx - 1));
   content = lines.join('\n');
   
   const closingDivIndex = content.lastIndexOf('</div>\n  );\n}');
   
   if (closingDivIndex !== -1) {
       content = content.slice(0, closingDivIndex) + extracted + '\n' + content.slice(closingDivIndex);
       fs.writeFileSync('src/App.tsx', content);
       console.log('Successfully fixed all remaining nested modals!');
   } else {
       console.log('closing div not found');
   }
} else {
   console.log('Indexes not found', startIdx, endIdx);
}
