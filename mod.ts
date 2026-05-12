import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `          {/* Generic CRUD Modal */}`;
const injection = `          {/* Publish Modal */}
      {publishModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111] border border-purple-900/30 rounded-xl w-full max-w-md p-6 relative shadow-[0_0_40px_rgba(168,85,247,0.15)]">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">Publish to Storefront</h3>
            <p className="text-sm text-gray-400 mb-4 font-mono break-all bg-black p-2 rounded">{publishModal.subscription?.name}</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const newGame = {
                 id: Math.max(...gamesList.map(g => g.id), 0) + 1,
                 title: publishModal.subscription?.name || 'Unknown',
                 price: parseFloat(publishModal.sellingPrice),
                 category: publishModal.category,
                 type: publishModal.type,
                 image: publishModal.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
                 stock: 1,
                 rating: 5.0,
                 description: "Account published from admin dashboard."
              };
              setGamesList([...gamesList, newGame]);
              
              try {
                await fetch('/api/admin/products', {
                   method: 'POST',
                   headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': \`Bearer \$\{localStorage.getItem('ludex_token')\}\`
                   },
                   body: JSON.stringify({
                      name: newGame.title,
                      costPrice: parseFloat(publishModal.costPrice) || 0,
                      sellingPrice: newGame.price,
                      supplier: publishModal.subscription?.account_username || 'Local',
                      category: newGame.category,
                      type: newGame.type,
                      image_url: newGame.image
                   })
                });
              } catch (err) {}
              
              setPublishModal({...publishModal, isOpen: false});
              setToastMessage('Subscription published successfully!');
              setTimeout(() => setToastMessage(null), 3000);
            }} className="flex flex-col gap-4">
               <div>
                  <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Cost Price (Optional)</label>
                  <input type="number" step="0.01" value={publishModal.costPrice} onChange={e => setPublishModal({...publishModal, costPrice: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500" placeholder="e.g. 10.00" />
               </div>
               <div>
                  <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Selling Price (Public)</label>
                  <input type="number" step="0.01" required value={publishModal.sellingPrice} onChange={e => setPublishModal({...publishModal, sellingPrice: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500" placeholder="e.g. 15.00" />
               </div>
               <div>
                  <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Store Category</label>
                  <select value={publishModal.category} onChange={e => setPublishModal({...publishModal, category: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500">
                     <option value="PC Game Keys">PC Game Keys</option>
                     <option value="Console Subs">Console Subs</option>
                     <option value="In-game Currency">In-game Currency</option>
                     <option value="Software">Software</option>
                     <option value="Subscription">Subscription</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Type/Region Tag</label>
                  <input type="text" value={publishModal.type} onChange={e => setPublishModal({...publishModal, type: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500" placeholder="Global, TR, USA..." />
               </div>
               <div>
                  <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Cover Image URL</label>
                  <input type="text" value={publishModal.image} onChange={e => setPublishModal({...publishModal, image: e.target.value})} className="w-full bg-black border border-gray-800 rounded p-2 text-white outline-none focus:border-purple-500" placeholder="Leave empty for default" />
               </div>
               <div className="flex gap-2 justify-end mt-4">
                 <button type="button" onClick={() => setPublishModal({...publishModal, isOpen: false})} className="px-4 py-2 text-gray-400 font-bold text-sm hover:text-white">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded">Publish Item</button>
               </div>
            </form>
          </div>
        </div>
      )}

          {/* Generic CRUD Modal */}`;

text = text.replace(targetStr, injection);
fs.writeFileSync('src/App.tsx', text);
console.log('Injected modal');
