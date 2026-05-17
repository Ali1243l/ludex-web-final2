import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `{/* Mobile slide-out drawer (Moved outside nav for proper fixed positioning) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] md:hidden flex" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {/* Backdrop with a subtle blur fade */}
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Drawer container - sleek and dynamic */}
          <div className={\`relative w-[300px] max-w-[85vw] h-full bg-gradient-to-b from-[#0f0f13] to-[#050505] backdrop-blur-2xl \${language === 'ar' ? 'border-l' : 'border-r'} border-purple-900/40 shadow-2xl flex flex-col overflow-hidden animate-in \${language === 'ar' ? 'slide-in-from-right' : 'slide-in-from-left'} duration-300 ease-out z-10\`}>`;

const replaceStr = `{/* Mobile slide-out drawer (Moved outside nav for proper fixed positioning) */}
      <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] md:hidden flex" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {/* Backdrop with a subtle blur fade */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></motion.div>
          
          {/* Drawer container - sleek and dynamic */}
          <motion.div 
            initial={{ x: language === 'ar' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? '100%' : '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={\`relative w-[300px] max-w-[85vw] h-full bg-gradient-to-b from-[#0f0f13] to-[#050505] backdrop-blur-2xl \${language === 'ar' ? 'border-l' : 'border-r'} border-purple-900/40 shadow-2xl flex flex-col overflow-hidden z-10\`}
          >`;

content = content.replace(targetStr, replaceStr);

const targetStr2 = `             {/* Footer Contacts */}
             <div className="p-5 border-t border-gray-800/40 bg-black/20 text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">&copy; 2026 Ludex Store</p>
             </div>
          </div>
        </div>
      )}`;

const replaceStr2 = `             {/* Footer Contacts */}
             <div className="p-5 border-t border-gray-800/40 bg-black/20 text-center">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">&copy; 2026 Ludex Store</p>
             </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>`;

content = content.replace(targetStr2, replaceStr2);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Mobile menu animation added!');
