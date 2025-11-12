import React, { useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { motion } from 'framer-motion';
import StatusToast from '../components/StatusToast';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  const returnUrl = (() => {
    const val = searchParams.get('returnUrl'); 
    return val || '/courses';
  })();

  const dismissFeedback = useCallback(() => setFeedback(null), []);

  useEffect(() => {
    // if already logged in redirect to returnUrl
    const unsub = auth.onAuthStateChanged(user => { if (user) nav(returnUrl); });
    return unsub;
  }, [nav, returnUrl]);

  useEffect(() => {
    let isMounted = true;
    getRedirectResult(auth)
      .then(result => {
        if (result?.user) {
          nav(returnUrl);
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setFeedback({
          type: 'error',
          title: 'Authentication failed',
          message: mapAuthError(err),
        });
      });
    return () => {
      isMounted = false;
    };
  }, [nav, returnUrl]);

  function mapAuthError(err) {
    if (!err) return 'Something went wrong while contacting the authentication service.';
    switch (err.code) {
      case 'auth/invalid-email':
        return 'The email address looks incorrect. Please double-check and try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Contact support if you think this is a mistake.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'We could not verify those credentials. Try again or reset your password.';
      case 'auth/popup-closed-by-user':
        return 'The sign-in window was closed before completing the process. Please try again.';
      case 'auth/network-request-failed':
        return 'Network connection failed. Check your internet connection and retry.';
      default:
        return err.message || 'Unexpected authentication error. Please try again.';
    }
  }

  async function onEmailLogin(e){
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav(returnUrl);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        // redirect to signup with info
        nav(`/signup?email=${encodeURIComponent(email)}&returnUrl=${encodeURIComponent(returnUrl)}`);
      } else {
        setFeedback({
          type: 'error',
          title: 'Sign-in error',
          message: mapAuthError(err),
        });
      }
    }
  }

  async function onProviderLogin(provider) {
    try {
      await signInWithPopup(auth, provider);
      nav(returnUrl);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setFeedback({
          type: 'info',
          title: 'Popup blocked',
          message: 'Your browser blocked the sign-in popup. We are opening the provider in the same tab instead.',
        });
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr) {
          console.error(redirectErr);
          setFeedback({
            type: 'error',
            title: 'Authentication failed',
            message: mapAuthError(redirectErr),
          });
        }
        return;
      }
      setFeedback({
        type: 'error',
        title: 'Authentication failed',
        message: mapAuthError(err),
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/40 relative overflow-hidden">
      <StatusToast feedback={feedback} onClose={dismissFeedback} />
      <NavBar />
      {/* soft blobs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-200 blur-3xl opacity-40"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-emerald-300 blur-3xl opacity-40"
      />

      <div className="mx-auto grid max-w-7xl place-items-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl"
        >
          <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 sm:p-10">
              <h2 className="text-3xl font-bold text-emerald-900">Welcome back</h2>
              <p className="text-sm text-gray-600 mt-2">Log in to continue your learning journey with TechKnots.</p>

              <form onSubmit={onEmailLogin} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm text-slate-600">Email</label>
                  <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600">Password</label>
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200" />
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow hover:bg-emerald-700">
                  Sign in
                </motion.button>
              </form>

              <div className="mt-6 text-center text-gray-500">or continue with</div>
              <div className="mt-5 flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} onClick={()=>onProviderLogin(googleProvider)} className="flex-1 rounded-xl border border-emerald-100 bg-white py-2 text-sm font-semibold text-emerald-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50">
                  Google
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={()=>onProviderLogin(githubProvider)} className="flex-1 rounded-xl border border-emerald-100 bg-white py-2 text-sm font-semibold text-emerald-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50">
                  GitHub
                </motion.button>
              </div>

              <div className="mt-6 text-center text-sm">
                Don't have an account?{" "}
                <a className="font-semibold text-emerald-600 hover:text-emerald-700" href={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`}>
                  Sign up
                </a>
              </div>
            </div>
            <div className="hidden min-h-full flex-col justify-between bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 p-10 text-white md:flex">
              <div>
                <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-widest">
                  New features
                </p>
                <h3 className="mt-6 text-3xl font-semibold leading-snug">Unlock personalized paths and live mentor sessions.</h3>
                <p className="mt-4 text-sm text-emerald-50/90">
                  Track progress, earn badges, and collaborate with a vibrant tech community built for innovators like you.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <div className="h-12 w-12 rounded-full bg-white/20" />
                  <div>
                    <p className="text-sm text-emerald-50/90">"TechKnots helped me land my dream role in just six months."</p>
                    <p className="text-xs text-emerald-100 mt-1">Aria Patel · Product Engineer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
