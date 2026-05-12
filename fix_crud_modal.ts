import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

// Find the generic CRUD modal start
const crudStart = lines.findIndex(l => l.includes('{/* Generic CRUD Modal */}'));
// Find the generic CRUD modal end (it's the first )} after it)
let crudEnd = crudStart;
while (crudEnd < lines.length) {
  if (lines[crudEnd].trim() === ')}' && lines[crudEnd - 1].includes('</div>')) {
     break;
  }
  crudEnd++;
}

// Same for promoModal
const promoStart = lines.findIndex(l => l.includes('{/* Game Detail Modal */}'));
let promoEnd = promoStart;
while (promoEnd < lines.length) {
  if (lines[promoEnd].trim() === ')}' && lines[promoEnd - 1].includes('</div>')) {
     break;
  }
  promoEnd++;
}

console.log(`crud: ${crudStart}-${crudEnd}`);
console.log(`promo: ${promoStart}-${promoEnd}`);

// Ensure we got them correctly
if (crudStart !== -1 && promoStart !== -1) {
   let minStart = Math.min(crudStart, promoStart);
   let maxEnd = Math.max(crudEnd, promoEnd) + 1; // Include the `)}`
   
   let extracted = lines.slice(minStart, maxEnd).join('\n');
   lines.splice(minStart, maxEnd - minStart);
   content = lines.join('\n');
   
   const closingDivIndex = content.lastIndexOf('</div>\n  );\n}');
   if (closingDivIndex !== -1) {
       content = content.slice(0, closingDivIndex) + extracted + '\n' + content.slice(closingDivIndex);
       fs.writeFileSync('src/App.tsx', content);
       console.log('Fixed modals!');
   } else {
       console.log('Could not find closing div');
   }
} else {
   console.log('Could not find modals');
}
