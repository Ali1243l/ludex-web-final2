import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Find start
const startIndex = content.indexOf("{adminTab === 'customers' && (");
// Find end - it closes with           )} just before {adminTab === 'users' && (
const matchNext = "{adminTab === 'users' && (";
const endIndex = content.indexOf(matchNext, startIndex);

if (startIndex > -1 && endIndex > -1) {
  content = content.slice(0, startIndex) + content.slice(endIndex);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Removed customers tab section.");
} else {
  console.log("Could not find boundaries.");
}
