import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  "</form>\\n             )}\\n          </div>\\n        )}",
  "</form>\\n             )}\\n          </motion.div>\\n        )}\\n        </AnimatePresence>"
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Fixed chat tags part 3!');
