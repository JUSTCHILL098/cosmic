// src/components/navbar/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

/**
 * Lunar-style Navbar (compact)
 * - Small height (~46px)
 * - Tabs spread across the center (Layout C)
 * - Mascot floats ABOVE the active tab (positioned inside the nav container)
 * - Text-only tabs (no icons)
 *
 * Requirements:
 * - framer-motion installed
 * - Geist Mono loaded in your app (your @font-face earlier)
 *
 * Paste this file as Navbar.jsx and import where needed.
 */

const NAV_ITEMS = [
  { name: "HOME", path: "/home" },
  { name: "POPULAR", path: "/popular" },
  { name: "MOVIE", path: "/movie" },
  { name: "RANDOM", path: "/random" },
  { name: "SHEDULE", path: "/shedule" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const rafRef = useRef(null);

  // mascot left offset (px) inside navRef
  const [mascotLeft, setMascotLeft] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(null);
  const activeName =
    NAV_ITEMS.find((it) => it.path === location.pathname)?.name || NAV_ITEMS[0].name;

  // constants for compact layout
  const NAV_HEIGHT = 46; // px - small compact
  const MASCOT_SIZE = 40; // px
  const MASCOT_OFFSET_Y = -Math.round(MASCOT_SIZE / 2) + 8; // sits above the nav, adjusted so head not cut off

  // compute mascot position relative to nav container
  function updateMascotPos(targetName = activeName) {
    const navEl = navRef.current;
    if (!navEl) return;
    const targetEl = itemRefs.current[targetName];
    if (!targetEl) {
      // fallback center
      setMascotLeft(navEl.clientWidth / 2);
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    const tRect = targetEl.getBoundingClientRect();

    // offset inside nav: (target.left - nav.left) + half target width
    const offsetInsideNav = tRect.left - navRect.left + tRect.width / 2;
    setMascotLeft(offsetInsideNav);
  }

  // throttle updates via requestAnimationFrame
  function scheduleUpdate(name) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updateMascotPos(name));
  }

  useEffect(() => {
    setMounted(true);
    // initial placement shortly after mount
    const id = setTimeout(() => scheduleUpdate(activeName), 60);

    const onResize = () => scheduleUpdate(activeName);
    const onScroll = () => scheduleUpdate(activeName);

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(id);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reposition when active route changes
  useEffect(() => {
    scheduleUpdate(activeName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // helper to navigate SPA
  function goTo(path) {
    // use React Router navigate to avoid full reload
    navigate(path);
  }

  return (
    <>
      <style>{`
        :root { --geist: 'Geist Mono', 'Geist Mono Fallback', monospace; }
      `}</style>

      <nav
        ref={navRef}
        className="fixed left-0 right-0 z-[9999] flex justify-center select-none pointer-events-none"
        style={{ top: 18 }}
      >
        <div
          className="pointer-events-auto"
          style={{
            width: "100%",
            maxWidth: 720,
            height: NAV_HEIGHT,
            marginTop: 20,
            background: "rgba(0,0,0,0.60)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 999,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative", // mascot positioned relative to this container
            boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
          }}
        >
          {/* LEFT: LUNAR (exact block) */}
          <Link to="/home" className="flex items-center select-none" onClick={(e) => e.preventDefault() || goTo("/home")}>
            <div style={{ width: 48, height: 24 }} className="flex items-center justify-center">
              <span
                style={{
                  fontFamily: "var(--geist)",
                  fontSize: 16,
                  lineHeight: "16px",
                  fontWeight: 700,
                  fontVariationSettings: "'wght' 700",
                  letterSpacing: "-0.6px",
                  WebkitFontSmoothing: "antialiased",
                  MozOsxFontSmoothing: "grayscale",
                  textRendering: "optimizeLegibility",
                  transform: "translateY(0.4px)",
                  color: "#fff",
                  display: "inline-block",
                }}
              >
                LUNAR
              </span>
            </div>
          </Link>

          {/* CENTER: spread tabs (Layout C) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: 8,
              pointerEvents: "auto",
            }}
          >
            {NAV_ITEMS.map((it) => {
              const isActive = it.name === activeName;
              return (
                <button
                  key={it.name}
                  ref={(el) => (itemRefs.current[it.name] = el)}
                  onClick={() => goTo(it.path)}
                  onMouseEnter={() => {
                    setHovering(it.name);
                    // optional: show mascot wobble when hovering
                  }}
                  onMouseLeave={() => setHovering(null)}
                  style={{
                    position: "relative",
                    padding: "8px 14px",
                    borderRadius: 999,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.78)",
                    fontFamily: "var(--geist)",
                    fontWeight: 500,
                    fontSize: 15.5,
                    letterSpacing: "-0.2px",
                    textDecoration: "none",
                    transition: "color 140ms ease",
                    cursor: "pointer",
                    background: "transparent",
                    zIndex: 2,
                    minWidth: 60,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* inner frosted pill if active */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="active-pill"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.14)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          zIndex: 0,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <span style={{ position: "relative", zIndex: 3 }}>{it.name}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT spacer for symmetry (same width as left LUNAR block) */}
          <div style={{ width: 48 }} />

          {/* Mascot inside nav container (absolute) */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: mascotLeft === null ? 0 : 1 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "absolute",
                top: MASCOT_OFFSET_Y,
                left: mascotLeft !== null ? mascotLeft : "50%",
                transform: "translateX(-50%)",
                transition: "left 260ms cubic-bezier(.25,.8,.25,1), top 160ms ease",
                pointerEvents: "none",
                zIndex: 2000,
                width: MASCOT_SIZE,
                height: MASCOT_SIZE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.div
                animate={hovering === activeName ? { rotate: [0, -6, 6, 0], y: [0, -4, 0] } : { y: [0, -3, 0] }}
                transition={hovering === activeName ? { duration: 0.6 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 40, height: 40, borderRadius: 999, background: "#fff", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {/* eyes */}
                <div style={{ width: 6, height: 6, borderRadius: 999, background: "#000", position: "absolute", left: "28%", top: "36%" }} />
                <div style={{ width: 6, height: 6, borderRadius: 999, background: "#000", position: "absolute", right: "28%", top: "36%" }} />
                {/* mouth */}
                <svg viewBox="0 0 24 24" width="20" height="10" style={{ position: "absolute", bottom: "26%" }}>
                  <path d="M8 6 Q12 9 16 6" stroke="#000" strokeWidth="1.6" strokeLinecap="round" fill="none" transform="scale(1,-1) translate(0,-12)" />
                </svg>
              </motion.div>

              {/* pointer diamond */}
              <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 12, height: 12 }}>
                <div style={{ width: "100%", height: "100%", background: "#fff", transform: "rotate(45deg)" }} />
              </div>
            </motion.div>
          )}
        </div>
      </nav>
    </>
  );
}
