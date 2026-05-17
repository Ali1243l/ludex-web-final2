import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `{/* Chat Widget */}
      <div className={\`fixed bottom-24 md:bottom-10 \${language === 'ar' ? 'left-4 md:left-8 items-start' : 'right-4 md:right-8 items-end'} z-[110] md:z-50 flex flex-col pointer-events-none\`}>
        {isChatOpen && (
          <div className="bg-[#0a0a0c] border border-gray-800 rounded-3xl w-[calc(100vw-32px)] sm:w-[350px] md:w-[380px] h-[600px] max-h-[60vh] md:max-h-[70vh] mb-4 shadow-[0_15px_50px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto">`;

const replaceStr = `{/* Chat Widget */}
      <div className={\`fixed bottom-24 md:bottom-10 \${language === 'ar' ? 'left-4 md:left-8 items-start' : 'right-4 md:right-8 items-end'} z-[110] md:z-50 flex flex-col pointer-events-none\`}>
        <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0a0a0c] border border-gray-800 rounded-3xl w-[calc(100vw-32px)] sm:w-[350px] md:w-[380px] h-[600px] max-h-[60vh] md:max-h-[70vh] mb-4 shadow-[0_30px_60px_rgba(168,85,247,0.25)] flex flex-col overflow-hidden pointer-events-auto origin-bottom"
          >`;

content = content.replace(targetStr, replaceStr);

const targetStr2 = `                  </form>
                )}
              </div>
            </div>
          )}
        </div>`;

const replaceStr2 = `                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div`;

content = content.replace(targetStr2, replaceStr2);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Chat animation added!');
