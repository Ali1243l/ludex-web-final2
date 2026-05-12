import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix Subscriptions Table
const subTarget = `<td className="px-4 py-3 font-mono text-xs">{item.id}</td>`;
const subRepl = `<td title={item.id} className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{String(item.id).substring(0, 8)}...</td>`;
text = text.replace(new RegExp(subTarget.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), subRepl);

// Also make Subscriptions Name LTR so English text truncation isn't weird if it wraps
const subNameTarget = `<td className="px-4 py-3 font-bold text-white">{item.name}</td>`;
const subNameRepl = `<td className="px-4 py-3 font-bold text-white" dir="ltr">{item.name}</td>`;
text = text.replace(new RegExp(subNameTarget.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), subNameRepl);

// Fix Products Table
const prodTarget = `<td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                               <td className="px-4 py-3 font-bold text-white max-w-[120px] truncate">{item.name}</td>`;
const prodRepl = `<td title={item.id} className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{String(item.id).substring(0, 8)}...</td>
                               <td className="px-4 py-3 font-bold text-white" dir="ltr">{item.name}</td>`;
text = text.replace(new RegExp(prodTarget.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), prodRepl);

// Inject fetched Products into Storefront GamesList
const fetchTarget = `        if (res.ok) setPublicProducts(await res.json());`;
const fetchRepl = `        if (res.ok) {
           const dbProducts = await res.json();
           setPublicProducts(dbProducts);
           const mappedDb = dbProducts.map((p: any) => ({
              id: p.id,
              title: p.name,
              category: p.category,
              type: p.type || 'Digital',
              originalPrice: null,
              price: Number(p.sellingPrice) || 0,
              stock: 99,
              rating: 5,
              image: p.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
              description: \`Storefront item for \$\{p.name\}\`,
              active: true
           }));
           // Avoid injecting duplicates into gamesList if they already exist (e.g. by name/id)
           setGamesList(prev => {
              const base = Object.keys(prev).length && prev[0].title ? prev : GAMES_DATA.map(g => ({...g, active: true}));
              // filter out any previously dynamically added items (we'll just append to GAMES_DATA)
              return [...GAMES_DATA.map(g => ({...g, active: true})), ...mappedDb];
           });
        }`;
text = text.replace(new RegExp(fetchTarget.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), fetchRepl);

fs.writeFileSync('src/App.tsx', text);
console.log("Modifications applied");
