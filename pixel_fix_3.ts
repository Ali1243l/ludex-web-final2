import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Safeguard against undefined arrays in input value.
text = text.replace(
  /value=\{userProfile\.favoriteGenres\.join\(/g,
  'value={(userProfile.favoriteGenres || []).join('
);

// We should also look at other properties that may break if undefined.
text = text.replace(
  /value=\{userProfile\.platformPreference\}/g,
  'value={userProfile.platformPreference || "PC"}'
);

text = text.replace(
  /checked=\{userProfile\.emailNotifications\}/g,
  'checked={userProfile.emailNotifications || false}'
);

text = text.replace(
  /checked=\{userProfile\.twoFactorEnabled\}/g,
  'checked={userProfile.twoFactorEnabled || false}'
);


fs.writeFileSync('src/App.tsx', text);
