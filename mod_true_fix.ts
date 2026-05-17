import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldStr = ` </form>
            )}
          </div>
        )}
        
        <div 
          onClick={() => setIsChatOpen(!isChatOpen)}`;

const newStr = ` </form>
            )}
          </motion.div>
        )}
        </AnimatePresence>
        
        <div 
          onClick={() => setIsChatOpen(!isChatOpen)}`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Replaced correctly!');
