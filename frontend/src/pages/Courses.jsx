// frontend/src/pages/Courses.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebaseClient";
import { doc, setDoc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";

/**
 * Courses page
 * - fetches courses from backend API
 * - nested category & sub-category filters
 * - animated cards using framer-motion
 * - creates a Firestore user profile on first login
 * - auto-enrolls when returning from login with ?enroll=<courseId>
 * - fetches user's enrollments to show "Enrolled" state
 *
 * Requirements:
 * - set VITE_API_BASE in .env (e.g. http://localhost:4000)
 * - backend should implement:
 *   GET  /api/courses           -> list of courses
 *   POST /api/enroll            -> enroll a user (requires Firebase ID token in Authorization header)
 *   GET  /api/enrollments/me    -> (optional) returns array of enrolled courseIds for current user
 */

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [autoEnrollProcessing, setAutoEnrollProcessing] = useState(false);
  const [userEnrollments, setUserEnrollments] = useState(new Set());
  const [searchParams, setSearchParams] = useSearchParams();

  const nav = useNavigate();

  // fetch courses
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${API_BASE}/api/courses`)
      .then((res) => {
        if (!mounted) return;
        setCourses(res.data || []);
        const cats = Array.from(new Set((res.data || []).map((c) => c.category).filter(Boolean)));
        setCategories(["All", ...cats]);
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // update sub-categories when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setSubCategories([]);
      setSelectedSubCategory("All");
      return;
    }
    const subs = Array.from(
      new Set(courses.filter((c) => c.category === selectedCategory && c.subCategory).map((c) => c.subCategory))
    );
    setSubCategories(["All", ...subs]);
    setSelectedSubCategory("All");
  }, [selectedCategory, courses]);

  // Create Firestore profile and handle auto-enroll on auth change
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Create Firestore profile if missing
        try {
          const ref = doc(db, "users", user.uid);
          const snap = await getDoc(ref);
          if (!snap.exists()) {
            await setDoc(ref, {
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName || "",
              provider: user.providerData?.[0]?.providerId || "email",
              createdAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error("Failed to ensure Firestore profile:", err);
        }

        // fetch logged-in user's enrollments (optional endpoint)
        fetchUserEnrollments();

        // Auto-enroll flow: if URL contains ?enroll=<id> and not processed yet
        const enrollCourseId = searchParams.get("enroll");
        const processed = searchParams.get("enrolledProcessed");
        if (enrollCourseId && !processed && !autoEnrollProcessing) {
          try {
            setAutoEnrollProcessing(true);
            const token = await user.getIdToken();
            await axios.post(
              `${API_BASE}/api/enroll`,
              { courseId: enrollCourseId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            // mark processed so refresh doesn't redo
            searchParams.set("enrolledProcessed", "1");
            setSearchParams(searchParams, { replace: true });
            // update local enrolled set
            setUserEnrollments((prev) => new Set(prev).add(enrollCourseId));
            // small UX feedback
            window.alert("You have been successfully enrolled!");
          } catch (err) {
            console.error("Auto-enroll failed:", err);
            window.alert("Auto-enroll failed. Please try enrolling again from the course card.");
            // clear enroll param so user can try again if desired
            searchParams.delete("enroll");
            setSearchParams(searchParams, { replace: true });
          } finally {
            setAutoEnrollProcessing(false);
          }
        }
      } else {
        // user logged out: clear local enrollments
        setUserEnrollments(new Set());
      }
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // fetch user's enrollments from backend (if backend provides it)
  async function fetchUserEnrollments() {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await axios.get(`${API_BASE}/api/enrollments/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data?.map((e) => (e.courseId ? String(e.courseId) : String(e)));
      setUserEnrollments(new Set(ids || []));
    } catch (err) {
      // It's fine if endpoint doesn't exist — we silently ignore
      // console.warn("Could not fetch user enrollments:", err);
    }
  }

  // click enroll: if not logged in, redirect to login with returnUrl including enroll param
  async function handleEnroll(courseId) {
    const user = auth.currentUser;
    if (!user) {
      // redirect to login and return to courses with enroll param so auto-enroll runs
      const returnUrl = `/courses?enroll=${courseId}`;
      nav(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.post(
        `${API_BASE}/api/enroll`,
        { courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // update enrolled set locally
      setUserEnrollments((prev) => new Set(prev).add(courseId));
      window.alert("Enrolled successfully!");
    } catch (err) {
      console.error("Enroll error:", err);
      window.alert("Failed to enroll. Check console for details.");
    }
  }

  const filteredCourses = courses.filter((c) => {
    if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
    if (selectedSubCategory !== "All" && c.subCategory !== selectedSubCategory) return false;
    return true;
  });

  // mouse tracking for tiles
  const containerRef = useRef(null);
  function handleMouseMove(e) {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = e.clientX;
    const y = e.clientY;
    const rx = ((x - bounds.left) / bounds.width) * 100;
    const ry = ((y - bounds.top) / bounds.height) * 100;
    containerRef.current.style.setProperty("--mx", `${rx}%`);
    containerRef.current.style.setProperty("--my", `${ry}%`);
  }

  return (
    <div>
      <NavBar />
      <div className="max-w-7xl mx-auto px-6 py-10" ref={containerRef} onMouseMove={handleMouseMove}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">All Courses</h1>
        {/* simple filter summary */}
        <div className="text-sm text-gray-500">
          {selectedCategory !== "All" ? selectedCategory : "All categories"}
          {selectedSubCategory && selectedSubCategory !== "All" ? ` • ${selectedSubCategory}` : ""}
        </div>
      </div>

      {/* Category buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border text-sm ${
              selectedCategory === cat ? "bg-indigo-600 text-white" : "bg-white hover:bg-indigo-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subcategory chips (if any) */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubCategory(sub)}
              className={`px-3 py-1 rounded-full border text-sm ${
                selectedSubCategory === sub ? "bg-indigo-500 text-white" : "bg-white hover:bg-indigo-50"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* auto-enroll processing notice */}
      {autoEnrollProcessing && (
        <div className="mb-4 text-center text-indigo-600">Processing your enrollment — please wait...</div>
      )}

      {/* Courses grid */}
      {loading ? (
        <div className="text-center py-40 text-gray-500">Loading courses…</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-40 text-gray-500">No courses found for selected filters.</div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCourses.map((c, idx) => {
              const enrolled = userEnrollments.has(String(c._id) || String(c.id || ""));
              return (
                <motion.article
                  key={c._id || c.id || idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.02 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="relative flex flex-col bg-white rounded-2xl shadow p-4 hover:shadow-xl transition-shadow"
                  style={{
                    backgroundImage:
                      "radial-gradient(200px circle at var(--mx,50%) var(--my,50%), rgba(16,185,129,0.10), transparent 60%)",
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg h-40">
                    <img
                      src={c.thumbnail || c.image || "https://placehold.co/600x400"}
                      alt={c.title}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    {enrolled && (
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                        Enrolled
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-[1.05rem] font-semibold tracking-tight text-slate-900 line-clamp-2">
                    {c.title}
                  </h3>
                  <div className="mt-2 text-[0.92rem] text-slate-600">
                    <p className="line-clamp-3 min-h-[72px]">{c.description}</p>
                  </div>

                  {/* features area min-h keeps total content equal height */}
                  <div className="mt-3 min-h-[8px]" />

                  {/* footer aligned to bottom */}
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="text-emerald-700 font-bold">₹{c.price ?? "Free"}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEnroll(c._id || c.id)}
                        disabled={enrolled}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                          enrolled ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        {enrolled ? "Enrolled" : "Enroll Now"}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
      </div>
    </div>
  );
}
