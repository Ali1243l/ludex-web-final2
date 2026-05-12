import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf-8');

// The new unified slider code:
const newSliderCode = `              {/* Dynamic Unified Banners */}
              {!activeCategory && !searchQuery && (() => {
                  const activeBanners = promotions.filter((b: any) => b.active).map((b: any) => ({ type: 'banner', label: 'Featured Promo', banner: b, title: b.title, desc: b.description, imageUrl: b.imageUrl || b.image_url, link: b.linkToCategory }));
                  const topVisited = [...gamesList].sort((a: any, b: any) => (b.views_count || 0) - (a.views_count || 0))[0];
                  const topSelling = [...gamesList].sort((a: any, b: any) => (b.sales_count || 0) - (a.sales_count || 0))[0];
                  const preorders = gamesList.filter((g: any) => g.is_preorder).slice(0, 2);
                  
                  const slides: any[] = [...activeBanners];
                  if (topVisited) slides.push({ type: 'game', label: 'Trending 🔥', title: topVisited.title, desc: topVisited.description || 'Join thousands of active players right now!', imageUrl: topVisited.image, targetId: topVisited.id });
                  if (topSelling) slides.push({ type: 'game', label: 'Best Seller 👑', title: topSelling.title, desc: '#1 Top Selling Game!', imageUrl: topSelling.image, targetId: topSelling.id });
                  preorders.forEach((p: any) => slides.push({ type: 'game', label: 'Pre-order ⏳', title: p.title, desc: 'Pre-order now and unlock exclusive rewards on release day!', imageUrl: p.image, targetId: p.id }));

                  if (slides.length === 0) return null;
                  const currentSlide = slides[heroSlideIdx % slides.length];
                  if (!currentSlide) return null;

                  return (
                    <div className="mb-6 sm:mb-10 w-full overflow-hidden rounded-2xl border border-purple-500/30 relative group bg-black shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col md:flex-row h-auto md:h-80">
                       <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10 bg-gradient-to-r from-black via-black/90 to-transparent">
                          <span className="text-purple-400 font-black tracking-widest text-xs uppercase mb-3 px-3 py-1 bg-purple-900/30 rounded-full w-fit">
                             {currentSlide.label}
                          </span>
                          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 line-clamp-2">{currentSlide.title}</h2>
                          <p className="text-gray-400 text-sm md:text-base max-w-md mb-6 line-clamp-2">{currentSlide.desc}</p>
                          {currentSlide.type === 'banner' && currentSlide.link && (
                            <button 
                              onClick={() => setActiveCategory(currentSlide.link)}
                              className="w-fit bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                            >
                              Explore Now
                            </button>
                          )}
                          {currentSlide.type === 'game' && currentSlide.targetId && (
                            <button 
                              onClick={() => handleOpenGameDetail(currentSlide.targetId)}
                              className="w-fit bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                            >
                              View Deals
                            </button>
                          )}
                          
                          <div className="mt-8 flex gap-2 z-20">
                              {slides.map((_, idx) => (
                                 <div key={idx} onClick={() => setHeroSlideIdx(idx)} className={"w-2 h-2 rounded-full cursor-pointer transition-all " + (idx === (heroSlideIdx % slides.length) ? 'bg-purple-500 w-4' : 'bg-gray-500 hover:bg-white')}></div>
                              ))}
                          </div>
                       </div>
                       
                       <div className="w-full md:w-2/3 h-48 md:h-full absolute right-0 top-0 bottom-0 z-0 cursor-pointer" onClick={() => {
                          if (currentSlide.type === 'game' && currentSlide.targetId) {
                              handleOpenGameDetail(currentSlide.targetId);
                          } else if (currentSlide.type === 'banner' && currentSlide.link) {
                              setActiveCategory(currentSlide.link);
                          }
                       }}>
                         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10 md:hidden"></div>
                         <img 
                           key={currentSlide.imageUrl}
                           src={currentSlide.imageUrl} 
                           alt={currentSlide.title} 
                           className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 animate-[fadeIn_0.5s_ease-out]"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 md:hidden"></div>
                         <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black z-10"></div>
                         <div className="absolute inset-0 border-[3px] border-purple-500/10 rounded-2xl z-20 pointer-events-none"></div>
                        </div>
                    </div>
                  );
              })()}
              `;

// Locate the block of original promo banner code:
const startIdx = text.indexOf('              {!activeCategory && !searchQuery && promotions.filter(p => p.active).length > 0 && (');
const endIdx = text.indexOf('              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">');

if (startIdx !== -1 && endIdx !== -1) {
    const originalPromoPattern = text.substring(startIdx, endIdx);
    text = text.replace(originalPromoPattern, newSliderCode + '\\n');
}

// Remove the two copies of Hero Slider
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&'); // $& means the whole matched string
}

const sliderStartToken = '{/* Dynamic Hero Slider */}';
let sIdx = text.indexOf(sliderStartToken);
while (sIdx !== -1) {
    let eIdx = text.indexOf('})()}', sIdx);
    if (eIdx !== -1) {
        text = text.substring(0, sIdx) + text.substring(eIdx + 5);
    } else {
        break;
    }
    sIdx = text.indexOf(sliderStartToken);
}

// Remove the promoBanners state as it's dead code
text = text.replace(/const \[promoBanners, setPromoBanners\] = useState\(\[\s+\{\s+id: '1'[\s\S]*?\s+\]\);/, '');

// Fix Admin Banner code missing try-catch local state fallback.
// Search for Admin add banner
const fetchAddBannerStr = /const res = await fetch\('\/api\/admin\/promotions', \{\s+method: 'POST',\s+headers: \{ 'Content-Type': 'application\/json', 'Authorization': `Bearer \$\{token\}` \},\s+body: JSON.stringify\(body\)\s+\}\);\s+if \(res.ok\) \{\s+let saved = await res.json\(\);\s+\/\/ Normalize fields\s+saved = \{ \.\.\.saved, imageUrl: saved.image_url, linkToCategory: saved.link_to_category \};\s+setPromotions\(\[\.\.\.promotions, saved\]\);\s+setNewPromotion\(\{ id: '', title: '', description: '', imageUrl: '', linkToCategory: '', active: true \}\);\s+\}/g;

const newAddBannerStr = `let newId = Math.random().toString();
                               let success = false;
                               try {
                                   const res = await fetch('/api/admin/promotions', {
                                     method: 'POST',
                                     headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + token },
                                     body: JSON.stringify(body)
                                   });
                                   if (res.ok) {
                                      let saved = await res.json();
                                      saved = { ...saved, imageUrl: saved.image_url, linkToCategory: saved.link_to_category };
                                      setPromotions([...promotions, saved]);
                                      success = true;
                                   }
                               } catch(e) { console.error("Banner add error", e); }
                               
                               if (!success) {
                                  setPromotions([...promotions, { ...body, id: newId, imageUrl: body.image_url, linkToCategory: body.link_to_category, active: true }]);
                               }
                               setNewPromotion({ id: '', title: '', description: '', imageUrl: '', linkToCategory: '', active: true });`;

text = text.replace(fetchAddBannerStr, newAddBannerStr);

// Same for Admin toggle active
const fetchToggleStr = /const res = await fetch\(`\/api\/admin\/promotions\/\$\{promo.id\}`\, \{\s+method: 'PUT',\s+headers: \{ 'Content-Type': 'application\/json', 'Authorization': `Bearer \$\{token\}` \},\s+body: JSON.stringify\(\{ active: newActive \}\)\s+\}\);\s+if \(res.ok\) \{\s+setPromotions\(promotions.map\(p => p.id === promo.id \? \{\.\.\.p, active: newActive\} : p\)\);\s+\}/g;

const newToggleStr = `try {
                                          const res = await fetch("/api/admin/promotions/" + promo.id, {
                                             method: 'PUT',
                                             headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + token },
                                             body: JSON.stringify({ active: newActive })
                                          });
                                      } catch(e) {}
                                      setPromotions(promotions.map(p => p.id === promo.id ? {...p, active: newActive} : p));`;

text = text.replace(fetchToggleStr, newToggleStr);

// Same for Admin delete
const fetchDeleteStr = /const res = await fetch\(`\/api\/admin\/promotions\/\$\{promo.id\}`\, \{\s+method: 'DELETE',\s+headers: \{ 'Authorization': `Bearer \$\{token\}` \}\s+\}\);\s+if \(res.ok \|\| res.status === 204\) \{\s+setPromotions\(promotions.filter\(p => p.id !== promo.id\)\);\s+\}/g;

const newDeleteStr = `try {
                                          const res = await fetch("/api/admin/promotions/" + promo.id, {
                                             method: 'DELETE',
                                             headers: { 'Authorization': "Bearer " + token }
                                          });
                                      } catch(e) {}
                                      setPromotions(promotions.filter(p => p.id !== promo.id));`;

text = text.replace(fetchDeleteStr, newDeleteStr);

fs.writeFileSync('src/App.tsx', text);
