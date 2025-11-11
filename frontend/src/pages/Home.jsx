import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, animate } from "framer-motion";
import NavBar from "../components/NavBar";
// Lottie temporarily disabled to avoid any runtime import issues

/**
 * Animated Home page
 * - Glassy navbar
 * - Mouse-follow gradient "spotlight"
 * - Lottie decorative badges (via <img> fallback if lottie not installed)
 * - Swipeable courses rail using framer-motion drag
 * - All CTAs route to /login
 */
export default function Home() {
  const nav = useNavigate();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -24]);

  useEffect(() => {
    function onMove(e) {
      const x = e.clientX;
      const y = e.clientY;
      setPointer({ x, y });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const ctas = {
    onPrimary: () => nav("/login"),
    onEnroll: () => nav("/login"),
    onLogin: () => nav("/login"),
    onSignup: () => nav("/signup"),
  };

  const courses = [
    {
      id: "web",
      title: "Web Development Fundamentals",
      duration: "12 weeks",
      level: "Beginner",
      bullets: [
        "HTML5, CSS3, JavaScript",
        "Responsive design",
        "Modern frameworks (React)",
        "API integration & deployment",
      ],
    },
    {
      id: "mobile",
      title: "Mobile App Development",
      duration: "10 weeks",
      level: "Intermediate",
      bullets: [
        "React Native foundations",
        "Cross-platform architecture",
        "Native device features",
        "Store deployment",
      ],
    },
    {
      id: "cloud",
      title: "Cloud Computing & DevOps",
      duration: "14 weeks",
      level: "Intermediate",
      bullets: [
        "AWS/Azure fundamentals",
        "Docker & containerization",
        "CI/CD pipelines",
        "Kubernetes orchestration",
      ],
    },
    {
      id: "ai",
      title: "AI & Machine Learning Basics",
      duration: "16 weeks",
      level: "Advanced",
      bullets: [
        "Python for data science",
        "Neural networks",
        "NLP essentials",
        "Model deployment",
      ],
    },
    {
      id: "cyber",
      title: "Cybersecurity Essentials",
      duration: "12 weeks",
      level: "Intermediate",
      bullets: [
        "Network security fundamentals",
        "Encryption & cryptography",
        "Threat detection & response",
        "Security best practices",
      ],
    },
    {
      id: "uiux",
      title: "UI/UX Design Principles",
      duration: "8 weeks",
      level: "Beginner",
      bullets: [
        "Design thinking methodology",
        "User research & personas",
        "Wireframing & prototyping",
        "Usability testing",
      ],
    },
  ];

  const coursesWithCta = [
    ...courses,
    {
      id: "cta",
      isCta: true,
    },
  ];

  // rail motion and arrow navigation
  const CARD_WIDTH = 360;
  const CARD_GAP = 24;
  const CARD_STRIDE = CARD_WIDTH + CARD_GAP;
  const railMotionX = useMotionValue(0);
  const railRef = useRef(null);
  const railContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  useEffect(() => {
    function updateMaxIndex() {
      const width = railContainerRef.current?.offsetWidth ?? 0;
      const visible = Math.max(1, Math.floor((width - 32) / CARD_STRIDE));
      const max = Math.max(0, coursesWithCta.length - visible);
      setMaxIndex(max);
      setActiveIndex((prev) => Math.min(prev, max));
    }
    updateMaxIndex();
    window.addEventListener("resize", updateMaxIndex);
    return () => window.removeEventListener("resize", updateMaxIndex);
  }, [coursesWithCta.length]);

  useEffect(() => {
    const target = -activeIndex * CARD_STRIDE;
    animate(railMotionX, target, { duration: 0.45, ease: "easeOut" });
  }, [activeIndex, railMotionX]);

  const canGoLeft = activeIndex > 0;
  const canGoRight = activeIndex < maxIndex;

  function go(direction) {
    setActiveIndex((prev) => {
      if (direction === "right") {
        return Math.min(prev + 1, maxIndex);
      }
      return Math.max(prev - 1, 0);
    });
  }

  function handleDragEnd() {
    const rawIndex = Math.round(Math.abs(railMotionX.get()) / CARD_STRIDE);
    const next = Math.min(Math.max(rawIndex, 0), maxIndex);
    setActiveIndex(next);
  }

  const dragConstraints = { left: -CARD_STRIDE * maxIndex, right: 0 };

  // 3D tilt for course cards
  function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = (y / rect.height - 0.5) * -8;
    const ry = (x / rect.width - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }
  function resetTilt(e) {
    e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-emerald-50/40 text-slate-900">
      <NavBar />
      {/* Mouse spotlight */}
      <motion.div
        aria-hidden
        style={{
          left: pointer.x - 250,
          top: pointer.y - 250,
        }}
        className="pointer-events-none fixed z-0 h-[500px] w-[500px] rounded-full"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_60%)] blur-2xl" />
      </motion.div>

      {/* Navbar removed from here; using shared NavBar */}

      {/* Hero */}
      <section className="relative z-10">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="mx-auto max-w-5xl px-4 pt-14 pb-16 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-sm text-emerald-700 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Innovating the Future of Technology
          </div>
          <h1 className="text-4xl font-black leading-tight text-emerald-900 sm:text-5xl md:text-6xl">
            Build the Future with <span className="text-emerald-600">TECHKNOTS</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-700">
            We craft cutting-edge digital solutions that transform businesses and empower innovation through
            technology and expert training.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={ctas.onPrimary}
              className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow hover:bg-emerald-700"
            >
              Get Started
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <a href="#courses" className="rounded-xl border border-emerald-200 bg-white px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50">
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["500+", "Projects Completed"],
              ["200+", "Happy Clients"],
              ["50+", "Team Members"],
              ["10+", "Years Experience"],
            ].map(([num, label]) => (
              <div key={label} className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-emerald-100">
                <div className="text-2xl font-extrabold text-emerald-700">{num}</div>
                <div className="text-xs text-slate-600">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Courses swipe rail */}
      <section id="courses" className="relative z-10 mx-auto max-w-7xl px-4 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-emerald-900 sm:text-4xl">Our <span className="text-emerald-600">Courses</span></h2>
          <p className="mt-3 text-slate-600">Master cutting-edge technologies with comprehensive courses designed for real‑world success.</p>
        </div>

        {/* Decorative badge placeholder */}
        <div className="pointer-events-none absolute -right-4 -mt-10 hidden h-12 w-12 select-none rounded-full bg-emerald-200 opacity-60 md:block" />

        <div className="relative">
          {/* Arrows */}
          {canGoLeft && (
            <button
              onClick={() => go("left")}
              aria-label="Previous courses"
              className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 text-white shadow-lg transition hover:scale-105 md:block"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="currentColor" d="M15.5 5.5 9 12l6.5 6.5-1.5 1.5L6 12l8-8z" />
              </svg>
            </button>
          )}
          {canGoRight && (
            <button
              onClick={() => go("right")}
              aria-label="Next courses"
              className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 text-white shadow-lg transition hover:scale-105 md:block"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="currentColor" d="m8.5 5.5 6.5 6.5-6.5 6.5 1.5 1.5 8-8-8-8z" />
              </svg>
            </button>
          )}

          <div
            ref={railContainerRef}
            className="relative overflow-hidden rounded-3xl bg-white/70 p-4 shadow ring-1 ring-emerald-100"
          >
            <motion.div
              ref={railRef}
              drag="x"
              dragConstraints={dragConstraints}
              style={{ x: railMotionX }}
              onDragEnd={handleDragEnd}
              className="flex gap-6"
            >
              {coursesWithCta.map((c, i) =>
                c.isCta ? (
                  <motion.article
                    key={c.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="flex w-[360px] shrink-0 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-6 text-center text-white shadow-lg ring-1 ring-emerald-400"
                  >
                    <h3 className="text-2xl font-semibold">Explore Our Full Catalogue</h3>
                    <p className="mt-3 text-sm text-emerald-50/90">
                      Discover advanced tracks, certification paths, and exclusive masterclasses curated by our experts.
                    </p>
                    <button
                      onClick={() => nav("/courses")}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/20"
                    >
                      Explore more courses
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path fill="currentColor" d="m10 6 6 6-6 6-1.41-1.41L13.17 12 8.59 7.41z" />
                      </svg>
                    </button>
                  </motion.article>
                ) : (
                  <motion.article
                    key={c.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    onMouseMove={handleTilt}
                    onMouseLeave={resetTilt}
                    className="flex w-[360px] shrink-0 flex-col rounded-3xl bg-white p-6 shadow-md ring-1 ring-emerald-100 transition-transform duration-300 will-change-transform"
                    style={{ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" }}
                  >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                      <span className="font-medium">{c.duration}</span>
                      <span className="mx-1">•</span>
                      <span>{c.level}</span>
                    </div>
                    <h3 className="text-xl font-bold text-emerald-900">{c.title}</h3>
                    <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-700 min-h-[140px]">
                      {c.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={ctas.onEnroll}
                      className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 font-semibold text-white hover:from-emerald-700 hover:to-emerald-600"
                    >
                      Enroll Now
                    </button>
                  </motion.article>
                )
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials & Trust Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20">
        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-black text-emerald-900 sm:text-4xl">
            Trusted by <span className="text-emerald-600">10,000+</span> Learners
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            Join a community of professionals who are advancing their careers with TECHKNOTS
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "4.9/5", label: "Average Rating" },
              { value: "10K+", label: "Active Students" },
              { value: "95%", label: "Job Placement" },
              { value: "500+", label: "Expert Mentors" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm ring-1 ring-emerald-100"
              >
                <div className="text-3xl font-extrabold text-emerald-700">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Customer Testimonials */}
        <div className="mb-12 text-center">
          <h3 className="text-2xl font-bold text-emerald-900">What Our Students Say</h3>
          <p className="mt-2 text-slate-600">Real stories from real learners</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Sarah Chen",
              role: "Software Engineer",
              company: "Tech Corp",
              avatar: "SC",
              rating: 5,
              text: "TECHKNOTS transformed my career! The hands-on projects and expert mentorship helped me land my dream job at a top tech company. The React course was especially comprehensive.",
            },
            {
              name: "Michael Rodriguez",
              role: "Full Stack Developer",
              company: "StartupXYZ",
              avatar: "MR",
              rating: 5,
              text: "I've tried many platforms, but TECHKNOTS stands out. The curriculum is up-to-date, the community is supportive, and the instructors are industry veterans. Highly recommend!",
            },
            {
              name: "Priya Sharma",
              role: "DevOps Engineer",
              company: "Cloud Solutions Inc",
              avatar: "PS",
              rating: 5,
              text: "The Cloud Computing course exceeded my expectations. From Docker to Kubernetes, everything was explained clearly with real-world scenarios. Worth every penny!",
            },
          ].map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group rounded-3xl bg-white p-6 shadow-md ring-1 ring-emerald-100 transition-shadow hover:shadow-xl"
            >
              {/* Rating Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="mb-6 text-slate-700 leading-relaxed">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-emerald-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-16 max-w-4xl rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-8 text-center text-white shadow-xl ring-1 ring-emerald-400"
        >
          <h3 className="mb-3 text-2xl font-bold sm:text-3xl">Ready to Start Your Journey?</h3>
          <p className="mb-6 text-emerald-50/90">
            Join thousands of learners who are building their future with TECHKNOTS
          </p>
          <button
            onClick={ctas.onPrimary}
            className="rounded-xl bg-white px-8 py-3 font-semibold text-emerald-600 shadow-lg transition hover:scale-105 hover:bg-emerald-50"
          >
            Get Started Today
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white/70">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
          <div>
            <div className="mb-3 text-lg font-extrabold text-emerald-900">TECHKNOTS</div>
            <p className="text-sm text-slate-600">Transforming ideas into digital reality. Building the future of technology, one solution at a time.</p>
          </div>
          <div>
            <div className="mb-2 font-semibold text-slate-900">Company</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a className="hover:text-emerald-700" href="#">About Us</a></li>
              <li><a className="hover:text-emerald-700" href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-slate-900">Services</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a className="hover:text-emerald-700" href="#">Web Development</a></li>
              <li><a className="hover:text-emerald-700" href="#">Mobile Apps</a></li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-slate-900">Resources</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a className="hover:text-emerald-700" href="#">Documentation</a></li>
              <li><a className="hover:text-emerald-700" href="#">Case Studies</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
