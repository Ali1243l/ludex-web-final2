import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the closing divs
content = content.replace(
        `              </>
              )}
            </div>
          </div>
        );
      })()}
      </AnimatePresence>`,
        `              </>
              )}
            </motion.div>
          </motion.div>
        );
      })()}
      </AnimatePresence>`
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Fixed closing tags');
