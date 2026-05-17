import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const TABS_TO_ANIMATE = [
    "{activeTab === 'store' && (",
    "{(activeTab === 'orders' || (activeTab === 'user_dashboard' && userDashboardTab === 'orders')) && (",
    "{activeTab === 'cart' && (",
    "{(activeTab === 'profile' || (activeTab === 'user_dashboard' && userDashboardTab === 'profile')) && (",
    "{(activeTab === 'settings' || (activeTab === 'user_dashboard' && userDashboardTab === 'settings')) && (",
    "{activeTab === 'admin' && ("
];

function wrapTabs() {
    let modified = content;
    
    // Add AnimatePresence inside main
    modified = modified.replace(
      '<main className="flex-1 p-4 sm:p-6 pb-28 md:p-8 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">',
      '<main className="flex-1 p-4 sm:p-6 pb-28 md:p-8 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">\\n        <AnimatePresence mode="wait">'
    );
    
    // Search for end of main
    modified = modified.replace(
      '        </main>',
      '        </AnimatePresence>\\n        </main>'
    );
    
    fs.writeFileSync('src/App.tsx', modified, 'utf-8');
    console.log("main wrapped");
}

wrapTabs();
