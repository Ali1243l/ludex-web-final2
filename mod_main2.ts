import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The blocks inside <main> are clearly separated.
// Store block: starts at {activeTab === 'store' && ( 
// closes right before {(activeTab === 'orders' ||

content = content.replace(
  "{activeTab === 'store' && (",
  "{activeTab === 'store' && (\\n<motion.div key='store' initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.25, ease: 'easeOut' }} className='flex-1 flex flex-col w-full'>"
);
content = content.replace(
  /(\n\s*)({\(activeTab === 'orders' \|\| \(activeTab === 'user_dashboard' && userDashboardTab === 'orders'\)\) && \()/g,
  "$1</motion.div>\n          )}\n\n          $2"
);

content = content.replace(
  "{(activeTab === 'orders' || (activeTab === 'user_dashboard' && userDashboardTab === 'orders')) && (",
  "{(activeTab === 'orders' || (activeTab === 'user_dashboard' && userDashboardTab === 'orders')) && (\\n<motion.div key='orders' initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.25, ease: 'easeOut' }} className='flex-1 flex flex-col w-full'>"
);
content = content.replace(
  /(\n\s*)({activeTab === 'cart' && \()/g,
  "$1</motion.div>\n          )}\n\n          $2"
);

content = content.replace(
  "{activeTab === 'cart' && (",
  "{activeTab === 'cart' && (\\n<motion.div key='cart' initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.25, ease: 'easeOut' }} className='flex-1 flex flex-col w-full'>"
);
content = content.replace(
  /(\n\s*)({\(activeTab === 'profile' \|\| \(activeTab === 'user_dashboard' && userDashboardTab === 'profile'\)\) && \()/g,
  "$1</motion.div>\n          )}\n\n          $2"
);

content = content.replace(
  "{(activeTab === 'profile' || (activeTab === 'user_dashboard' && userDashboardTab === 'profile')) && (",
  "{(activeTab === 'profile' || (activeTab === 'user_dashboard' && userDashboardTab === 'profile')) && (\\n<motion.div key='profile' initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.25, ease: 'easeOut' }} className='flex-1 flex flex-col w-full'>"
);
content = content.replace(
  /(\n\s*)({\(activeTab === 'settings' \|\| \(activeTab === 'user_dashboard' && userDashboardTab === 'settings'\)\) && \()/g,
  "$1</motion.div>\n          )}\n\n          $2"
);

content = content.replace(
  "{(activeTab === 'settings' || (activeTab === 'user_dashboard' && userDashboardTab === 'settings')) && (",
  "{(activeTab === 'settings' || (activeTab === 'user_dashboard' && userDashboardTab === 'settings')) && (\\n<motion.div key='settings' initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.25, ease: 'easeOut' }} className='flex-1 flex flex-col w-full'>"
);
content = content.replace(
  /(\n\s*)({activeTab === 'page' && currentSlug && \(\(\) => {)/g,
  "$1</motion.div>\n          )}\n\n          $2"
);


// `page` is a self invoking function, returning a div. I'll just let it be, but put AnimatePresence over it.
content = content.replace(
  "{activeTab === 'page' && currentSlug && (() => {",
  "{activeTab === 'page' && currentSlug && (() => {\\n            return <motion.div key='page' initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.25, ease: 'easeOut' }} className='flex-1 flex flex-col w-full'>"
);

// Close `page` return wrapper correctly
// The block end for `page`:
/*
                </div>
              </div>
            );
          })()}
*/

content = content.replace(
  `                </div>
              </div>
            );
          })()}`,
  `                </div>
              </div>
            </motion.div>);
          })()}`
);

// Adding <AnimatePresence mode="wait"> wrapping everything inside main.
content = content.replace(
  `<main className="flex-1 p-4 sm:p-6 pb-28 md:p-8 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">`,
  `<main className="flex-1 p-4 sm:p-6 pb-28 md:p-8 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">
        <AnimatePresence mode="wait">`
);

content = content.replace(
  // search for the `</main>` and prepend `</AnimatePresence>` to it.
  `        </main>`,
  `        </AnimatePresence>
        </main>`
);

// We need to make sure we remove the original `)}` that we replaced.
// Wait, when I replaced `)} \n\n { (activeTab === X ...` I just prefixed `</motion.div> )}`. This duplicates the `)}`.
// In my replace block I did: "$1</motion.div>\n          )}\n\n          $2". The original string only matched `\n { (activeTab`. But we DID NOT MATCH THE CLOSING )}. 
// So wait, let me rewrite `mod_main.ts` safely.
