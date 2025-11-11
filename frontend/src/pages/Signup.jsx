import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { motion } from 'framer-motion';

export default function Signup(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const returnUrl = searchParams.get('returnUrl') || '/courses';

  useEffect(()=> {
    const e = searchParams.get('email');
    if (e) setEmail(e);
  }, []);

  async function onSignup(e) {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // after signup let user login & then redirect
      nav(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/40 relative overflow-hidden">
      <NavBar />
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="pointer-events-none absolute -top-16 -left-10 h-72 w-72 rounded-full bg-emerald-200 blur-3xl opacity-40"
      />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="pointer-events-none absolute -bottom-20 -right-14 h-80 w-80 rounded-full bg-emerald-300 blur-3xl opacity-40"
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
              <h2 className="text-3xl font-bold text-emerald-900">Create your account</h2>
              <p className="text-sm text-gray-600 mt-2">Set up your TechKnots profile and start exploring tailored learning paths.</p>

              <form onSubmit={onSignup} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm text-slate-600">Email</label>
                  <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600">Password</label>
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200" />
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow hover:bg-emerald-700">
                  Create account
                </motion.button>
              </form>
            </div>
            <div className="hidden min-h-full flex-col justify-between bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 p-10 text-white md:flex">
              <div>
                <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-widest">
                  Why join TechKnots
                </p>
                <h3 className="mt-6 text-3xl font-semibold leading-snug">Personalized roadmaps, mentor-led sessions, and community events.</h3>
                <ul className="mt-4 space-y-3 text-sm text-emerald-50/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                    Hands-on projects with real-world tools
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                    Live Q&A and portfolio reviews from experts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                    Certification support and interview prep
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs text-emerald-100">
                  Already a member?{" "}
                  <a className="font-semibold text-white hover:text-emerald-100" href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}>
                    Log in here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
