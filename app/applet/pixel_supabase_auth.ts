import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf8');

const importSupabase = `import { supabase } from './supabase';\n`;
if (!text.includes(importSupabase)) {
  text = text.replace(`import { t } from './translations';`, `import { t } from './translations';\n${importSupabase}`);
}

const originalAuthLogic = `// Fallback to local mock if server fails or credentials are for local mock
                           if (showAuthModal === 'login') {
                              if (authForm.email === 'AbuHassan_Admin' && authForm.password === 'Admin123!') {
                                 setUserProfile((prev: any) => ({ ...prev, name: 'AbuHassan_Admin', email: 'admin@pixelstore.com', role: 'ADMIN' }));
                                 setIsLoggedIn(true);
                                 setShowAuthModal(null);
                                 setActiveTab('admin');
                                 setToastMessage('Admin Action Required: Backend Auth Failed. Local Admin granted.');
                                 setTimeout(() => setToastMessage(null), 3000);
                              } else {
                                 setToastMessage('Invalid credentials.');
                                 setTimeout(() => setToastMessage(null), 3000);
                              }
                           } else {
                              setUserProfile((prev: any) => ({ ...prev, name: authForm.name || 'New User', email: authForm.email, role: 'CUSTOMER' }));
                              setIsLoggedIn(true);
                              setShowAuthModal(null);
                              setToastMessage('Account created locally.');
                              setTimeout(() => setToastMessage(null), 3000);
                           }`;

const originalSubmitHandler = `onClick={async () => {
                  if (authForm.email && authForm.password) {
                     try {
                        const res = await fetch('/api/auth/login', {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify({ email: authForm.email, password: authForm.password })
                        });
                        
                        if (res.ok) {
                           const data = await res.json();
                           localStorage.setItem('pixel_token', data.token);
                           setUserProfile((prev: any) => ({ ...prev, name: data.user.username, email: authForm.email, role: data.user.role }));
                           setIsLoggedIn(true);
                           setShowAuthModal(null);
                           if (data.user.role === 'ADMIN') {
                              setActiveTab('admin');
                              setToastMessage('Admin Access Granted. Welcome to HQ.');
                           } else {
                              setToastMessage(showAuthModal === 'login' ? 'Successfully logged in.' : 'Account created.');
                           }
                           setTimeout(() => setToastMessage(null), 3000);
                        } else {
${originalAuthLogic}
                        }
                     } catch (error) {
                        setToastMessage('Server error during login.');
                        setTimeout(() => setToastMessage(null), 3000);
                     }
                  }
                }}`;


const newSubmitHandler = `onClick={async () => {
                  if (authForm.email && authForm.password) {
                     try {
                        if (showAuthModal === 'login') {
                           const { data, error } = await supabase.auth.signInWithPassword({
                              email: authForm.email,
                              password: authForm.password,
                           });
                           if (error) throw error;
                           setIsLoggedIn(true);
                           setShowAuthModal(null);
                           setToastMessage('Successfully logged in.');
                           setTimeout(() => setToastMessage(null), 3000);
                        } else {
                           const { data, error } = await supabase.auth.signUp({
                              email: authForm.email,
                              password: authForm.password,
                              options: {
                                data: {
                                  full_name: authForm.name || 'Pixel User',
                                }
                              }
                           });
                           if (error) throw error;
                           setIsLoggedIn(true);
                           setShowAuthModal(null);
                           setToastMessage('Account created successfully!');
                           setTimeout(() => setToastMessage(null), 3000);
                        }
                     } catch (error: any) {
                        setToastMessage(error.message || 'Authentication error.');
                        setTimeout(() => setToastMessage(null), 3000);
                     }
                  }
                }}`;

text = text.replace(originalSubmitHandler, newSubmitHandler);

// Add google login button inside the modal, after the main button
const mainBtnClose = `{showAuthModal === 'login' ? t[language].authenticate : t[language].registerNow}\n              </button>`;
const newBtns = `{showAuthModal === 'login' ? t[language].authenticate : t[language].registerNow}\n              </button>\n              <div className="relative flex items-center py-2">\n                <div className="flex-grow border-t border-gray-800"></div>\n                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-bold uppercase">OR</span>\n                <div className="flex-grow border-t border-gray-800"></div>\n              </div>\n              <button onClick={async () => { const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' }); if(error) setToastMessage(error.message); }} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">\n                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />\n                {showAuthModal === 'login' ? 'Sign in with Google' : 'Sign up with Google'}\n              </button>`;

text = text.replace(mainBtnClose, newBtns);

fs.writeFileSync('src/App.tsx', text);
