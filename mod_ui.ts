import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix Sort Select options
text = text.replace(
  /<option value="price_low">Price: Low to High<\/option>/g,
  '<option value="price_low" className="text-gray-200 bg-[#111]">{t[language].priceLow}</option>'
);

text = text.replace(
  /<option value="price_high">Price: High to Low<\/option>/g,
  '<option value="price_high" className="text-gray-200 bg-[#111]">{t[language].priceHigh}</option>'
);

text = text.replace(
  /<option value="newest">\{t\[language\].sort \|\| 'Newest'\}<\/option>/g,
  '<option value="newest" className="text-gray-200 bg-[#111]">{t[language].newest}</option>'
);

// Fix the styling for select itself
text = text.replace(
  /className="px-4 py-2 text-sm border bg-\[#0a0a0a\] border-purple-900\/50 hover:bg-purple-900\/20 transition-colors rounded-lg text-gray-300 focus:outline-none w-full md:w-auto min-h-\[44px\]"/g,
  'className="px-4 py-2 text-sm border bg-[#0a0a0a] border-purple-900/50 hover:bg-purple-900/20 transition-colors rounded-lg text-gray-300 focus:outline-none w-full md:w-auto min-h-[44px] cursor-pointer"'
);

// Fix the Publish Modal
const publishTarget = `<div className="bg-[#111] border border-purple-900/30 rounded-xl w-full max-w-md p-6 relative shadow-[0_0_40px_rgba(168,85,247,0.15)]">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">Publish to Storefront</h3>
            <p className="text-sm text-gray-400 mb-4 font-mono break-all bg-black p-2 rounded">{publishModal.subscription?.name}</p>
            <form onSubmit={async (e) => {`;

const publishRepl = `<div className="bg-[#111] border border-purple-900/30 rounded-xl w-full max-w-md p-6 relative shadow-[0_0_40px_rgba(168,85,247,0.15)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">{t[language].publishToStore}</h3>
            <p className="text-sm text-gray-400 mb-4 font-mono break-all bg-black p-2 rounded" dir="ltr">{publishModal.subscription?.name || publishModal.subscription?.title}</p>
            <form onSubmit={async (e) => {`;

text = text.replace(publishTarget, publishRepl);

// Fix inputs inside Publish Modal
const cpTarget = `<label className="block text-xs uppercase text-gray-500 font-bold mb-1">Cost Price (Optional)</label>
                  <input type="number" step="0.01" value={publishModal.costPrice} onChange={e => setPublishModal({...publishModal, costPrice: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500" placeholder="e.g. 10.00" />`;

const cpRepl = `<label className="block text-xs uppercase text-gray-500 font-bold mb-1 text-start">{t[language].costPrice}</label>
                  <input dir="ltr" type="number" step="0.01" value={publishModal.costPrice} onChange={e => setPublishModal({...publishModal, costPrice: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500 text-start" placeholder="e.g. 10.00" />`;
text = text.replace(cpTarget, cpRepl);

const spTarget = `<label className="block text-xs uppercase text-gray-500 font-bold mb-1">Selling Price (Public)</label>
                  <input type="number" step="0.01" required value={publishModal.sellingPrice} onChange={e => setPublishModal({...publishModal, sellingPrice: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500" placeholder="e.g. 15.00" />`;

const spRepl = `<label className="block text-xs uppercase text-gray-500 font-bold mb-1 text-start">{t[language].sellingPrice}</label>
                  <input dir="ltr" type="number" step="0.01" required value={publishModal.sellingPrice} onChange={e => setPublishModal({...publishModal, sellingPrice: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500 text-start" placeholder="e.g. 15.00" />`;
text = text.replace(spTarget, spRepl);

const scTarget = `<label className="block text-xs uppercase text-gray-500 font-bold mb-1">Store Category</label>
                  <select value={publishModal.category} onChange={e => setPublishModal({...publishModal, category: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500">`;

const scRepl = `<label className="block text-xs uppercase text-gray-500 font-bold mb-1 text-start">{t[language].storeCategory}</label>
                  <select value={publishModal.category} onChange={e => setPublishModal({...publishModal, category: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500 text-start">`;
text = text.replace(scTarget, scRepl);

const trTarget = `<label className="block text-xs uppercase text-gray-500 font-bold mb-1">Type/Region Tag</label>
                  <input type="text" value={publishModal.type} onChange={e => setPublishModal({...publishModal, type: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500" placeholder="Global, TR, USA..." />`;
                  
const trRepl = `<label className="block text-xs uppercase text-gray-500 font-bold mb-1 text-start">{t[language].typeRegion}</label>
                  <input dir="ltr" type="text" value={publishModal.type} onChange={e => setPublishModal({...publishModal, type: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500 text-start" placeholder="Global, TR, USA" />`;
text = text.replace(trTarget, trRepl);

const ciTarget = `<label className="block text-xs uppercase text-gray-500 font-bold mb-1">Cover Image URL</label>
                  <input type="text" value={publishModal.image} onChange={e => setPublishModal({...publishModal, image: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500" placeholder="Leave empty for default" />`;
                  
const ciRepl = `<label className="block text-xs uppercase text-gray-500 font-bold mb-1 text-start">{t[language].coverImage}</label>
                  <input dir="ltr" type="text" value={publishModal.image} onChange={e => setPublishModal({...publishModal, image: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500 text-start" placeholder={t[language].leaveEmpty} />`;
text = text.replace(ciTarget, ciRepl);

const btnTarget = `<div className="flex gap-2 justify-end mt-4">
                 <button type="button" onClick={() => setPublishModal({...publishModal, isOpen: false})} className="px-4 py-2 text-gray-400 font-bold text-sm hover:text-white">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded">Publish Item</button>`;

const btnRepl = `<div className="flex gap-2 justify-end mt-4">
                 <button type="button" onClick={() => setPublishModal({...publishModal, isOpen: false})} className="px-4 py-2 text-gray-400 font-bold text-sm hover:text-white">{t[language].cancel}</button>
                 <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded">{t[language].publishItem}</button>`;
text = text.replace(btnTarget, btnRepl);

fs.writeFileSync('src/App.tsx', text);
console.log("App UI updated");
