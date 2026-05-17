import * as fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add States
const stateSearch = `  const [isFilterOpen, setIsFilterOpen] = useState(false);`;
const stateReplace = `  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");`;
content = content.replace(stateSearch, stateReplace);

// 2. Add dependencies and logic to filteredGames
const filterSearch = `  const filteredGames = useMemo(() => {
    let result = gamesList.filter((game) => {
      const matchesSearch = game.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory
        ? game.category === activeCategory
        : true;
      return matchesSearch && matchesCategory;
    });`;

const filterReplace = `  const filteredGames = useMemo(() => {
    let result = gamesList.filter((game) => {
      const matchesSearch = game.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory
        ? game.category === activeCategory
        : true;
        
      let matchesPlatform = true;
      if (platformFilter !== "all") {
          matchesPlatform = game.platform === platformFilter || game.platform?.toLowerCase().includes(platformFilter);
      }
      
      let matchesPrice = true;
      const originalPrice = game.price; 
      // Need to compare assuming $ as base or use the actual amount, currently games are in USD? We have to check actual price.
      // game.price seems to be in USD in DB? Wait, games prices are in USD. (e.g. 59.99)
      if (priceRange === "under_20") matchesPrice = originalPrice < 20;
      else if (priceRange === "20_50") matchesPrice = originalPrice >= 20 && originalPrice <= 50;
      else if (priceRange === "over_50") matchesPrice = originalPrice > 50;

      return matchesSearch && matchesCategory && matchesPlatform && matchesPrice;
    });`;
content = content.replace(filterSearch, filterReplace);

// 3. Update useEffect deps for filteredGames:
const depsSearch = `}, [searchQuery, activeCategory, sortBy, gamesList]);`;
const depsReplace = `}, [searchQuery, activeCategory, sortBy, gamesList, platformFilter, priceRange]);`;
content = content.replace(depsSearch, depsReplace);

// 4. Update the select inputs
// First replace for platform
const platformSearch = `<label className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                {language === "ar" ? "المنصة" : "Platform"}
                              </label>
                              <select
                                className="bg-[`;
const platformReplace = `<label className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                {language === "ar" ? "المنصة" : "Platform"}
                              </label>
                              <select
                                value={platformFilter}
                                onChange={(e) => setPlatformFilter(e.target.value)}
                                className="bg-[`;
content = content.replace(platformSearch, platformReplace);

// Second replace for price
const priceSearch = `<label className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                {language === "ar"
                                  ? "نطاق السعر"
                                  : "Price Range"}
                              </label>
                              <select
                                className="bg-[`;
const priceReplace = `<label className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                {language === "ar"
                                  ? "نطاق السعر"
                                  : "Price Range"}
                              </label>
                              <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="bg-[`;
content = content.replace(priceSearch, priceReplace);

// 5. Provide key back for react 
const keySearch = `key={\`\${activeCategory}-\${searchQuery}-\${sortBy}\`}`;
const keyReplace = `key={\`\${activeCategory}-\${searchQuery}-\${sortBy}-\${platformFilter}-\${priceRange}\`}`;
content = content.replace(keySearch, keyReplace);

fs.writeFileSync('src/App.tsx', content);
