import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the navbar
// We will use string slicing to replace the whole nav block
const navStart = text.indexOf('<nav className="h-20 w-full px-4 md:px-8');
const navEnd = text.indexOf('</nav>', navStart) + 6;

if(navStart > -1 && navEnd > navStart) {
  const newNav = `<nav className="h-16 md:h-20 w-full px-4 md:px-8 flex items-center justify-between border-b border-purple-900/30 bg-[#050505]/80 backdrop-blur-md z-10 flex-shrink-0 relative">
        {toastMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-auto md:left-auto md:bottom-10 md:right-10 z-[300] bg-[#111] border border-purple-500 backdrop-blur w-[90%] md:w-auto md:min-w-[300px] text-white px-6 py-4 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.4)] font-bold flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
            {toastMessage}
          </div>
        )}
        <div className="flex items-center justify-center flex-none md:justify-start gap-10">
          <div className="text-xl md:text-2xl font-black tracking-tighter text-white cursor-pointer text-center hidden md:block" onClick={() => { setActiveTab('store'); setActiveCategory(null); setIsMobileMenuOpen(false); }}>
            LUDEX<span className="text-purple-500">STORE</span>
          </div>
          {/* Mobile Logo Only */}
          <div className="text-xl font-black tracking-tighter text-white cursor-pointer md:hidden flex items-center gap-2" onClick={() => { setActiveTab('store'); setActiveCategory(null); }}>
            <span className="bg-purple-600 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.5)]">L</span>
            <span>LUDEX<span className="text-purple-500">STORE</span></span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400 tracking-widest">
             <button onClick={() => { setActiveTab('store'); setActiveCategory(null); }} className={activeTab === 'store' && activeCategory !== 'Subscriptions' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].store}</button>
             <button onClick={() => { setActiveTab('store'); setActiveCategory('Subscriptions'); }} className={activeTab === 'store' && activeCategory === 'Subscriptions' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].subs || 'Subscriptions'}</button>
             <button onClick={() => { setActiveTab('user_dashboard'); setUserDashboardTab('orders'); }} className={activeTab === 'user_dashboard' && userDashboardTab === 'orders' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].orders}</button>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-6">
          <div className="relative hidden md:flex items-center">
            <div className="absolute start-3 w-4 h-4 text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder={t[language].search} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111] border border-purple-900/40 rounded-full py-2 ps-10 pe-4 text-sm w-64 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 transition-colors focus:bg-purple-900/10 min-h-[44px]" 
            />
          </div>
          
          {/* Mobile Search Icon */}
          <div className="md:hidden flex items-center justify-center p-2 text-gray-400 hover:text-white cursor-pointer" onClick={() => { setIsMobileMenuOpen(true) }}>
             <Search className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && userProfile.role === 'ADMIN' && (
              <div 
                className="relative cursor-pointer text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px] hidden md:flex"
                onClick={() => { setActiveTab('admin'); setAdminTab('support'); }}
                title={t[language].hqSupChat}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-black shadow-[0_0_8px_#22c55e] animate-pulse"></span>
              </div>
            )}
            
            <div className={\`relative cursor-pointer hover:text-purple-400 text-gray-400 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px] hidden md:flex \${cartAnimating ? 'animate-bounce-cart' : ''}\`} onClick={() => setActiveTab('cart')}>
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-black rounded-full shadow-[0_0_8px_#ef4444] text-[8px] flex items-center justify-center font-bold text-white transition-all transform hover:scale-110">{cart.length}</span>
              )}
            </div>
            
            <div className="relative">
              {isLoggedIn ? (
                <>
                  <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-8 h-8 md:w-10 md:h-10 bg-purple-900 rounded-full border border-purple-500/50 cursor-pointer overflow-hidden hover:border-purple-400 transition-colors flex items-center justify-center font-bold text-white uppercase select-none">
                     {userProfile.name.charAt(0)}
                  </div>
                  {isProfileOpen && (
                    <div className={\`absolute \${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 bg-[#111] border border-purple-900/50 rounded-xl shadow-xl overflow-hidden z-20 flex flex-col\`}>
                      {userProfile.role === 'ADMIN' && (
                        <button onClick={() => { setActiveTab('admin'); setIsProfileOpen(false); }} className="px-4 py-3 text-sm text-start hover:bg-purple-900/30 transition-colors border-b border-gray-800 flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest">
                          <Shield className="w-4 h-4" /> LUDEX HQ PORTAL
                        </button>
                      )}
                      <button onClick={() => { setActiveTab('user_dashboard'); setUserDashboardTab('profile'); setIsProfileOpen(false); }} className="px-4 py-3 text-sm text-start hover:bg-purple-900/30 transition-colors border-b border-gray-800 flex items-center gap-2 text-white">
                        <User className="w-4 h-4" /> {t[language].profile}
                      </button>
                      <button onClick={() => { setActiveTab('user_dashboard'); setUserDashboardTab('settings'); setIsProfileOpen(false); }} className="px-4 py-3 text-sm text-start hover:bg-purple-900/30 transition-colors border-b border-gray-800 flex items-center gap-2 text-white">
                        <Settings className="w-4 h-4" /> {t[language].settings}
                      </button>
                      <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-black/50">
                        <span className="text-xs font-bold text-gray-400">Language</span>
                        <div className="flex bg-[#111] rounded-md border border-purple-900/30 p-1">
                          <button onClick={() => setLanguage('en')} className={\`px-2 py-1 text-[10px] rounded font-bold transition-colors \${language === 'en' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'}\`}>EN</button>
                          <button onClick={() => setLanguage('ar')} className={\`px-2 py-1 text-[10px] rounded font-bold transition-colors \${language === 'ar' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'}\`}>عربي</button>
                        </div>
                      </div>
                      <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center bg-black/50">
                        <span className="text-xs font-bold text-gray-400">Currency</span>
                        <div className="flex bg-[#111] rounded-md border border-purple-900/30 p-1">
                          <button onClick={() => setCurrency('USD')} className={\`px-2 py-1 text-[10px] rounded font-bold transition-colors \${currency === 'USD' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'}\`}>USD</button>
                          <button onClick={() => setCurrency('IQD')} className={\`px-2 py-1 text-[10px] rounded font-bold transition-colors \${currency === 'IQD' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-500 hover:text-white'}\`}>IQD</button>
                        </div>
                      </div>
                      <button onClick={() => { 
                          setIsLoggedIn(false); 
                          setUserProfile({name: '', email: '', role: 'CUSTOMER'}); 
                          setIsProfileOpen(false); 
                          if(activeTab === 'admin' || activeTab === 'profile') { setActiveTab('store'); setActiveCategory(null); }
                      }} className="px-4 py-3 text-sm text-start text-red-500 hover:bg-red-500/10 transition-colors">{t[language].logout}</button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center gap-2">
                    <button onClick={() => setShowAuthModal('login')} className="text-gray-400 hover:text-white text-sm font-bold transition-colors">{t[language].signIn}</button>
                    <button onClick={() => setShowAuthModal('register')} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">{t[language].register}</button>
                  </div>
                  <div className="md:hidden">
                    <button onClick={() => setShowAuthModal('login')} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 uppercase">
                      <User className="w-3.5 h-3.5" />
                      {t[language].signIn}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>`;
      
  text = text.substring(0, navStart) + newNav + text.substring(navEnd);
  fs.writeFileSync('src/App.tsx', text);
} else {
  console.log("Could not find nav block.");
}
