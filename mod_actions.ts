import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix Actions column styling so it stays on one line
const actTarget1 = `<td className="px-4 py-3 flex gap-2">
                                 <button onClick={() => setCrudModal({`;
const actRepl1 = `<td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                                 <button onClick={() => setCrudModal({`;
text = text.replace(new RegExp(actTarget1.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), actRepl1);

// Look for mark sold
const markTarget = `<button onClick={() => handleQuickUpdate('subscriptions', item.id, { ...item, status: 'sold', account_password: 'MASKED' }`;
const markRepl = `<button title="Mark Sold" onClick={() => handleQuickUpdate('subscriptions', item.id, { ...item, status: 'sold', account_password: 'MASKED' }`;
text = text.replace(new RegExp(markTarget.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'), 'g'), markRepl);

fs.writeFileSync('src/App.tsx', text);
console.log("Actions modified");
