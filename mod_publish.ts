import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `<td className="px-4 py-3 flex gap-2">
                                 <button onClick={() => setCrudModal({
                                    isOpen: true, mode: 'edit', table: 'products', item: item, fields: [`;

const replacementStr = `<td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                                 <button onClick={() => setPublishModal({isOpen: true, subscription: item as any, costPrice: String(item.costPrice || ''), sellingPrice: String(item.sellingPrice || ''), image: (item as any).image_url || '', type: item.type || 'Digital', category: item.category || 'Game'})} className="text-purple-400 hover:text-purple-300 text-[10px] uppercase font-black bg-purple-500/10 px-2 py-1 rounded border border-purple-500/30">Publish</button>
                                 <button onClick={() => setCrudModal({
                                    isOpen: true, mode: 'edit', table: 'products', item: item, fields: [`;

if (text.includes(targetStr)) {
  text = text.replace(targetStr, replacementStr);
}

// Ensure the "Publish" modal reads `subscription.name` safely:
text = text.replace(
  /title: publishModal\.subscription\?\.name \|\| 'Unknown',/g,
  "title: publishModal.subscription?.name || publishModal.subscription?.title || 'Unknown',"
);

text = text.replace(
  /supplier: publishModal\.subscription\?\.account_username \|\| 'Local',/g,
  "supplier: publishModal.subscription?.supplier || publishModal.subscription?.account_username || 'Local',"
);


fs.writeFileSync('src/App.tsx', text);
console.log("Publish button added to Products");
