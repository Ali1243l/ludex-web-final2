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
let text = import_fs.default.readFileSync("src/App.tsx", "utf8");
const originalCard = `group bg-[#0d0d0d] border border-purple-900/20 rounded-2xl flex flex-col h-full hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:-translate-y-1`;
const newCard = `group bg-[#151515] border border-transparent rounded-xl flex flex-col h-full hover:border-[#bc13fe] transition-all duration-300 hover:shadow-[0_0_10px_rgba(188,19,254,0.4)] relative overflow-hidden transform hover:-translate-y-1`;
text = text.replace(originalCard, newCard);
const originalImageContainer = `aspect-[3/4] sm:aspect-[4/5] bg-gradient-to-br \${game.theme} relative rounded-t-2xl sm:rounded-t-2xl overflow-hidden`;
const newImageContainer = `h-64 sm:h-72 bg-gray-900 relative rounded-t-xl overflow-hidden`;
text = text.replace(originalImageContainer, newImageContainer);
const originalImageExt = `className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:opacity-80 transition-opacity"`;
const newImageExt = `className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"`;
text = text.replace(originalImageExt, newImageExt);
const textLowerOriginal = `<div className="p-3 sm:p-5 flex-1 flex flex-col justify-between items-stretch">`;
const textLowerNew = `<div className="p-4 flex-1 flex flex-col justify-between items-stretch z-10 bg-[#151515]">`;
text = text.replace(textLowerOriginal, textLowerNew);
const originalSubtitle = `<p className="text-[9px] sm:text-[11px] text-gray-500 mb-3 sm:mb-6 line-clamp-1">{game.tags}</p>`;
const newSubtitle = `<div className="flex items-center gap-2 mb-3 text-gray-400 mt-1">
  {game.category.includes('Console') || game.type.includes('PS5') || game.type.includes('Xbox') || game.type.includes('Nintendo') ? <Gamepad2 className="w-3 h-3 text-gray-500" /> : <Monitor className="w-3 h-3 text-gray-500" />}
  <p className="text-[10px] uppercase font-bold tracking-wider">{game.type}</p>
</div>`;
text = text.replace(originalSubtitle, newSubtitle);
const originalButton = `className="bg-white text-black text-[10px] sm:text-xs font-bold px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg hover:bg-gray-200 transition-all active:scale-95 shadow-[0_4px_10px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_15px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap"`;
const newButton = `className="bg-white text-black text-[10px] sm:text-xs font-bold px-3 sm:px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all active:scale-95 md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_4px_10px_rgba(255,255,255,0.1)]"`;
text = text.replace(originalButton, newButton);
const skeletonOld = `<div className="aspect-[3/4] sm:aspect-[4/5] bg-gray-800/20 relative"></div>`;
const skeletonNew = `<div className="h-64 sm:h-72 bg-gray-800/20 relative"></div>`;
text = text.replace(skeletonOld, skeletonNew);
const skeletonParentOld = `<div key={i} className="bg-[#151515] border border-gray-800 rounded-2xl flex flex-col h-full animate-skeleton overflow-hidden">`;
const skeletonParentNew = `<div key={i} className="bg-[#151515] border border-gray-800 rounded-xl flex flex-col h-full animate-skeleton overflow-hidden">`;
text = text.replace(skeletonParentOld, skeletonParentNew);
import_fs.default.writeFileSync("src/App.tsx", text);
