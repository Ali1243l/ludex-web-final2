import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Find the last actual component closing
let idx = content.lastIndexOf("  );\\n}");
if (idx === -1) {
    idx = content.lastIndexOf("  );\\n\\n}");
}
if (idx > -1) {
  content = content.slice(0, idx + 6); // "  );\n}"
  fs.writeFileSync('src/App.tsx', content, 'utf-8');
  console.log('Fixed garbage string');
} else {
  console.log('Could not find ');
}
