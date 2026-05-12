import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /<td className="px-4 py-3 flex gap-2">\s*<button onClick=\{\(\) => setCrudModal\(\{\s*isOpen: true, mode: 'edit', table: 'products', item: item/g;
text = text.replace(regex, `<td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                                 <button onClick={() => setPublishModal({isOpen: true, subscription: item as any, costPrice: String(item.costPrice || ''), sellingPrice: String(item.sellingPrice || ''), image: (item as any).image_url || '', type: item.type || 'Digital', category: item.category || 'Game'})} className="text-purple-400 hover:text-purple-300 text-[10px] uppercase font-black bg-purple-500/10 px-2 py-1 rounded border border-purple-500/30">Publish</button>
                                 <button onClick={() => setCrudModal({
                                    isOpen: true, mode: 'edit', table: 'products', item: item`);

fs.writeFileSync('src/App.tsx', text);
console.log("Replaced with regex");
