import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf-8');

const oldGlobalSettings = `const [globalSettings, setGlobalSettings] = useState({
     currencyRate: 1500,
     storeName: "Ludex Store",
     contactEmail: "support@ludexstore.com",
     contactPhone: "0770 123 4567"
  });`;
const newGlobalSettings = `const [globalSettings, setGlobalSettings] = useState({
     currencyRate: 1500,
     storeName: "Ludex Store",
     contactEmail: "support@ludexstore.com",
     contactPhone: "0770 123 4567",
     xpMultiplier: 10
  });`;

text = text.replace(oldGlobalSettings, newGlobalSettings);

// Loyalty XP modifier
const oldXpMath = `prev.xp_points + Math.floor((orderToApprove.finalPrice || orderToApprove.amount) * 10)`;
const newXpMath = `prev.xp_points + Math.floor((orderToApprove.finalPrice || orderToApprove.amount) * globalSettings.xpMultiplier)`;
text = text.replace(oldXpMath, newXpMath);

const oldXpText = `Earn 10 XP for every $1 spent`;
const newXpText = `Earn {globalSettings.xpMultiplier} XP for every $1 spent`;
text = text.replace(oldXpText, newXpText);

// Settings UI modification to include logic fields
// Search for "Store Name" in settings
const findSettingsUI = `<label className="block text-xs uppercase text-gray-500 mb-2 font-bold">Store Name</label>`;
const replaceSettingsUI = `<label className="block text-xs uppercase text-gray-500 mb-2 font-bold">Store Name</label>`;

text = text.replace(
  `{editingSettings ? (
                        <input type="text" value={globalSettings.storeName} onChange={e => setGlobalSettings({...globalSettings, storeName: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white font-bold">{globalSettings.storeName}</p>
                      )}
                    </div>`,
  `{editingSettings ? (
                        <input type="text" value={globalSettings.storeName} onChange={e => setGlobalSettings({...globalSettings, storeName: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white font-bold">{globalSettings.storeName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-500 mb-2 font-bold">{t[language].xpRate || 'XP Multiplier'}</label>
                      {editingSettings ? (
                        <input type="number" value={globalSettings.xpMultiplier} onChange={e => setGlobalSettings({...globalSettings, xpMultiplier: Number(e.target.value)})} className="w-full bg-black border border-gray-700 rounded p-2 text-white" />
                      ) : (
                        <p className="text-white font-bold">{globalSettings.xpMultiplier} XP per USD</p>
                      )}
                    </div>`
);

fs.writeFileSync('src/App.tsx', text);
