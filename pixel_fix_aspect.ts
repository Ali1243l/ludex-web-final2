import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf8');

const oldImageContainer = "h-64 sm:h-72 bg-gray-900 relative rounded-t-xl overflow-hidden";
const fluidImageContainer = "aspect-[3/4] sm:aspect-[2/3] bg-[#0a0a0a] relative rounded-t-xl overflow-hidden";

text = text.replace(oldImageContainer, fluidImageContainer);

const oldSkeletonContainer = "h-64 sm:h-72 bg-gray-800/20 relative";
const fluidSkeletonContainer = "aspect-[3/4] sm:aspect-[2/3] bg-gray-800/20 relative";

text = text.replace(oldSkeletonContainer, fluidSkeletonContainer);

// Also we should ensure animation on grid item render.
// I can add `animate-in fade-in slide-in-from-bottom-5 duration-500` to the card, maybe with a stagger, but just `animate-in` is fine.
const cardClass = `className="group bg-[#151515] border border-transparent rounded-xl flex flex-col h-full hover:border-[#bc13fe] transition-all duration-300 hover:shadow-[0_0_10px_rgba(188,19,254,0.4)] relative overflow-hidden transform hover:-translate-y-1"`;
const animatedCardClass = `className="group bg-[#151515] border border-transparent rounded-xl flex flex-col h-full hover:border-[#bc13fe] transition-all duration-300 hover:shadow-[0_0_10px_rgba(188,19,254,0.4)] relative overflow-hidden transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both" style={{ animationDelay: \`\${(game.id % 10) * 50}ms\` }}"`;
// I will replace it directly manually
fs.writeFileSync('src/App.tsx', text);
