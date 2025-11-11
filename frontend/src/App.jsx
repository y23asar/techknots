import React from 'react';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center p-8">
      <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">Welcome to TECHKNOTS</h1>
      <p className="text-gray-600 mb-6">Empowering your learning journey with real projects and mentorship.</p>
      <Link to="/courses" className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
        Explore Courses
      </Link>
    </div>
  );
}
