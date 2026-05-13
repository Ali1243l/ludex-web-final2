var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_fs = __toESM(require("fs"), 1);
let app = import_fs.default.readFileSync("src/App.tsx", "utf8");
const newGamesData = `const GAMES_DATA = [
  { id: 1, title: "Elden Ring: Shadow of the Erdtree", category: "PC Game Keys", type: "Global Key", originalPrice: 39.99, price: 34.50, stock: 12, rating: 4.8, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg", description: "Venture into the Land of Shadow with the newest expansion. Discover hidden secrets and battle fearsome new bosses." },
  { id: 2, title: "Grand Theft Auto V", category: "Console Subs", type: "PS5 Premium Edition", originalPrice: 39.99, price: 19.99, stock: 150, rating: 4.8, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg", description: "Includes the complete GTAV story experience, Grand Theft Auto Online, and the Criminal Enterprise Starter Pack for PS5." },
  { id: 3, title: "EA SPORTS FC 24", category: "PC Game Keys", type: "Nintendo Switch", originalPrice: 69.99, price: 35.00, stock: 5, rating: 4.2, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900.jpg", description: "A new era for The World's Game on Nintendo Switch: 19,000+ fully licensed players, 700+ teams, and 30+ leagues playing together." },
  { id: 4, title: "Call of Duty: Modern Warfare III", category: "PC Game Keys", type: "Xbox Series X", originalPrice: 69.99, price: 55.00, stock: 18, rating: 4.0, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1938090/library_600x900.jpg", description: "A direct sequel to the record-breaking Call of Duty: Modern Warfare II." },
  { id: 5, title: "PlayStation Plus Deluxe - 12 Months", category: "Console Subs", type: "Subscription", originalPrice: 159.99, price: 135.00, stock: 3, rating: 4.7, image: "https://images.unsplash.com/photo-1606318801954-d46d46d3360a?auto=format&fit=crop&q=80&w=600", description: "Enjoy all PlayStation Plus Essential benefits, access to hundreds of games, and exclusive classic titles." },
  { id: 6, title: "Xbox Game Pass Ultimate - 3 Months", category: "Console Subs", type: "Subscription", originalPrice: 49.99, price: 39.99, stock: 25, rating: 4.9, image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600", description: "Unlimited access to over 100 high-quality console and PC games, plus Xbox Live Gold and EA Play." },
  { id: 7, title: "Cyberpunk 2077: Phantom Liberty", category: "PC Game Keys", type: "Global Key", originalPrice: 29.99, price: 25.50, stock: 50, rating: 4.5, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg", description: "A new spy-thriller adventure for Cyberpunk 2077. Return as cyber-enhanced mercenary V and embark on a high-stakes mission." },
  { id: 8, title: "Baldur's Gate 3", category: "PC Game Keys", type: "Global Key", originalPrice: null, price: 59.99, stock: 22, rating: 5.0, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg", description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival." },
  { id: 9, title: "Hogwarts Legacy", category: "PC Game Keys", type: "Global Key", originalPrice: 59.99, price: 42.50, stock: 8, rating: 4.6, image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900.jpg", description: "An immersive, open-world action RPG set in the world first introduced in the Harry Potter books." },
  { id: 10, title: "Valorant Points (1000 VP) TR", category: "In-game Currency", type: "Riot PIN", originalPrice: null, price: 10.50, stock: 120, rating: 4.9, image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=600", description: "In-game currency to purchase skins, battle passes and Radianite points in Valorant." },
  { id: 11, title: "Steam $50 Gift Card (US)", category: "In-game Currency", type: "Steam Wallet", originalPrice: null, price: 52.00, stock: 0, rating: 4.7, image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=600", description: "Top up your Steam Wallet instantly to buy games, software, and more. Code is delivered instantly upon approval." },
  { id: 12, title: "Roblox 1000 Robux", category: "In-game Currency", type: "Robux", originalPrice: null, price: 9.99, stock: 55, rating: 4.6, image: "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?auto=format&fit=crop&q=80&w=600", description: "Get Robux to purchase upgrades for your avatar or buy special abilities in games." }
];`;
const startIdx = app.indexOf("const GAMES_DATA");
const endIdx = app.indexOf("];", startIdx) + 2;
app = app.substring(0, startIdx) + newGamesData + app.substring(endIdx);
import_fs.default.writeFileSync("src/App.tsx", app);
