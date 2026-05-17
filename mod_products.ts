import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStartIndex = content.indexOf('filteredGames.slice(0, visibleGamesCount).map((game, index) => (');
if (targetStartIndex !== -1) {
    const endMatch = '</div>\n                    </div>\n                  ))\n                )}';
    const targetEndIndex = content.indexOf(endMatch, targetStartIndex) + endMatch.length;
    
    const originalBlock = content.substring(targetStartIndex, targetEndIndex);

    const newBlock = `filteredGames.slice(0, visibleGamesCount).map((game, index) => (
                    <motion.div 
                      key={game.id} 
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="group bg-[#0a0a0c] border border-white/5 hover:border-purple-500/30 rounded-xl sm:rounded-2xl flex flex-col h-full transition-shadow duration-300 hover:shadow-[0_15px_40px_rgba(168,85,247,0.2)] relative overflow-hidden cursor-pointer" 
                      onClick={() => handleOpenGameDetail(game.id)} 
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-[#111116] border-b border-white/5">
                        <motion.img 
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          src={game.image} 
                          alt={game.title} 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100" 
                          loading="lazy" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/40 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="absolute top-2 start-2 end-2 flex items-start justify-between">
                           <div className={\`bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider border \${game.badgeColor} shadow-lg\`}>
                             {game.type}
                           </div>
                           {game.originalPrice && (
                             <span className="bg-red-600/90 text-white px-2 py-1 rounded text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg line-through decoration-red-400/50">
                               {displayPrice(game.originalPrice)}
                             </span>
                           )}
                        </div>
                        
                        <div className="absolute bottom-2 start-2 end-2 flex flex-wrap gap-1 items-center justify-between pointer-events-none">
                           <div className="bg-black/70 backdrop-blur-lg border border-white/10 rounded-lg px-2 py-1.5 flex items-center gap-1.5 shadow-xl">
                             {game.category.includes('Console') || game.type.includes('PS5') || game.type.includes('Xbox') || game.type.includes('Nintendo') ? <Gamepad2 className="w-3 h-3 text-purple-400" /> : <Monitor className="w-3 h-3 text-purple-400" />}
                             <span className="text-[9px] sm:text-[10px] font-bold text-gray-200 uppercase tracking-widest">{game.platform || 'DIGITAL'}</span>
                           </div>
                           {(!game.stock || game.stock === 0) && (
                              <div className="bg-red-500/90 backdrop-blur-md px-2 py-1 rounded-lg border border-red-500/50 shadow-sm">
                                <span className="text-[9px] sm:text-[10px] text-white font-bold uppercase tracking-wider">{t[language].outOfStock}</span>
                              </div>
                           )}
                        </div>
                      </div>
                      
                      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between z-10 relative bg-gradient-to-b from-[#0a0a0c] to-[#0d0d12]">
                        <h4 className="font-bold text-[13px] sm:text-[15px] leading-snug text-gray-100 group-hover:text-purple-400 transition-colors line-clamp-2 mb-3" dir="auto">{game.title}</h4>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                             {game.originalPrice ? (
                                <>
                                  <span className="text-[12px] text-green-400 font-bold tracking-wider uppercase mb-0.5" dir="ltr">Save {Math.round((1 - game.price/game.originalPrice)*100)}%</span>
                                  <span className="text-base sm:text-lg font-black text-white font-mono leading-none drop-shadow-md">{displayPrice(game.price)}</span>
                                </>
                             ) : (
                                <span className="text-base sm:text-lg font-black text-white font-mono leading-none mt-1 drop-shadow-md">{displayPrice(game.price)}</span>
                             )}
                          </div>
                          
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            className="bg-white/5 hover:bg-purple-600 border border-white/10 group-hover:border-purple-500/50 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] z-20"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(game.id);
                            }}
                            title={t[language].addToCart || 'Add to Cart'}
                          >
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}`;

    content = content.replace(originalBlock, newBlock);
    fs.writeFileSync('src/App.tsx', content, 'utf-8');
    console.log('Replaced successfully');
} else {
    console.log('Target string not found');
}
