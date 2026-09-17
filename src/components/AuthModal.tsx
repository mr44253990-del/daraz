import React, { useState } from 'react';
import { X, Mail, Lock, LogOut, CheckCircle, ShoppingBag, Heart, Shield, AlertCircle, Sparkles } from 'lucide-react';
import { UserProfile, CartItem } from '../types';
import { getSupabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  cartItems: CartItem[];
  likedCount: number;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  cartItems,
  likedCount,
}) => {
  if (!isOpen) return null;

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const translateAuthError = (errMsg: string) => {
    if (!errMsg) return 'অথেন্টিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    const msg = errMsg.toLowerCase();
    if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) {
      return 'ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন। অনুগ্রহ করে সঠিক তথ্য দিন।';
    }
    if (msg.includes('user already registered') || msg.includes('already exists')) {
      return 'এই ইমেইল দিয়ে ইতোমধ্যে একটি একাউন্ট খোলা আছে। দয়া করে লগইন করুন।';
    }
    if (msg.includes('password should be at least')) {
      return 'পাসওয়ার্ডটি অন্তত ৬ অক্ষরের হতে হবে।';
    }
    if (msg.includes('email not confirmed')) {
      return 'আপনার ইমেইলটি এখনও ভেরিফাই করা হয়নি। অনুগ্রহ করে ইনবক্স চেক করুন।';
    }
    return errMsg;
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setInfoMessage('');
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase ক্লায়েন্ট পাওয়া যায়নি।');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      setError(translateAuthError(e.message));
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email || !password) {
      setError('ইমেইল এবং পাসওয়ার্ড আবশ্যক');
      return;
    }

    if (password.length < 6) {
      setError('পাসওয়ার্ডটি অন্তত ৬ অক্ষরের হতে হবে');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError('সুপাবেস ডাটাবেস ক্লায়েন্ট সক্রিয় নয়।');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Real Supabase User Sign Up
        const defaultAvatar =
          avatarUrl.trim() ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim() || email.trim())}`;

        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              name: name.trim() || email.split('@')[0],
              full_name: name.trim() || email.split('@')[0],
              avatar_url: defaultAvatar,
            },
          },
        });

        if (signUpErr) throw signUpErr;

        if (data.session && data.user) {
          // Immediately logged in
          const profile: UserProfile = {
            id: data.user.id,
            name: name.trim() || email.split('@')[0],
            email: data.user.email || email.trim(),
            avatar: defaultAvatar,
            cart: cartItems,
            likedProductIds: [],
          };
          onLoginSuccess(profile);
          onClose();
        } else if (data.user) {
          // Email confirmation is required by Supabase project settings
          setInfoMessage(
            'সুপাবেসে আপনার আসল একাউন্ট তৈরি হয়েছে! একটি কনফার্মেশন লিংক আপনার ইমেইলে পাঠানো হয়েছে।'
          );
        }
      } else {
        // Real Supabase User Login
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (signInErr) throw signInErr;

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            name:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              data.user.email?.split('@')[0] ||
              'ব্যবহারকারী',
            email: data.user.email || email.trim(),
            avatar:
              data.user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.user.email || 'user')}`,
            cart: cartItems,
            likedProductIds: [],
          };
          onLoginSuccess(profile);
          onClose();
        }
      }
    } catch (err: any) {
      setError(translateAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F85606] text-white flex items-center justify-center font-bold text-lg">
              d
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base">
                {currentUser ? 'আমার একাউন্ট ড্যাশবোর্ড' : isSignUp ? 'আসল একাউন্ট খুলুন' : 'লগইন করুন'}
              </h3>
              <p className="text-[11px] text-gray-500">Supabase Auth পরিচালিত রিয়াল একাউন্ট</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Already Logged In: Profile View */}
        {currentUser ? (
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-orange-50/60 p-4 rounded-xl border border-orange-100">
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.email)}`}
                alt={currentUser.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#F85606]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-gray-900 text-base truncate">{currentUser.name}</h4>
                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Supabase ভেরিফাইড ক্রেতা
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#F85606]" />
                  <span>কার্ট আইটেম</span>
                </div>
                <div className="text-lg font-black text-gray-800">{cartItems.length} টি</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Heart className="w-3.5 h-3.5 text-red-500" />
                  <span>পছন্দের পণ্য</span>
                </div>
                <div className="text-lg font-black text-gray-800">{likedCount} টি</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogoutClick}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>লগআউট করুন</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login or Signup Form */
          <div className="p-5 flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {infoMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{infoMessage}</span>
              </div>
            )}

            {/* Google Sign In Option */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>গুগল দিয়ে সরাসরি প্রবেশ করুন</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex-1 h-px bg-gray-200" />
              <span>অথবা ইমেইল পাসওয়ার্ড দিয়ে</span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {isSignUp && (
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">আপনার পূর্ণ নাম</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: মোঃ সাকিব হাসান"
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F85606]"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">ইমেইল এড্রেস</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F85606]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F85606]"
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">প্রোফাইল ছবির লিংক (ঐচ্ছিক)</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://... image url"
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F85606]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#F85606] hover:bg-[#e04b03] text-white font-bold text-xs rounded-xl transition-colors mt-2 cursor-pointer shadow-sm disabled:opacity-60"
              >
                {loading ? 'প্রসেসিং হচ্ছে...' : isSignUp ? 'আসল একাউন্ট তৈরি করুন' : 'লগইন করুন'}
              </button>
            </form>

            <div className="text-center text-xs text-gray-500 pt-1">
              {isSignUp ? (
                <span>
                  ইতোমধ্যে একাউন্ট আছে?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setError('');
                      setInfoMessage('');
                    }}
                    className="text-[#F85606] font-bold hover:underline cursor-pointer"
                  >
                    লগইন করুন
                  </button>
                </span>
              ) : (
                <span>
                  নতুন ব্যবহারকারী?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setError('');
                      setInfoMessage('');
                    }}
                    className="text-[#F85606] font-bold hover:underline cursor-pointer"
                  >
                    ফ্রি একাউন্ট তৈরি করুন
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
