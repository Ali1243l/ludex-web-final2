import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('التقييمات والتعليقات'));
const endIdx = lines.findIndex(l => l.includes('ludex-hq-portal</p>')) - 2;

if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
   let extracted = lines.slice(startIdx, endIdx + 1).join('\n');
   
   lines.splice(startIdx, (endIdx + 1) - startIdx);
   content = lines.join('\n');
   
   const closingDivIndex = content.lastIndexOf('</div>\n  );\n}');
   
   if (closingDivIndex !== -1) {
       content = content.slice(0, closingDivIndex) + extracted + '\n' + content.slice(closingDivIndex);
       fs.writeFileSync('src/App.tsx', content);
       console.log('Successfully stitched the rest of the modals!');
   } else {
       console.log('closing div not found');
   }
} else {
   console.log('Indexes not found', startIdx, endIdx);
}
