import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const search = `                      <button
                        onClick={() => setAdminTab("categories")}
                        className={\`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all \${adminTab === "categories" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:bg-white/5 hover:text-white"}\`}
                      >
                        <Layers className="w-4 h-4" />
                        {t[language].adminCats}
                      </button>
                    </div>
                  )}`;
const replace = `                      <button
                        onClick={() => setAdminTab("categories")}
                        className={\`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all \${adminTab === "categories" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:bg-white/5 hover:text-white"}\`}
                      >
                        <Layers className="w-4 h-4" />
                        {t[language].adminCats}
                      </button>
                    </motion.div>
                  )}
                  </AnimatePresence>`;
content = content.replace(search, replace);

const salesSearch = `{adminMenuState.sales && (
                    <div className="pl-6 flex flex-col gap-1">`;
const salesReplace = `<AnimatePresence>
                  {adminMenuState.sales && (
                    <motion.div 
                      key="sales"
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3 }}
                      className="ltr:pl-6 rtl:pr-6 flex flex-col gap-1"
                    >`;
content = content.replace(salesSearch, salesReplace);

const salesEndSearch = `                      <button
                        onClick={() => setAdminTab("promotions")}
                        className={\`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all \${adminTab === "promotions" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:bg-white/5 hover:text-white"}\`}
                      >
                        <Star className="w-4 h-4" />
                        {t[language].adminPromos}
                      </button>
                      <button
                        onClick={() => setAdminTab("promo_codes")}
                        className={\`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all \${adminTab === "promo_codes" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:bg-white/5 hover:text-white"}\`}
                      >
                        <Ticket className="w-4 h-4" />
                        {t[language].promoCodesTitle}
                      </button>
                    </div>
                  )}`;
const salesEndReplace = `                      <button
                        onClick={() => setAdminTab("promotions")}
                        className={\`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all \${adminTab === "promotions" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:bg-white/5 hover:text-white"}\`}
                      >
                        <Star className="w-4 h-4" />
                        {t[language].adminPromos}
                      </button>
                      <button
                        onClick={() => setAdminTab("promo_codes")}
                        className={\`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all \${adminTab === "promo_codes" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:bg-white/5 hover:text-white"}\`}
                      >
                        <Ticket className="w-4 h-4" />
                        {t[language].promoCodesTitle}
                      </button>
                    </motion.div>
                  )}
                  </AnimatePresence>`;                  
content = content.replace(salesEndSearch, salesEndReplace);

const sysSearch = `{adminMenuState.system && (
                    <div className="pl-6 flex flex-col gap-1">`;
const sysReplace = `<AnimatePresence>
                  {adminMenuState.system && (
                    <motion.div 
                      key="system"
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3 }}
                      className="ltr:pl-6 rtl:pr-6 flex flex-col gap-1"
                    >`;
content = content.replace(sysSearch, sysReplace);

const sysEndSearch = `                      <button
                        onClick={() => setAdminTab("pages")}
                        className={\`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all \${adminTab === "pages" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:bg-white/5 hover:text-white"}\`}
                      >
                        <FileText className="w-4 h-4" />
                        {t[language].adminPages}
                      </button>
                    </div>
                  )}`;
const sysEndReplace = `                      <button
                        onClick={() => setAdminTab("pages")}
                        className={\`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all \${adminTab === "pages" ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:bg-white/5 hover:text-white"}\`}
                      >
                        <FileText className="w-4 h-4" />
                        {t[language].adminPages}
                      </button>
                    </motion.div>
                  )}
                  </AnimatePresence>`;
content = content.replace(sysEndSearch, sysEndReplace);
fs.writeFileSync('src/App.tsx', content);
