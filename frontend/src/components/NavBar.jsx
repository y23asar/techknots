import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoUrl from "../assets/logo.png";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const topics = [
    {
      name: "Web Development",
      items: ["HTML & CSS", "JavaScript ES6+", "React", "APIs & Deployment"],
    },
    {
      name: "Mobile Apps",
      items: ["React Native", "Architecture", "Native Features", "Publishing"],
    },
    {
      name: "Cloud & DevOps",
      items: ["AWS/Azure", "Docker", "CI/CD", "Kubernetes"],
    },
    {
      name: "AI & ML",
      items: ["Python", "ML Algorithms", "Neural Networks", "NLP"],
    },
    {
      name: "Cybersecurity",
      items: ["Network Security", "Encryption", "Threat Response", "Pentesting"],
    },
    {
      name: "UI/UX",
      items: ["Design Thinking", "Personas", "Wireframing", "Usability"],
    },
  ];

  return (
    <div className="sticky top-0 z-30 border-b border-emerald-100 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Brand */}
        <button onClick={() => nav("/")} className="flex items-center gap-2">
          <img src={logoUrl} alt="TECHKNOTS" className="h-8 w-8" />
          <span className="text-xl font-extrabold tracking-tight text-emerald-900">TECHKNOTS</span>
        </button>

        {/* Explore with dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-800">
            Explore
          </button>
          {open && (
            <div className="absolute left-0 mt-2 w-[560px] rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {topics.map((t) => (
                  <div key={t.name} className="rounded-xl p-3 hover:bg-emerald-50">
                    <div className="mb-1 font-semibold text-emerald-900">{t.name}</div>
                    <ul className="space-y-1 text-slate-700">
                      {t.items.map((it) => (
                        <li key={it} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Centered search */}
        <div className="mx-auto flex-1 max-w-xl">
          <div className="group relative flex items-center overflow-hidden rounded-full bg-white/90 shadow-sm ring-1 ring-emerald-100 transition focus-within:ring-2 focus-within:ring-emerald-300">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-emerald-500">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
              </svg>
            </div>
            <input
              placeholder="Search courses…"
              className="w-full rounded-full bg-transparent px-9 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white"
            />
            <button
              className="mr-1 hidden rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:scale-105 hover:shadow md:inline-flex"
            >
              Search
            </button>
          </div>
        </div>

        {/* Contact and Auth */}
        <Link to="/contact" className="hidden rounded-full px-3 py-2 text-sm text-slate-700 hover:text-emerald-800 md:block">
          Contact
        </Link>
        <Link to="/login" className="hidden rounded-full px-4 py-2 text-emerald-700 hover:text-emerald-900 md:block">
          Login
        </Link>
        <Link
          to="/signup"
          className="hidden rounded-full bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 md:block"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

