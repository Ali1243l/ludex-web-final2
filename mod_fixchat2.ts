import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `             )}
            </div>
          )}
        
        <div `;

const replaceStr = `             )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div `;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Fixed chat tags part 2!');
