import fs from 'fs';

let text = fs.readFileSync('src/App.tsx', 'utf8');

// Insert after the other useEffect calls
const authEffect = `\n  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUserProfile((prev: any) => ({ ...prev, email: session.user.email, name: session.user.user_metadata?.full_name || 'Pixel User' }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUserProfile((prev: any) => ({ ...prev, email: session.user.email, name: session.user.user_metadata?.full_name || 'Pixel User' }));
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);\n`;

const targetAnchor = `useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);`;

if(!text.includes('supabase.auth.getSession') && text.includes(targetAnchor)){
   text = text.replace(targetAnchor, targetAnchor + authEffect);
}

// Add sign-out logic to the existing sign out buttons
const oldLogout = `onClick={() => {\n                        setIsLoggedIn(false);\n                        setUserProfile({ name: '', email: '', role: 'GUEST', xp: 0, loyaltyPoints: 0, avatar: null });\n                        setIsProfileOpen(false);\n                        setActiveTab('store');\n                      }}`;
const newLogout = `onClick={async () => {\n                        await supabase.auth.signOut();\n                        setIsLoggedIn(false);\n                        setUserProfile({ name: '', email: '', role: 'GUEST', xp: 0, loyaltyPoints: 0, avatar: null });\n                        setIsProfileOpen(false);\n                        setActiveTab('store');\n                      }}`;

// Also for mobile logout
const oldMobileLogout = `onClick={() => {\n                     setIsLoggedIn(false);\n                     setIsMobileMenuOpen(false);\n                     setActiveTab('store');\n                  }}`;
const newMobileLogout = `onClick={async () => {\n                     await supabase.auth.signOut();\n                     setIsLoggedIn(false);\n                     setIsMobileMenuOpen(false);\n                     setActiveTab('store');\n                  }}`;

text = text.replace(oldLogout, newLogout).replace(oldMobileLogout, newMobileLogout);

fs.writeFileSync('src/App.tsx', text);
