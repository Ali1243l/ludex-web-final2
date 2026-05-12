import * as fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

const startIndex = lines.findIndex(l => l.includes('{/* Generic CRUD Modal */}'));
const endIndex = lines.findIndex(l => l.includes('{/* Bottom Bar Info */}'));

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  const modalsChunk = lines.slice(startIndex, endIndex);
  
  // Find </>\n    )}
  let targetIndex = lines.findIndex((l, i) => l.trim() === '</>' && lines[i+1] && lines[i+1].trim() === ')}');
  
  if (targetIndex !== -1) {
    // Remove the chunk from its original place
    lines.splice(startIndex, endIndex - startIndex);
    
    // Recalculate targetIndex after removal
    targetIndex -= (endIndex - startIndex);
    
    // Insert after )}
    lines.splice(targetIndex + 2, 0, ...modalsChunk);
    
    fs.writeFileSync('src/App.tsx', lines.join('\n'));
    console.log('Successfully moved modals!');
  } else {
    console.log('Target index not found');
  }
} else {
  console.log('Start or end index not found');
}
