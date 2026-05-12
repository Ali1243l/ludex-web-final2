import * as fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

const startIndex = lines.findIndex(l => l.includes('{/* Generic CRUD Modal */}'));
const endIndex = lines.findIndex(l => l.includes('{/* Bottom Bar Info */}'));

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  const modalsChunk = lines.slice(startIndex, endIndex);
  
  lines.splice(startIndex, endIndex - startIndex);
  
  const appEndIndex = lines.findLastIndex(l => l.trim() === '</div>' && lines[l+1]?.trim() === ');');
  
  if (appEndIndex !== -1) {
    lines.splice(appEndIndex, 0, ...modalsChunk);
    
    const idx = lines.findIndex(l => l.includes('LUDEX HQ'));
    if (idx !== -1 && !lines[idx+1].includes('</h3>')) {
      lines[idx] = lines[idx] + '\n              </h3>\n            </div>';
    }
    
    fs.writeFileSync('src/App.tsx', lines.join('\n'));
    console.log('Fixed modals and HTML structure!');
  } else {
    console.log('App end not found');
  }
}
