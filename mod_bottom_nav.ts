import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. We replace the main container with added pb-20 on mobile
text = text.replace(
  '<div dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen h-screen bg-[#050505] text-[#F3F4F6] font-sans flex flex-col overflow-hidden relative select-none">',
  '<div dir={language === "ar" ? "rtl" : "ltr"} className="min-h-screen h-screen bg-[#050505] text-[#F3F4F6] font-sans flex flex-col overflow-hidden relative select-none pb-20 md:pb-0">'
);

// 2. We add the bottom navigation bar at the end before the closing div
// First let's find the bottom bar info (footer)
const footerIndex = text.indexOf('{/* Bottom Bar Info */}');

if (footerIndex > -1) {
  const bottomNavStr = `
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-purple-900/40 z-[90] flex items-center justify-around pb-safe shadow-[0_-5px_30px_rgba(168,85,247,0.15)] pb-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <button onClick={() => { setActiveTab('store'); setActiveCategory(null); }} className={\`flex flex-col items-center justify-center w-full h-full space-y-1 \${activeTab === 'store' ? 'text-purple-400' : 'text-gray-500 hover:text-purple-300 transition-colors'}\`}>
          <Home className={\`w-6 h-6 \${activeTab === 'store' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}\`} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t[language].store}</span>
        </button>
        <button onClick={() => { setActiveTab('cart'); }} className={\`relative flex flex-col items-center justify-center w-full h-full space-y-1 \${activeTab === 'cart' ? 'text-purple-400' : 'text-gray-500 hover:text-purple-300 transition-colors'}\`}>
          <ShoppingBag className={\`w-6 h-6 \${cartAnimating ? 'animate-bounce-cart' : ''} \${activeTab === 'cart' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}\`} />
          {cart.length > 0 && (
             <span className="absolute top-[8px] right-[20px] w-4 h-4 bg-red-500 border-2 border-[#0a0a0a] rounded-full text-[9px] flex items-center justify-center font-bold text-white scale-110 shadow-[0_0_8px_#ef4444] animate-in zoom-in">{cart.length}</span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider">{t[language].cart || 'Cart'}</span>
        </button>
        {isLoggedIn ? (
          <button onClick={() => { setActiveTab('user_dashboard'); setUserDashboardTab('orders'); }} className={\`flex flex-col items-center justify-center w-full h-full space-y-1 \${activeTab === 'user_dashboard' && userDashboardTab === 'orders' ? 'text-purple-400' : 'text-gray-500 hover:text-purple-300 transition-colors'}\`}>
            <ListOrdered className={\`w-6 h-6 \${activeTab === 'user_dashboard' && userDashboardTab === 'orders' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}\`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t[language].orders}</span>
          </button>
        ) : (
          <button onClick={() => { setShowAuthModal('login') }} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-purple-300 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t[language].signIn}</span>
          </button>
        )}
        <button onClick={() => setIsMobileMenuOpen(true)} className={\`flex flex-col items-center justify-center w-full h-full space-y-1 \${isMobileMenuOpen ? 'text-purple-400' : 'text-gray-500 hover:text-purple-300 transition-colors'}\`}>
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Menu</span>
        </button>
      </div>
      
      {/* Bottom Bar Info */}
`;
  text = text.replace('{/* Bottom Bar Info */}', bottomNavStr);
  
  // Hide standard footer on mobile
  text = text.replace('<footer className="w-full bg-black/60 backdrop-blur-md border-t border-purple-900/30 px-6 md:px-8 py-6 md:py-0 md:h-12 flex flex-col md:flex-row items-center justify-center md:justify-between text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium flex-shrink-0 z-10 relative gap-4 md:gap-0 mt-auto">', '<footer className="hidden md:flex w-full bg-black/60 backdrop-blur-md border-t border-purple-900/30 px-6 md:px-8 py-6 md:py-0 md:h-12 flex-col md:flex-row items-center justify-center md:justify-between text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium flex-shrink-0 z-10 relative gap-4 md:gap-0 mt-auto">');

  fs.writeFileSync('src/App.tsx', text);
} else {
  console.log("Could not find footer block.");
}
