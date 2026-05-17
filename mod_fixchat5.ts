import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// I know line 5032 is `           </div>`
let lines = content.split('\\n');
lines[5031] = "          </motion.div>"; // 5032 is index 5031
lines.splice(5033, 0, "        </AnimatePresence>");

fs.writeFileSync('src/App.tsx', lines.join('\\n'), 'utf-8');
console.log('Fixed chat tags part 5!');
