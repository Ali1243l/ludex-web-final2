import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Update approveOrder
const oldApproveOrder = `  const approveOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { 
        ...o, 
        status: 'Approved', 
        gameKey: 'PIXEL-' + Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        approvedAt: new Date().toISOString()
      } : o
    ));
  };`;

const newApproveOrder = `  const approveOrder = (orderId: string) => {
    const orderToApprove = orders.find(o => o.id === orderId);
    if (orderToApprove) {
      setUserProfile(prev => ({...prev, xp_points: prev.xp_points + Math.floor((orderToApprove.finalPrice || orderToApprove.amount) * 10) }));
    }
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { 
        ...o, 
        status: 'Approved', 
        gameKey: 'PIXEL-' + Math.random().toString(36).substr(2, 4).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        approvedAt: new Date().toISOString()
      } : o
    ));
  };`;

text = text.replace(oldApproveOrder, newApproveOrder);

// 2. Loyalty logic function above return
const loyaltyLogic = `
  const getTier = (xp: number) => {
    if (xp < 1000) return { name: 'Bronze', color: 'text-orange-400', threshold: 1000 };
    if (xp < 5000) return { name: 'Silver', color: 'text-gray-300', threshold: 5000 };
    if (xp < 10000) return { name: 'Gold', color: 'text-yellow-400', threshold: 10000 };
    return { name: 'Diamond', color: 'text-cyan-400', threshold: xp };
  };
  const currentTier = getTier(userProfile.xp_points || 0);
  const xpPercentage = currentTier.name === 'Diamond' ? 100 : Math.min(((userProfile.xp_points || 0) / currentTier.threshold) * 100, 100);
`;
text = text.replace('  return (', loyaltyLogic + '\n  return (');

// 3. Pixel Elite Gamer Card UI replacement
const oldLoyaltySection = `{/* Loyalty Card Engine */}
              <h3 className="text-xl font-bold text-white mt-4 tracking-widest uppercase flex items-center gap-2">
                 <Zap className="w-5 h-5 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                 {t[language].loyaltyDashboard}
              </h3>
              <div className="bg-[#0a0a0a] border border-purple-500/30 rounded-2xl p-6 lg:p-8 relative overflow-hidden group shadow-[0_0_30px_rgba(147,51,234,0.1)]">
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent pointer-events-none"></div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                       <h4 className="text-lg font-black text-white uppercase tracking-wider mb-2">PIXEL Elite Card</h4>
                       <p className="text-sm text-gray-400 max-w-md">Your progress towards the next loyalty reward. Connected live to Pixel Store ERP.</p>
                    </div>
                    <button onClick={() => setToastMessage('Exporting Loyalty Card... Please wait.')} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600/20 text-purple-400 border border-purple-500 hover:bg-purple-600 hover:text-white transition-all rounded-lg text-xs font-bold uppercase tracking-widest">
                       <Download className="w-4 h-4" /> Export Card
                    </button>
                 </div>

                 <div className="mt-10 flex items-center justify-between relative max-w-2xl mx-auto">
                    {/* Progress Bar Line */}
                    <div className="absolute left-0 right-0 h-1 bg-gray-800 top-1/2 -translate-y-1/2 z-0 rounded-full">
                       <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_#a855f7]" 
                          style={{ width: \`\${Math.min((approvedOrdersCount % loyaltyThreshold) / (loyaltyThreshold - 1) * 100, 100)}%\` }}
                       ></div>
                    </div>

                    {/* Steps mapping based on loyaltyThreshold */}
                    {Array.from({ length: loyaltyThreshold }).map((_, i) => {
                       const isCompleted = (approvedOrdersCount % loyaltyThreshold) > i || (approvedOrdersCount > 0 && (approvedOrdersCount % loyaltyThreshold) === 0);
                       const isFinalStep = i === loyaltyThreshold - 1;
                       const isActive = (approvedOrdersCount % loyaltyThreshold) === i;

                       return (
                          <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                             <div className={\`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 \${
                                isCompleted 
                                ? 'bg-purple-600 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)] text-white scale-110' 
                                : isActive 
                                   ? 'bg-[#111] border-purple-400 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse-glow'
                                   : 'bg-[#111] border-gray-800 text-gray-600'
                             }\`}>
                                {isFinalStep ? (
                                   <Gift className={\`w-5 h-5 \${isCompleted ? 'text-white' : isActive ? 'text-purple-400' : 'text-gray-600'}\`} />
                                ) : isCompleted ? (
                                   <Check className="w-5 h-5 text-white" />
                                ) : (
                                   <span className="font-bold">{i + 1}</span>
                                )}
                             </div>
                             <div className="absolute -bottom-8 whitespace-nowrap">
                                <span className={\`text-[10px] uppercase font-bold tracking-widest \${isCompleted || isActive ? 'text-purple-400' : 'text-gray-600'}\`}>
                                   {isFinalStep ? 'Reward' : \`Purchase \${i + 1}\`}
                                </span>
                             </div>
                          </div>
                       );
                    })}
                 </div>
                 
                 <div className="mt-16 text-center">
                    {isEligibleForLoyaltyDiscount ? (
                       <p className="text-green-400 text-sm font-bold animate-pulse">🎉 Congratulations! {loyaltyDiscountPercent}% Discount unlocked for your next purchase.</p>
                    ) : (
                       <p className="text-gray-500 text-xs uppercase tracking-widest">Only {loyaltyThreshold - (approvedOrdersCount % loyaltyThreshold)} purchase(s) away from your next discount.</p>
                    )}
                 </div>
              </div>`;

const newLoyaltySection = `{/* Pixel Elite Gamer Card */}
              <h3 className="text-xl font-bold text-white mt-4 tracking-widest uppercase flex items-center gap-2">
                 <Zap className="w-5 h-5 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                 Pixel Elite Loyalty
              </h3>
              <div className="bg-[#0a0a0a] border border-purple-500/30 rounded-2xl p-6 lg:p-8 relative overflow-hidden group shadow-[0_0_30px_rgba(147,51,234,0.1)]">
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent pointer-events-none"></div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="flex-1 w-full">
                       <div className="flex items-center gap-4 mb-3">
                          <h4 className="text-lg font-black text-white uppercase tracking-wider">PIXEL Elite Card</h4>
                          <span className={\`px-3 py-1 bg-black border border-gray-800 rounded-full font-bold text-[10px] uppercase tracking-widest \${currentTier.color}\`}>
                             {currentTier.name} Tier
                          </span>
                       </div>
                       <p className="text-sm text-gray-400 mb-6 max-w-md">Earn 10 XP for every $1 spent. Unlock exclusive rewards by reaching higher tiers!</p>
                       
                       <div className="mb-2 flex justify-between items-end">
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">XP Progress</span>
                         <span className="text-xs font-bold text-purple-400">{userProfile.xp_points || 0} / {currentTier.name === 'Diamond' ? 'MAX' : currentTier.threshold} XP</span>
                       </div>
                       {/* Progress Bar Line */}
                       <div className="h-2 bg-gray-800 rounded-full w-full max-w-2xl relative overflow-hidden">
                          <div 
                             className={\`absolute top-0 bottom-0 left-0 bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-1000 shadow-[0_0_15px_#a855f7]\`} 
                             style={{ width: \`\${xpPercentage}%\`, right: language === 'ar' ? 0 : 'auto', left: language === 'ar' ? 'auto' : 0 }}
                          ></div>
                       </div>
                    </div>

                    <button onClick={() => setToastMessage('Exporting Gamer Card... Please wait.')} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600/20 text-purple-400 border border-purple-500 hover:bg-purple-600 hover:text-white transition-all rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                       <Download className="w-4 h-4" /> Export Card
                    </button>
                 </div>
              </div>`;

text = text.replace(oldLoyaltySection, newLoyaltySection);

// 4. Secure Vault Digital Keys section
const oldOrderHistory = `<td className="px-6 py-4 font-mono text-xs text-purple-400 font-bold">
                            {order.status === 'Approved' ? order.gameKey : '---'}
                          </td>`;

const newOrderHistory = `<td className="px-6 py-4 font-mono text-xs text-purple-400 font-bold">
                            {order.status === 'Approved' ? (
                               <div className="flex items-center gap-3">
                                  <span className="blur-sm hover:blur-none transition-all duration-300 cursor-pointer select-all px-2 py-1 bg-purple-900/20 rounded border border-purple-500/20">
                                     {order.gameKey}
                                  </span>
                                  <button onClick={() => { navigator.clipboard.writeText(order.gameKey || ''); setToastMessage('Key Copied to Clipboard!'); }} className="text-gray-400 hover:text-white" title="Copy to Clipboard">
                                    <svg xmlns="http://www.w0.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                  </button>
                               </div>
                            ) : '---'}
                          </td>`;

text = text.replace(oldOrderHistory, newOrderHistory);

// Replace "Order History" header to "Secure Digital Vault"
text = text.replace('{t[language].orderHistory}', 'Secure Digital Vault (My Keys)');

// 5. Enhanced Settings section
const oldSettingsContent = `                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].eml}</label>
                  <input 
                    type="email" 
                    value={userProfile.email}
                    onChange={e => setUserProfile({...userProfile, email: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].pwd}</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors" />
                </div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-colors mt-2 self-start shadow-[0_0_15px_rgba(147,51,234,0.2)]">
                  {t[language].save}
                </button>
              </form>
            </div>`;

const newSettingsContent = `                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].eml}</label>
                  <input 
                    type="email" 
                    value={userProfile.email}
                    onChange={e => setUserProfile({...userProfile, email: e.target.value})}
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t[language].pwd}</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors" />
                </div>
                
                <div className="pt-4 border-t border-gray-800 mt-2">
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Preferences</h3>
                  
                  <div className="flex flex-col gap-4">
                     <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Platform Preference</label>
                       <select value={userProfile.platformPreference} onChange={e => setUserProfile({...userProfile, platformPreference: e.target.value})} className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white cursor-pointer">
                          <option value="PC">PC</option>
                          <option value="PlayStation">PlayStation</option>
                          <option value="Xbox">Xbox</option>
                          <option value="Nintendo">Nintendo</option>
                       </select>
                     </div>
                     
                     <div>
                       <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Favorite Genres (Comma separated)</label>
                       <input 
                         type="text" 
                         value={userProfile.favoriteGenres.join(', ')}
                         onChange={e => setUserProfile({...userProfile, favoriteGenres: e.target.value.split(',').map(s => s.trim())})}
                         placeholder="Action, RPG, FPS..."
                         className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white transition-colors" 
                       />
                     </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800 mt-2">
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Security & Notifications</h3>
                  
                  <div className="flex items-center justify-between mb-4 bg-black p-4 rounded-lg border border-gray-800">
                     <div>
                        <p className="text-sm font-bold text-white">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive order updates and promos.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" checked={userProfile.emailNotifications} onChange={e => setUserProfile({...userProfile, emailNotifications: e.target.checked})} className="sr-only peer" />
                       <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                     </label>
                  </div>
                  
                  <div className="flex items-center justify-between bg-black p-4 rounded-lg border border-gray-800">
                     <div>
                        <p className="text-sm font-bold text-white">Two-Factor Auth (2FA)</p>
                        <p className="text-xs text-gray-500">Protect your account with extra security.</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" checked={userProfile.twoFactorEnabled} onChange={e => setUserProfile({...userProfile, twoFactorEnabled: e.target.checked})} className="sr-only peer" />
                       <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                     </label>
                  </div>
                </div>

                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-colors mt-4 self-start shadow-[0_0_15px_rgba(147,51,234,0.2)]">
                  {t[language].save}
                </button>
              </form>
            </div>`;

text = text.replace(oldSettingsContent, newSettingsContent);

fs.writeFileSync('src/App.tsx', text);
