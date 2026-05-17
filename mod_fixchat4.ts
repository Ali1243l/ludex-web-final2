import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = content.substring(content.lastIndexOf("</form>"), content.lastIndexOf("</form>") + 200).split('</form>')[1];
const inner = targetStr;

content = content.replace("</form>" + inner, "</form>\\n             )}\\n          </motion.div>\\n        )}\\n        </AnimatePresence>\\n        \\n        <div ");

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Fixed chat tags part 4!');
