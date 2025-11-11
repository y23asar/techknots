import React from "react";
import NavBar from "../components/NavBar";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/40 text-slate-900">
      <NavBar />
      {/* Hero banner */}
      <div className="relative">
        {/* Abstract layered gradient hero */}
        <div className="h-60 w-full overflow-hidden">
          <div className="h-full w-full bg-[radial-gradient(1200px_400px_at_-10%_110%,rgba(16,185,129,0.35),transparent),radial-gradient(800px_300px_at_110%_-10%,rgba(5,150,105,0.35),transparent),linear-gradient(135deg,#ecfdf5,white)]" />
        </div>
        <div className="absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 grid place-items-center">
          <h1 className="text-4xl font-black text-emerald-900 tracking-tight drop-shadow-lg">Contact</h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-[1fr_360px]">
        {/* Form card */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow">
          <h2 className="text-lg font-bold text-emerald-900">Ask TECHKNOTS</h2>
          <form className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-slate-700">Name</label>
              <input className="mt-1 w-full rounded-lg border border-emerald-200 p-3 outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <div>
              <label className="text-sm text-slate-700">Email</label>
              <input type="email" className="mt-1 w-full rounded-lg border border-emerald-200 p-3 outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <div>
              <div className="mb-2 text-sm text-slate-700">Choose response option:</div>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="opt" defaultChecked className="text-emerald-600" />
                  Paid response
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="opt" className="text-emerald-600" />
                  Online paid consultation
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="opt" className="text-emerald-600" />
                  Free response
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-700">Your message</label>
              <textarea rows={8} className="mt-1 w-full resize-y rounded-lg border border-emerald-200 p-3 outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <button type="button" className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700">
              Send Message
            </button>
          </form>
        </div>

        {/* Newsletter / info card */}
        <aside className="rounded-2xl border border-emerald-100 bg-emerald-900 p-6 text-emerald-50 shadow">
          <div className="text-sm uppercase tracking-wider opacity-80">Stay in the loop</div>
          <h3 className="mt-1 text-xl font-bold">Subscribe to our newsletter</h3>
          <p className="mt-3 text-emerald-100/90">
            Get updates on courses, new content, and curated insights from our experts.
          </p>
          <div className="mt-5 flex overflow-hidden rounded-full bg-white p-1">
            <input placeholder="you@company.com" className="w-full px-3 py-2 text-slate-800 outline-none" />
            <button className="rounded-full bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Join</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

