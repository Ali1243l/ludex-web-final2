import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
let lines = content.split('\\n');

// Clean up any garbage from line 5052 onwards
lines = lines.slice(0, 5052);

// Let's rewrite the chat widget closing properly.
/*
5028:                    <Send className="w-4 h-4" />
5029:                  </button>
5030:                </form>
5031:             )}
5032:           </motion.div>
5033:         )}
5034:         </AnimatePresence>
5035:         
5036:         <div 
*/

lines[5030] = "               </form>";
lines[5031] = "            )}";
lines[5032] = "          </motion.div>";
lines[5033] = "        )}";
lines[5034] = "        </AnimatePresence>";

fs.writeFileSync('src/App.tsx', lines.join('\\n'), 'utf-8');
