import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
    `{/* View Profile Modal */}
      {viewedProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 shadow-2xl overflow-y-auto" onClick={() => setViewedProfile(null)}>
          <div className="bg-[#050505] border border-purple-900/40 rounded-2xl w-full max-w-md p-6 relative shadow-[0_0_50px_rgba(147,51,234,0.15)] mt-4 mb-4" onClick={e => e.stopPropagation()}>`,
    `{/* View Profile Modal */}
      <AnimatePresence>
      {viewedProfile && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 shadow-2xl overflow-y-auto" onClick={() => setViewedProfile(null)}>
          <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-[#050505] border border-purple-900/40 rounded-2xl w-full max-w-md p-6 relative shadow-[0_0_50px_rgba(147,51,234,0.15)] mt-4 mb-4" onClick={e => e.stopPropagation()}>`
);

content = content.replace(
    `              </div>
            </div>
          </div>
        </div>
      )}
      
      
      {viewedProfileId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-[#111] border border-purple-500/30 w-full max-w-sm rounded-2xl p-6 relative">`,
    `              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
      
      <AnimatePresence>
      {viewedProfileId && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-[#111] border border-purple-500/30 w-full max-w-sm rounded-2xl p-6 relative">`
);

content = content.replace(
    `                 )}
                </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>`,
    `                 )}
                </div>
            )}
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>`
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Profiles modal animated!');
