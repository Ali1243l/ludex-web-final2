import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\\n');

// Find where the file naturally ends: "  );" "}" ""
let endIdx = lines.findIndex(l => l === "}");
if (endIdx > -1) {
  lines.splice(endIdx + 1);
  fs.writeFileSync('src/App.tsx', lines.join('\\n') + '\\n', 'utf-8');
  console.log('Fixed garbage at end! endIdx was ' + endIdx);
} else {
  console.log('Could not find }');
}
