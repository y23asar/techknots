import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Courses from './pages/Courses';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import './index.css';
import CustomCursor from './components/CustomCursor';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CustomCursor />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </BrowserRouter>
);
