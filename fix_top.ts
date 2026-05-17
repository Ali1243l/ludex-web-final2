import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(/topVisited\.title/g, 'topVisited.name');
content = content.replace(/topVisited\.image/g, 'topVisited.coverImage');

content = content.replace(/topSelling\.title/g, 'topSelling.name');
content = content.replace(/topSelling\.image/g, 'topSelling.coverImage');

// Mobile banner fixes:
// Make banner shorter
content = content.replace(/h-\[26rem\] md:h-80/g, 'h-80 md:h-80');
// Reduce padding of text area
content = content.replace(/flex-1 p-8 md:p-12 flex flex-col/g, 'flex-1 p-6 md:p-12 flex flex-col');
content = content.replace(/text-3xl md:text-5xl font-black/g, 'text-2xl md:text-5xl font-black');

fs.writeFileSync('src/App.tsx', content);
