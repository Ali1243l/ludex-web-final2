import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf-8');

text = text.replace(
  /\\\`https:\/\/api\.dicebear\.com\/7\.x\/avataaars\/svg\?seed=\\\\\$\{userProfile\.name\}&backgroundColor=4c1d95\\\`/g,
  "`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.name}&backgroundColor=4c1d95`"
);

text = text.replace(
  /\\\`https:\/\/api\.dicebear\.com/g,
  "`https://api.dicebear.com"
);

text = text.replace(
  /4c1d95\\\`/g,
  "4c1d95`"
);

fs.writeFileSync('src/App.tsx', text);
