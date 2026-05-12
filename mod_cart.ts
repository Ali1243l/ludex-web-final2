import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix cart state typing
text = text.replace(/const \[cart, setCart\] = useState<number\[\]>\(\[\]\);/g, 'const [cart, setCart] = useState<(number | string)[]>([ ]);');

// Fix selectedGameId
text = text.replace(/const \[selectedGameId, setSelectedGameId\] = useState<number \| null>\(null\);/g, 'const [selectedGameId, setSelectedGameId] = useState<number | string | null>(null);');

// Fix addToCart definition
text = text.replace(/const addToCart = \(id: number\) => \{/g, 'const addToCart = (id: number | string) => {');

// Fix the line where we called addToCart(item as any)
const badAddToCartTarget = `addToCart(item as any);`;
const badAddToCartRepl = `addToCart(product.id);`;
text = text.replace(new RegExp(badAddToCartTarget.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), badAddToCartRepl);

fs.writeFileSync('src/App.tsx', text);
console.log("Cart fixes applied");
