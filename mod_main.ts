import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace <main>...</main> inner sections
const lines = content.split('\\n');
let mainStartIdx = -1;
let mainEndIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<main className="flex-1 p-4 sm:p-6 pb-28 md:p-8 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">')) {
    mainStartIdx = i;
  }
  if (mainStartIdx !== -1 && lines[i].includes('</main>')) {
    mainEndIdx = i;
    break;
  }
}

let codeBeforeMain = lines.slice(0, mainStartIdx + 1).join('\\n');
let mainContent = lines.slice(mainStartIdx + 1, mainEndIdx).join('\\n');
let codeAfterMain = lines.slice(mainEndIdx).join('\\n');

console.log(mainContent.split('\\n').filter(line => line.includes('{activeTab === ')).join('\\n'));

// Replace instances of "{activeTab === 'X' && (" with 

mainContent = mainContent.replace(
  /{activeTab === 'store' && \(/g,
  "{activeTab === 'store' && (\\n<motion.div key='store' initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className='flex-1 flex flex-col'>"
);
// we need to close </motion.div> for store. We can do replace on specific parts, but actually, they are closed with ")}\\n".
// Note: store closes right before "{(activeTab === 'orders' ||"

mainContent = mainContent.replace(
  /{\(activeTab === 'orders' \|\| \(activeTab === 'user_dashboard' && userDashboardTab === 'orders'\)\) && \(/g,
  "{((activeTab === 'orders') || (activeTab === 'user_dashboard' && userDashboardTab === 'orders')) && (\\n<motion.div key='orders' initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className='flex-1 flex flex-col'>"
);

mainContent = mainContent.replace(
  /{activeTab === 'cart' && \(/g,
  "{activeTab === 'cart' && (\\n<motion.div key='cart' initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className='flex-1 flex flex-col'>"
);

mainContent = mainContent.replace(
  /{\(activeTab === 'profile' \|\| \(activeTab === 'user_dashboard' && userDashboardTab === 'profile'\)\) && \(/g,
  "{((activeTab === 'profile') || (activeTab === 'user_dashboard' && userDashboardTab === 'profile')) && (\\n<motion.div key='profile' initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className='flex-1 flex flex-col'>"
);

mainContent = mainContent.replace(
  /{\(activeTab === 'settings' \|\| \(activeTab === 'user_dashboard' && userDashboardTab === 'settings'\)\) && \(/g,
  "{((activeTab === 'settings') || (activeTab === 'user_dashboard' && userDashboardTab === 'settings')) && (\\n<motion.div key='settings' initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className='flex-1 flex flex-col'>"
);

mainContent = mainContent.replace(
  /{activeTab === 'page' && currentSlug && \(\(\) => {/g,
  "{activeTab === 'page' && currentSlug && (() => {\\nreturn <motion.div key='page' initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className='flex-1 flex flex-col'>"
);

// We need to replace the `)}` parts for these blocks. 
// A better way is using split and join or exact replacement. 
const completeContent = codeBeforeMain + '\\n<AnimatePresence mode="wait">\\n' + mainContent + '\\n</AnimatePresence>\\n' + codeAfterMain;
fs.writeFileSync('src/tmp.tsx', completeContent, 'utf-8');
