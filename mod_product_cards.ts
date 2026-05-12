import fs from 'fs';
let text = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Change grid classes 
// original: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full
text = text.replace(
  'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full',
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 w-full'
);

// 2. Adjust Product Card Image Height
// original: <div className={\`h-48 bg-gradient-to-br \${game.theme} relative rounded-t-2xl overflow-hidden\`}>
text = text.replace(
  /<div className=\{\`h-48 bg-gradient-to-br \$\{game\.theme\} relative rounded-t-2xl overflow-hidden\`\}>/g,
  '<div className={`aspect-[3/4] sm:aspect-[4/5] bg-gradient-to-br ${game.theme} relative rounded-t-2xl sm:rounded-t-2xl overflow-hidden`}>'
);

// 3. Make card content padding smaller on mobile
text = text.replace(
  'div className="p-5 flex flex-col flex-1 z-10 -mt-10"',
  'div className="p-3 sm:p-5 flex flex-col flex-1 z-10 -mt-8 sm:-mt-10"'
);

// 4. Adjust the title size on mobile
text = text.replace(
  '<h3 className="text-lg font-black text-white leading-tight mb-2 truncate">{product.name}</h3>',
  '<h3 className="text-sm sm:text-lg font-black text-white leading-tight mb-1 sm:mb-2 line-clamp-2 sm:truncate">{product.name}</h3>'
);
text = text.replace(
  '<h4 className="font-bold text-base leading-tight text-gray-100 group-hover:text-purple-400 transition-colors uppercase">{game.title}</h4>',
  '<h4 className="font-bold text-xs sm:text-base leading-tight text-gray-100 group-hover:text-purple-400 transition-colors uppercase line-clamp-2">{game.title}</h4>'
);

// 5. Adjust tags text on mobile
text = text.replace(
  '<p className="text-[11px] text-gray-500 mb-6">{game.tags}</p>',
  '<p className="text-[9px] sm:text-[11px] text-gray-500 mb-3 sm:mb-6 line-clamp-1">{game.tags}</p>'
);

// 6. Shopping cart icon on the product card
text = text.replace(
  '<button title={t[language].addToCart} disabled={!game.stock || game.stock === 0} onClick={() => addToCart(game.id)} className="min-w-[44px] min-h-[44px] flex items-center justify-center p-3 sm:p-2 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg transition-colors disabled:opacity-50 group-hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]">',
  '<button title={t[language].addToCart} disabled={!game.stock || game.stock === 0} onClick={(e) => { e.stopPropagation(); addToCart(game.id); }} className="min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center p-2 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-lg transition-colors disabled:opacity-50 group-hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]">'
);
text = text.replace(
  '<ShoppingCart className="w-5 h-5 sm:w-4 sm:h-4" />',
  '<ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />'
);

// 7. Adjust prices on mobile
text = text.replace(
  '<span className="text-xl font-black text-green-400 font-mono shadow-green-500/20 drop-shadow-lg">${product.discountPrice}</span>',
  '<span className="text-base sm:text-xl font-black text-green-400 font-mono shadow-green-500/20 drop-shadow-lg">${product.discountPrice}</span>'
);
text = text.replace(
  '<span className="text-xl font-black text-white font-mono drop-shadow-lg">${product.sellingPrice}</span>',
  '<span className="text-base sm:text-xl font-black text-white font-mono drop-shadow-lg">${product.sellingPrice}</span>'
);

text = text.replace(
  '<span className="text-lg font-black text-white tracking-widest">{displayPrice(game.price)}</span>',
  '<span className="text-sm sm:text-lg font-black text-white tracking-widest">{displayPrice(game.price)}</span>'
);

text = text.replace(
  '<span className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1 drop-shadow-md">{product.category}</span>',
  '<span className="text-[9px] sm:text-xs text-purple-400 font-bold uppercase tracking-wider mb-1 drop-shadow-md line-clamp-1">{product.category}</span>'
);

// For the store Product Card Type Badge
text = text.replace(
  '<div className={`absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase border ${game.badgeColor}`}>',
  '<div className={`absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-black/80 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[8px] sm:text-[10px] font-bold uppercase border ${game.badgeColor} max-w-[80%] truncate`}>'
);

// And we fix the Promo banner dimensions
text = text.replace(
  'className="mb-10 w-full overflow-hidden rounded-2xl border border-purple-500/30 relative group bg-black shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col md:flex-row h-auto md:h-80"',
  'className="mb-6 sm:mb-10 w-full overflow-hidden rounded-2xl border border-purple-500/30 relative group bg-black shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col md:flex-row h-auto md:h-80"'
);

fs.writeFileSync('src/App.tsx', text);
