import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const navStartIndex = content.indexOf('<nav className="h-16 md:h-20 w-full px-4 md:px-8 flex items-center justify-between border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-2xl z-10 flex-shrink-0 sticky top-0 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">');

if (navStartIndex !== -1) {
    const navEndIndex = content.indexOf('</nav>', navStartIndex);
    const originalNav = content.substring(navStartIndex, navEndIndex + 6);
    
    // We will build a new replacement.
    const newNav = `<nav className={\`h-16 md:h-20 w-full px-4 md:px-8 flex items-center justify-between border-b border-white/5 bg-[#0a0a0c]/90 backdrop-blur-2xl z-20 flex-shrink-0 sticky top-0 shadow-[0_5px_40px_rgba(0,0,0,0.4)] transition-all duration-300 \${isMobileSearchOpen ? 'bg-gradient-to-b from-purple-900/10 to-[#0a0a0c]' : ''}\`}>
        
        {/* Mobile Search Overlay */}
        <div className={\`absolute inset-0 px-4 flex items-center md:hidden transition-all duration-300 ease-out z-30 \${isMobileSearchOpen ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' : 'opacity-0 -translate-y-4 pointer-events-none scale-95'}\`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
           <div className="relative w-full flex items-center shadow-[0_0_20px_rgba(168,85,247,0.15)] rounded-full">
             <Search className={\`absolute \${language === 'ar' ? 'right-4' : 'left-4'} w-4 h-4 text-purple-400\`} />
             <input 
               type="text" 
               placeholder={t[language].search} 
               value={searchQuery}
               onChange={(e) => { setSearchQuery(e.target.value); if(e.target.value) setActiveTab('store'); }}
               className={\`w-full bg-[#111116] border border-purple-500/40 rounded-full py-2.5 \${language === 'ar' ? 'pr-11 pl-12' : 'pl-11 pr-12'} text-sm focus:outline-none focus:border-purple-400 focus:bg-purple-900/10 text-white placeholder-gray-500 transition-all font-bold\`} 
             />
             <button onClick={() => setIsMobileSearchOpen(false)} className={\`absolute \${language === 'ar' ? 'left-2' : 'right-2'} p-2.5 text-gray-400 hover:text-white rounded-full bg-black/20 hover:bg-black/50 transition-colors\`}>
                <X className="w-4 h-4" />
             </button>
           </div>
        </div>

        <div className={\`flex w-full items-center justify-between transition-all duration-300 \${isMobileSearchOpen ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto blur-sm md:blur-none' : 'opacity-100 pointer-events-auto blur-none'}\`}>
        <div className="flex items-center flex-none gap-6 md:gap-10">
          <div className="text-xl md:text-2xl font-black tracking-tighter text-white cursor-pointer hidden md:flex items-center" onClick={() => { setActiveTab('store'); setActiveCategory(null); setIsMobileMenuOpen(false); }}>
            LUDEX<span className="text-purple-500">STORE</span>
          </div>
          
          {/* Mobile Logo Only */}
          <div className="text-lg font-black tracking-tighter text-white cursor-pointer md:hidden flex items-center gap-2" onClick={() => { setActiveTab('store'); setActiveCategory(null); }}>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.4)]">L</div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">LUDEX<span className="text-purple-400">STORE</span></span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-400 tracking-widest">
             <button onClick={() => { setActiveTab('store'); setActiveCategory(null); }} className={activeTab === 'store' && activeCategory !== 'Subscriptions' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].store}</button>
             <button onClick={() => { setActiveTab('store'); setActiveCategory('Subscriptions'); }} className={activeTab === 'store' && activeCategory === 'Subscriptions' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].subs || 'Subscriptions'}</button>
             <button onClick={() => { setActiveTab('user_dashboard'); setUserDashboardTab('orders'); }} className={activeTab === 'user_dashboard' && userDashboardTab === 'orders' ? "text-purple-400 border-b-2 border-purple-500 pb-1" : "hover:text-purple-400 transition-colors duration-300 min-h-[44px]"}>{t[language].orders}</button>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-6">
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
          
          {/* Mobile Search Icon & User Login */}
          <div className="md:hidden flex items-center justify-center p-2 text-gray-300 hover:text-white cursor-pointer bg-gray-800/40 rounded-full border border-gray-700/50 hover:bg-gray-800/80 transition-colors" onClick={() => { setIsMobileSearchOpen(true) }}>
             <Search className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && userProfile?.role === 'ADMIN' && (
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
                  <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-700 to-purple-900 rounded-full border-2 border-purple-500/50 cursor-pointer overflow-hidden hover:border-purple-400 transition-all flex items-center justify-center font-bold text-white uppercase select-none shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                     {userProfile?.avatar_url ? (
                        <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                        (userProfile?.display_name || userProfile?.email || '?').charAt(0)
                     )}
                  </div>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                      <div className={\`absolute top-full mt-2 w-56 bg-[#111] border border-gray-800 rounded-xl shadow-2xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-200 \${language === 'ar' ? 'left-0' : 'right-0'}\`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <div className="px-4 py-2 border-b border-gray-800 mb-2">
                           <p className="font-bold text-white truncate">{userProfile?.display_name || 'User'}</p>
                           <p className="text-[10px] text-gray-500 font-mono truncate">{userProfile?.email}</p>
                        </div>
                        <button onClick={() => { setActiveTab('user_dashboard'); setIsProfileOpen(false); }} className={\`w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2\`}><User className="w-4 h-4 text-purple-400"/> {language === 'ar' ? 'حسابي' : 'My Account'}</button>
                        {userProfile?.role === 'ADMIN' && (
                           <button onClick={() => { setActiveTab('admin'); setIsProfileOpen(false); }} className={\`w-full text-left px-4 py-2 text-purple-400 hover:bg-purple-900/20 font-bold transition-colors flex items-center gap-2\`}><Shield className="w-4 h-4"/> Ludex HQ Portal</button>
                        )}
                        <hr className="my-2 border-gray-800" />
                        <button onClick={async () => { await signOut(); setIsProfileOpen(false); }} className={\`w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 transition-colors flex items-center gap-2\`}><LogOut className="w-4 h-4"/> {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal('login')}
                  className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-lg font-black uppercase text-[10px] md:text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {t[language].signIn}
                </button>
              )}
            </div>
          </div>
        </div>
        </div>
      </nav>`;

    content = content.replace(originalNav, newNav);
    fs.writeFileSync('src/App.tsx', content, 'utf-8');
    console.log('Nav replaced!');
} else {
    console.log('Nav start pattern not found.');
}
