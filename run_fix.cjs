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
const oldImageContainer = "h-64 sm:h-72 bg-gray-900 relative rounded-t-xl overflow-hidden";
const fluidImageContainer = "aspect-[3/4] sm:aspect-[2/3] bg-[#0a0a0a] relative rounded-t-xl overflow-hidden";
text = text.replace(oldImageContainer, fluidImageContainer);
const oldSkeletonContainer = "h-64 sm:h-72 bg-gray-800/20 relative";
const fluidSkeletonContainer = "aspect-[3/4] sm:aspect-[2/3] bg-gray-800/20 relative";
text = text.replace(oldSkeletonContainer, fluidSkeletonContainer);
const cardClass = `className="group bg-[#151515] border border-transparent rounded-xl flex flex-col h-full hover:border-[#bc13fe] transition-all duration-300 hover:shadow-[0_0_10px_rgba(188,19,254,0.4)] relative overflow-hidden transform hover:-translate-y-1"`;
const animatedCardClass = `className="group bg-[#151515] border border-transparent rounded-xl flex flex-col h-full hover:border-[#bc13fe] transition-all duration-300 hover:shadow-[0_0_10px_rgba(188,19,254,0.4)] relative overflow-hidden transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both" style={{ animationDelay: \`\${(game.id % 10) * 50}ms\` }}"`;
import_fs.default.writeFileSync("src/App.tsx", text);
