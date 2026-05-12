import fs from 'fs';
let transText = fs.readFileSync('src/translations.ts', 'utf-8');

const enInsert = `
    publishItemTitle: "Publish Item", publishSubtitle: "You are about to publish the following item to the storefront:",
    costPriceOpt: "Cost Price (Optional)", sellPriceRequired: "Selling Price (Required)",
    catSelect: "Store Category", typeRegInput: "Type / Region", coverImgOpt: "Cover Image URL",
    cancelText: "Cancel", confirmPub: "Publish Now", placeholder0: "e.g. 10.00",
    placeholderReg: "e.g. Global, TR",
`;

const arInsert = `
    publishItemTitle: "نشر في المتجر", publishSubtitle: "أنت على وشك نشر العنصر التالي في المتجر:",
    costPriceOpt: "سعر التكلفة (اختياري)", sellPriceRequired: "سعر البيع للجمهور (مطلوب)",
    catSelect: "تصنيف المتجر", typeRegInput: "النوع / المنطقة", coverImgOpt: "رابط الغلاف (اختياري)",
    cancelText: "إلغاء", confirmPub: "تأكيد النشر", placeholder0: "مثال: 10.00",
    placeholderReg: "مثال: عالمي، تركيا",
`;

transText = transText.replace('placeholderReg: "e.g. Global, TR",', ''); // cleanup if exists
transText = transText.replace('placeholderReg: "مثال: عالمي، تركيا",', '');

transText = transText.replace('addNewAccount: "Add New Account",', 'addNewAccount: "Add New Account",\n' + enInsert);
transText = transText.replace('addNewAccount: "إضافة حساب جديد",', 'addNewAccount: "إضافة حساب جديد",\n' + arInsert);

fs.writeFileSync('src/translations.ts', transText);

let appText = fs.readFileSync('src/App.tsx', 'utf-8');

const oldModalStart = appText.indexOf('{/* Publish Modal */}');

// The regex will stop exactly where the publishModal block ends
const regex = /{\/\* Publish Modal \*\/}[\s\S]*?\{publishModal\.isOpen && \([\s\S]*?<\/form>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)}\n?/;

const newModal = `{/* Publish Modal */}
      {publishModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setPublishModal({...publishModal, isOpen: false})}></div>
          <div className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] border border-purple-900/50 rounded-2xl w-full max-w-lg p-8 relative shadow-[0_0_80px_rgba(147,51,234,0.3)] animate-in zoom-in-95 duration-300" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            
            <div className="absolute top-0 right-0 w-full h-full bg-purple-600/5 rounded-2xl pointer-events-none"></div>

            <div className="flex justify-between items-center mb-2 relative z-10">
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 uppercase tracking-widest flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-purple-500" />
                {t[language].publishItemTitle}
              </h3>
              <button type="button" onClick={() => setPublishModal({...publishModal, isOpen: false})} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-gray-400 hover:text-white hover:bg-purple-900/50 transition-colors border border-gray-800 hover:border-purple-500/50">✕</button>
            </div>
            
            <p className="text-xs text-gray-500 mb-4">{t[language].publishSubtitle}</p>
            <div className="mb-6 bg-black/80 p-4 rounded-xl border border-purple-900/30 flex items-center gap-3 relative z-10 shadow-inner">
               <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
               <p className="text-md text-white font-mono break-all line-clamp-2" dir="ltr">{publishModal.subscription?.name || publishModal.subscription?.title}</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const newGame = {
                 id: Math.max(...gamesList.map(g => g.id), 0) + 1,
                 title: publishModal.subscription?.name || publishModal.subscription?.title || 'Unknown',
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
                      'Authorization': \`Bearer \${localStorage.getItem('ludex_token')}\`
                   },
                   body: JSON.stringify({
                      name: newGame.title,
                      costPrice: parseFloat(publishModal.costPrice) || 0,
                      sellingPrice: newGame.price,
                      supplier: publishModal.subscription?.supplier || publishModal.subscription?.account_username || 'Local',
                      category: newGame.category,
                      type: newGame.type,
                      image_url: newGame.image
                   })
                });
              } catch (err) {}
              
              setPublishModal({...publishModal, isOpen: false});
              setToastMessage('Subscription published successfully!');
              setTimeout(() => setToastMessage(null), 3000);
            }} className="flex flex-col gap-4 relative z-10">
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 text-start">{t[language].costPriceOpt}</label>
                    <div className="relative">
                      <span className={"absolute top-1/2 -translate-y-1/2 text-purple-500 font-bold " + (language === 'ar' ? 'right-3' : 'left-3')}>$</span>
                      <input dir="ltr" type="number" step="0.01" value={publishModal.costPrice} onChange={e => setPublishModal({...publishModal, costPrice: e.target.value})} className={"w-full bg-[#111] border border-gray-800 rounded-xl py-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-all focus:bg-purple-900/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] " + (language === 'ar' ? 'pr-8 pl-3' : 'pl-8 pr-3')} placeholder={t[language].placeholder0} />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-2 text-start">{t[language].sellPriceRequired}</label>
                    <div className="relative">
                      <span className={"absolute top-1/2 -translate-y-1/2 text-purple-500 font-bold " + (language === 'ar' ? 'right-3' : 'left-3')}>$</span>
                      <input dir="ltr" type="number" step="0.01" required value={publishModal.sellingPrice} onChange={e => setPublishModal({...publishModal, sellingPrice: e.target.value})} className={"w-full bg-[#111] border border-gray-800 rounded-xl py-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-all focus:bg-purple-900/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] " + (language === 'ar' ? 'pr-8 pl-3' : 'pl-8 pr-3')} placeholder={t[language].placeholder0} />
                    </div>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 text-start">{t[language].catSelect}</label>
                    <select value={publishModal.category} onChange={e => setPublishModal({...publishModal, category: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-all focus:bg-purple-900/10 cursor-pointer">
                       <option value="PC Game Keys">PC Game Keys</option>
                       <option value="Console Subs">Console Subs</option>
                       <option value="In-game Currency">In-game Currency</option>
                       <option value="Software">Software</option>
                       <option value="Subscription">Subscription</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 text-start">{t[language].typeRegInput}</label>
                    <input dir="ltr" type="text" value={publishModal.type} onChange={e => setPublishModal({...publishModal, type: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 text-white text-start transition-all focus:bg-purple-900/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)]" placeholder={t[language].placeholderReg} />
                 </div>
               </div>

               <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 text-start">{t[language].coverImgOpt}</label>
                  <input dir="ltr" type="text" value={publishModal.image} onChange={e => setPublishModal({...publishModal, image: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 text-white text-start transition-all focus:bg-purple-900/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)]" placeholder={t[language].leaveEmpty} />
               </div>

               <div className="flex items-center gap-3 mt-6">
                 <button type="button" onClick={() => setPublishModal({...publishModal, isOpen: false})} className="flex-1 bg-black border border-gray-800 text-white py-3.5 rounded-xl hover:bg-gray-900 hover:border-gray-600 transition-all font-bold text-sm">
                   {t[language].cancelText}
                 </button>
                 <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3.5 rounded-xl hover:from-purple-500 hover:to-purple-700 transition-all font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                   {t[language].confirmPub}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
`;

appText = appText.replace(regex, newModal);
fs.writeFileSync('src/App.tsx', appText);
