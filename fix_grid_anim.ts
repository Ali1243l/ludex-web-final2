import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const t1 = `              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full">
                {isLoadingStore ? (`;
const r1 = `              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full relative">
                <AnimatePresence mode="popLayout">
                {isLoadingStore ? (`;

content = content.replace(t1, r1);

const t2 = `                  ))
                )}
              </div>
              
              {filteredGames.length > visibleGamesCount && (`;
const r2 = `                  ))
                )}
                </AnimatePresence>
              </motion.div>
              
              {filteredGames.length > visibleGamesCount && (`;

content = content.replace(t2, r2);

// Make sure games scale down on exit
const t3 = `                    <motion.div 
                      key={game.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}`;
const r3 = `                    <motion.div 
                      key={game.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}`;

content = content.replace(t3, r3);

fs.writeFileSync('src/App.tsx', content);
