import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
const idx = content.lastIndexOf("  );\\n}");
console.log('last index of "  );\\n}": ', idx);
console.log('last index of "  );\\r\\n}": ', content.lastIndexOf("  );\\r\\n}"));
console.log('last index of "  );": ', content.lastIndexOf("  );"));
