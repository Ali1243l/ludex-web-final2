import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp, resetPassword, confirmResetPassword, signInWithRedirect, resendSignUpCode } from 'aws-amplify/auth';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { t } from './translations';

type AuthMode = 'login' | 'register' | 'confirm_register' | 'forgot_password' | 'confirm_password';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  language: 'en' | 'ar';
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ initialMode, language, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', code: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isRTL = language === 'ar';

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const { email, password, name, code, newPassword } = authForm;

    try {
      setLoading(true);

      if (mode === 'login') {
        if (!email || !password) throw new Error(isRTL ? 'يرجى إكمال جميع الحقول' : 'Please fill all fields');
        if (!validateEmail(email)) throw new Error(isRTL ? 'البريد الإلكتروني غير صالح' : 'Invalid email format');
        
        console.log('[Auth] Attempting signIn');
        await signIn({ username: email, password });
        console.log('[Auth] signIn successful');
        onSuccess();
      } 
      
      else if (mode === 'register') {
        if (!email || !password || !name.trim()) throw new Error(isRTL ? 'يرجى إكمال جميع الحقول' : 'Please fill all fields');
        if (!validateEmail(email)) throw new Error(isRTL ? 'البريد الإلكتروني غير صالح' : 'Invalid email format');
        if (!validatePassword(password)) throw new Error(isRTL ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters');

        console.log('[Auth] Attempting signUp');
        const { isSignUpComplete, nextStep } = await signUp({
          username: email,
          password,
          options: {
            userAttributes: { email, name: name.trim() }
          }
        });
        
        console.log('[Auth] signUp complete:', isSignUpComplete, nextStep);
        if (isSignUpComplete) {
          await signIn({ username: email, password });
          onSuccess();
        } else if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          setSuccessMsg(isRTL ? 'تم إرسال رمز التأكيد إلى بريدك الإلكتروني.' : 'Confirmation code sent to your email.');
          setMode('confirm_register');
        }
      }

      else if (mode === 'confirm_register') {
        if (!email || !code) throw new Error(isRTL ? 'الرجاء إدخال الرمز' : 'Please enter the code');
        
        console.log('[Auth] Attempting confirmSignUp');
        await confirmSignUp({ username: email, confirmationCode: code });
        setSuccessMsg(isRTL ? 'تم التأكيد بنجاح، يرجى تسجيل الدخول' : 'Confirmed successfully, please login');
        setMode('login');
      }

      else if (mode === 'forgot_password') {
        if (!email) throw new Error(isRTL ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
        
        console.log('[Auth] Attempting resetPassword');
        await resetPassword({ username: email });
        setSuccessMsg(isRTL ? 'تم إرسال رمز استعادة كلمة المرور لبريدك' : 'Reset code sent to your email');
        setMode('confirm_password');
      }

      else if (mode === 'confirm_password') {
        if (!email || !code || !newPassword) throw new Error(isRTL ? 'يرجى إكمال الحقول' : 'Please fill all fields');
        if (!validatePassword(newPassword)) throw new Error(isRTL ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters');

        console.log('[Auth] Attempting confirmResetPassword');
        await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
        setSuccessMsg(isRTL ? 'تم إعادة تعيين كلمة المرور بنجاح، سجل دخولك الآن' : 'Password reset successful, please login');
        setMode('login');
        setAuthForm(prev => ({...prev, password: ''}));
      }

    } catch (err: any) {
      console.error('[Auth Error]', err);
      // Clean up common AWS errors for better UX
      let msg = err.message || 'Authentication error';
      if (msg.includes('User already exists')) msg = isRTL ? 'هذا الحساب موجود بالفعل' : 'User already exists';
      if (msg.includes('Incorrect username or password')) msg = isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Incorrect email or password';
      if (msg.includes('Invalid code')) msg = isRTL ? 'الرمز غير صحيح' : 'Invalid confirmation code';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      await resendSignUpCode({ username: authForm.email });
      setSuccessMsg(isRTL ? 'تم إعادة إرسال الرمز' : 'Code resent successfully');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-[#0a0a0a] border border-purple-900/50 rounded-2xl w-full max-w-md shadow-[0_0_80px_rgba(147,51,234,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-5 border-b border-gray-800/50 flex justify-between items-center bg-[#111]">
          <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-500" />
            {mode === 'login' && (isRTL ? 'تسجيل الدخول' : 'Secure Login')}
            {mode === 'register' && (isRTL ? 'إنشاء حساب جديد' : 'Create Account')}
            {mode === 'confirm_register' && (isRTL ? 'تأكيد الحساب' : 'Confirm Account')}
            {mode === 'forgot_password' && (isRTL ? 'استعادة كلمة المرور' : 'Reset Password')}
            {mode === 'confirm_password' && (isRTL ? 'تعيين كلمة مرور جديدة' : 'Set New Password')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-5">
          {errorMsg && (
             <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs px-4 py-3 rounded-lg font-bold uppercase text-center animate-in fade-in">
                {errorMsg}
             </div>
          )}
          {successMsg && (
             <div className="bg-green-500/10 border border-green-500/30 text-green-500 text-xs px-4 py-3 rounded-lg font-bold uppercase text-center animate-in fade-in">
                {successMsg}
             </div>
          )}

          {/* Name Field - Only for Register */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs uppercase text-gray-400 font-bold mb-2 tracking-wider">{isRTL ? 'الاسم الكامل' : 'Full Name'}</label>
              <div className="relative">
                <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 ${isRTL ? 'right-4' : 'left-4'}`} />
                <input 
                  type="text" 
                  value={authForm.name} 
                  onChange={e => setAuthForm({...authForm, name: e.target.value})} 
                  className={`w-full bg-[#111] border border-gray-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-all ${isRTL ? 'pr-11' : 'pl-11'}`}
                  placeholder={isRTL ? "مثال: علي محمد" : "e.g. John Doe"}
                  disabled={loading}
                />
              </div>
            </div>
          )}
          
          {/* Email Field - Used in many modes */}
          {['login', 'register', 'confirm_register', 'forgot_password', 'confirm_password'].includes(mode) && (
            <div>
              <label className="block text-xs uppercase text-gray-400 font-bold mb-2 tracking-wider">{t[language].eml}</label>
              <div className="relative">
                <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 ${isRTL ? 'right-4' : 'left-4'}`} />
                <input 
                  type="email" 
                  value={authForm.email} 
                  onChange={e => setAuthForm({...authForm, email: e.target.value})} 
                  className={`w-full bg-[#111] border border-gray-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-all ${isRTL ? 'pr-11' : 'pl-11'}`}
                  placeholder="admin@pixel.com" 
                  disabled={loading || mode === 'confirm_register' || mode === 'confirm_password'}
                  dir="ltr"
                />
              </div>
            </div>
          )}
          
          {/* Password Field - Used in Login and Register */}
          {['login', 'register'].includes(mode) && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs uppercase text-gray-400 font-bold tracking-wider">{t[language].passwordUpper}</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => { setMode('forgot_password'); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 ${isRTL ? 'right-4' : 'left-4'}`} />
                <input 
                  type="password" 
                  value={authForm.password} 
                  onChange={e => setAuthForm({...authForm, password: e.target.value})} 
                  className={`w-full bg-[#111] border border-gray-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-all ${isRTL ? 'pr-11' : 'pl-11'}`}
                  placeholder="••••••••" 
                  disabled={loading}
                  dir="ltr"
                />
              </div>
            </div>
          )}

          {/* Code Field */}
          {['confirm_register', 'confirm_password'].includes(mode) && (
            <div>
              <label className="block text-xs uppercase text-gray-400 font-bold mb-2 tracking-wider">
                {isRTL ? 'رمز التأكيد' : 'Confirmation Code'}
              </label>
              <input 
                type="text" 
                value={authForm.code} 
                onChange={e => setAuthForm({...authForm, code: e.target.value})} 
                className="w-full bg-[#111] border border-gray-800 rounded-xl p-3.5 text-center tracking-[0.5em] font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-all"
                placeholder="123456" 
                disabled={loading}
                dir="ltr"
              />
            </div>
          )}

          {/* New Password Field */}
          {mode === 'confirm_password' && (
            <div>
              <label className="block text-xs uppercase text-gray-400 font-bold mb-2 tracking-wider">
                {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 ${isRTL ? 'right-4' : 'left-4'}`} />
                <input 
                  type="password" 
                  value={authForm.newPassword} 
                  onChange={e => setAuthForm({...authForm, newPassword: e.target.value})} 
                  className={`w-full bg-[#111] border border-gray-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition-all ${isRTL ? 'pr-11' : 'pl-11'}`}
                  placeholder="••••••••" 
                  disabled={loading}
                  dir="ltr"
                />
              </div>
            </div>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 font-bold text-white py-3.5 rounded-xl hover:bg-purple-500 active:scale-[0.98] transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(147,51,234,0.3)]"
          >
            {loading ? <span className="animate-pulse">...</span> : (
              <>
                {mode === 'login' && t[language].authenticate}
                {mode === 'register' && t[language].registerNow}
                {mode === 'confirm_register' && (isRTL ? 'تأكيد الحساب' : 'Verify Account')}
                {mode === 'forgot_password' && (isRTL ? 'إرسال الرمز' : 'Send Reset Code')}
                {mode === 'confirm_password' && (isRTL ? 'حفظ وتحديث' : 'Save Password')}
                <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </>
            )}
          </button>
          
          {['login', 'register'].includes(mode) && (
            <>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-800/50"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">{isRTL ? 'أو' : 'OR'}</span>
                <div className="flex-grow border-t border-gray-800/50"></div>
              </div>
              
              <button 
                onClick={() => signInWithRedirect({ provider: 'Google' })}
                disabled={loading}
                type="button"
                className="w-full bg-[#111] border border-gray-800 text-gray-300 font-bold py-3.5 rounded-xl hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 opacity-80" />
                {mode === 'login' ? (isRTL ? 'المتابعة بواسطة جوجل' : 'Continue with Google') : (isRTL ? 'التسجيل بواسطة جوجل' : 'Sign up with Google')}
              </button>
            </>
          )}

          <div className="text-center mt-2 flex flex-col gap-3">
            {mode === 'confirm_register' && (
              <button 
                type="button" disabled={loading} onClick={handleResendCode}
                className="text-xs text-gray-400 hover:text-purple-400 font-bold transition-colors"
              >
                {isRTL ? 'لم يصلك الرمز؟ أعد الإرسال' : "Didn't receive a code? Resend"}
              </button>
            )}
            <button 
              type="button"
              disabled={loading}
              onClick={() => {
                const nextMode = ['login', 'forgot_password', 'confirm_password'].includes(mode) ? 'register' : 'login';
                setMode(nextMode);
                setErrorMsg(null);
                setSuccessMsg(null);
              }} 
              className="text-xs text-gray-500 hover:text-white font-bold transition-colors disabled:opacity-50"
            >
              {['login', 'forgot_password', 'confirm_password'].includes(mode) 
                ? (isRTL ? 'ليس لديك حساب؟ إنشاء حساب جديد' : "Don't have an account? Register") 
                : (isRTL ? 'لديك حساب بالفعل؟ تسجيل الدخول' : "Already have an account? Login")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
