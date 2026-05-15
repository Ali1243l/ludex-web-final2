import React, { useState } from 'react';
import { signIn, signUp, signInWithRedirect } from 'aws-amplify/auth';
import { X, CheckCircle2 } from 'lucide-react';
import { t } from './translations';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  language: 'en' | 'ar';
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ initialMode, language, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const { email, password, name } = authForm;
    if (!email || !password || (mode === 'register' && !name.trim())) {
      setErrorMsg(language === 'ar' ? 'يرجى إكمال جميع الحقول' : 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        console.log('[Auth] Attempting signIn');
        await signIn({ username: email, password });
        console.log('[Auth] signIn successful');
        onSuccess();
      } else {
        console.log('[Auth] Attempting signUp');
        const { isSignUpComplete } = await signUp({
          username: email,
          password: password,
          options: {
            userAttributes: {
              email: email,
              name: name.trim()
            }
          }
        });
        
        console.log('[Auth] signUp complete:', isSignUpComplete);
        if (isSignUpComplete) {
          console.log('[Auth] Attempting auto signIn after signUp');
          await signIn({ username: email, password });
          console.log('[Auth] auto signIn successful');
          onSuccess();
        } else {
           setErrorMsg(language === 'ar' ? 'يرجى تأكيد بريدك الإلكتروني' : 'Please confirm your email address.');
           setMode('login');
        }
      }
    } catch (err: any) {
      console.error('[Auth Error]', err);
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('[Auth] Attempting Google OAuth');
    signInWithRedirect({ provider: 'Google' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-[#111] border border-purple-900/40 rounded-2xl w-full max-w-sm shadow-[0_0_50px_rgba(147,51,234,0.3)] flex flex-col overflow-hidden animate-in fade-in duration-200">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
          <h2 className="text-lg font-bold text-white uppercase tracking-widest">
            {mode === 'login' ? t[language].systemLogin : t[language].systemRegister}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errorMsg && (
             <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded font-bold uppercase text-center">
                {errorMsg}
             </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Full Name</label>
              <input 
                type="text" 
                value={authForm.name} 
                onChange={e => setAuthForm({...authForm, name: e.target.value})} 
                className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" 
                placeholder="Felix User" 
                disabled={loading}
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-1">{t[language].eml}</label>
            <input 
              type="email" 
              value={authForm.email} 
              onChange={e => setAuthForm({...authForm, email: e.target.value})} 
              className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" 
              placeholder="admin@pixel.com" 
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase text-gray-500 font-bold mb-1">{t[language].passwordUpper}</label>
            <input 
              type="password" 
              value={authForm.password} 
              onChange={e => setAuthForm({...authForm, password: e.target.value})} 
              className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 text-white" 
              placeholder="••••••••" 
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 font-bold text-white py-3 rounded-lg hover:bg-purple-500 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : (mode === 'login' ? t[language].authenticate : t[language].registerNow)}
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-bold uppercase">OR</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>
          
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
          </button>

          <div className="text-center mt-2">
            <button 
              type="button"
              disabled={loading}
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrorMsg(null);
              }} 
              className="text-xs text-gray-400 hover:text-purple-400 transition-colors disabled:opacity-50"
            >
              {mode === 'login' ? (language === 'ar' ? 'ليس لديك حساب؟ إنشاء حساب' : "Don't have an account? Register") : (language === 'ar' ? 'لديك حساب بالفعل؟ تسجيل الدخول' : "Already have an account? Login")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
