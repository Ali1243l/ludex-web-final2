import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                      <div className={\`absolute top-full mt-2 w-56 bg-[#111] border border-gray-800 rounded-xl shadow-2xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-200 \${language === 'ar' ? 'left-0' : 'right-0'}\`} dir={language === 'ar' ? 'rtl' : 'ltr'}>`;

const replaceStr = `                  {/* Profile Dropdown */}
                  <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                      <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={\`absolute top-full mt-2 w-56 bg-[#111] border border-gray-800 rounded-xl shadow-2xl py-2 z-50 text-sm \${language === 'ar' ? 'left-0' : 'right-0'}\`} 
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      >`;

content = content.replace(targetStr, replaceStr);

const targetStr2 = `                        <button onClick={async () => { await signOut(); setIsProfileOpen(false); }} className={\`w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2\`}><LogOut className="w-4 h-4"/> {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</button>
                      </div>
                    </>
                  )}`;

const replaceStr2 = `                        <button onClick={async () => { await signOut(); setIsProfileOpen(false); }} className={\`w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2\`}><LogOut className="w-4 h-4"/> {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</button>
                      </motion.div>
                    </>
                  )}
                  </AnimatePresence>`;

content = content.replace(targetStr2, replaceStr2);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Profile animation added!');
