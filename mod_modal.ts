import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const modalStartSearch = '{isGameDetailOpen && selectedGameId !== null && (() => {';
if (content.includes(modalStartSearch)) {
    // Replace the opening part.
    content = content.replace(
        '{isGameDetailOpen && selectedGameId !== null && (() => {',
        '<AnimatePresence>\n      {isGameDetailOpen && selectedGameId !== null && (() => {'
    );

    // Replace the wrapper divs with motion.div
    content = content.replace(
        '<div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-0 lg:p-4 animate-[fadeIn_0.2s_ease-out]">',
        '<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-0 lg:p-4">'
    );

    content = content.replace(
        '<div className={`bg-[#151515] border border-purple-900/40 rounded-none lg:rounded-2xl w-full h-full lg:h-auto lg:max-h-[90vh] lg:max-w-4xl overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(147,51,234,0.15)] animate-[slideInUp_0.3s_ease-out] ${isGameDetailLoading ? \'animate-skeleton\' : \'\'}`}>',
        '<motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`bg-[#151515] border border-purple-900/40 rounded-none lg:rounded-2xl w-full h-full lg:h-auto lg:max-h-[90vh] lg:max-w-4xl overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_80px_rgba(147,51,234,0.2)] ${isGameDetailLoading ? \'animate-skeleton\' : \'\'}`}>'
    );

    // And close Animate Presence.
    const closePattern = '        );\n      })()}';
    content = content.replace(
        closePattern,
        '        );\n      })()}\n      </AnimatePresence>'
    );
    
    fs.writeFileSync('src/App.tsx', content, 'utf-8');
    console.log('Modal animated successfully');
} else {
    console.log('Modal not found');
}
