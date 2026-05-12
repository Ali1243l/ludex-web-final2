import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regexDuplicate = /  const handleOpenGameDetail = \(id: number \| string\) => \{\s+setSelectedGameId\(id\);\s+setIsGameDetailOpen\(true\);\s+setGamesList\(prev => prev.map\(g => g\.id === id \? \{\.\.\.g, views_count: \(typeof g\.views_count === 'number' \? g\.views_count : 0\) \+ 1\} : g\)\);\s+\};\s+/g;

const matches = content.match(regexDuplicate);
if (matches && matches.length > 1) {
    // Keep only the first occurrence
    let i = 0;
    content = content.replace(regexDuplicate, (match) => {
        i++;
        return i === 1 ? match : '';
    });
}
fs.writeFileSync('src/App.tsx', content);

