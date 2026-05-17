import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target1 = `              {/* Dynamic Unified Banners */}
              {!activeCategory && !searchQuery && (() => {`;
const repl1 = `              {/* Dynamic Unified Banners */}
              <AnimatePresence>
              {!activeCategory && !searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, paddingBottom: 0 }} 
                  animate={{ opacity: 1, height: 'auto', paddingBottom: 0 }} 
                  exit={{ opacity: 0, height: 0, paddingBottom: 0, overflow: 'hidden' }} 
                  transition={{ duration: 0.3 }}
                >
                {(() => {`;

content = content.replace(target1, repl1);

const target2 = `              })()}

              {/* Exclusive Offers Section */}
              {!activeCategory && !searchQuery && publicProducts.filter(p => p.discountPrice || p.isFeatured).length > 0 && (
                <div className="mb-10 w-full overflow-hidden flex flex-col gap-4 animate-in fade-in duration-500">`;

const repl2 = `              })()}
                </motion.div>
              )}
              </AnimatePresence>

              {/* Exclusive Offers Section */}
              <AnimatePresence>
              {!activeCategory && !searchQuery && publicProducts.filter(p => p.discountPrice || p.isFeatured).length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, paddingBottom: 0, overflow: 'hidden' }} 
                  animate={{ opacity: 1, height: 'auto', paddingBottom: 0 }} 
                  exit={{ opacity: 0, height: 0, paddingBottom: 0, overflow: 'hidden' }} 
                  transition={{ duration: 0.3 }}
                  className="mb-10 w-full flex flex-col gap-4"
                >`;

content = content.replace(target2, repl2);

const target3 = `                  </div>
                </div>
              )}

              {/* Store Header / Search section */}`;

const repl3 = `                  </div>
                </motion.div>
              )}
              </AnimatePresence>

              {/* Store Header / Search section */}`;

content = content.replace(target3, repl3);

fs.writeFileSync('src/App.tsx', content);
