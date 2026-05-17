import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `{isCheckoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end md:justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e1e24] border-t md:border border-purple-900/40 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg shadow-[0_-10px_50px_rgba(147,51,234,0.3)] md:shadow-[0_0_50px_rgba(147,51,234,0.3)] flex flex-col overflow-hidden max-h-[95vh] md:max-h-[90vh] animate-in slide-in-from-bottom-5 duration-300">`;

const replaceStr = `<AnimatePresence>
      {isCheckoutModalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-end md:justify-center bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="bg-[#1e1e24] border-t md:border border-purple-900/40 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg shadow-[0_-10px_50px_rgba(147,51,234,0.3)] md:shadow-[0_0_50px_rgba(147,51,234,0.3)] flex flex-col overflow-hidden max-h-[95vh] md:max-h-[90vh]">`;

content = content.replace(targetStr, replaceStr);

const targetStr2 = `                  <span className="font-bold relative z-10 w-full truncate">Confirm Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}`;

const replaceStr2 = `                  <span className="font-bold relative z-10 w-full truncate">Confirm Order</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>`;

content = content.replace(targetStr2, replaceStr2);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Checkout modal animated!');
