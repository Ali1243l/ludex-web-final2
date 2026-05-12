import fs from 'fs';

let text = fs.readFileSync('src/translations.ts', 'utf-8');

text = text.replace(/status: "System Status: Optimal", /g, 'statusMsg: "System Status: Optimal", ');
text = text.replace(/save: "Save Changes", /g, 'saveChanges: "Save Changes", ');
text = text.replace(/profile: "Profile", /g, 'profileMenu: "Profile", ');

text = text.replace(/status: "حالة النظام: مثالية", /g, 'statusMsg: "حالة النظام: مثالية", ');
text = text.replace(/save: "حفظ", /g, 'saveChanges: "حفظ التغييرات", ');
text = text.replace(/profile: "الملف الشخصي", /g, 'profileMenu: "الملف الشخصي", ');

fs.writeFileSync('src/translations.ts', text);
