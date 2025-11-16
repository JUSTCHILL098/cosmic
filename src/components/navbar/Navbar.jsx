// Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

/**
 * Robust Lunar navbar: mascot positioned INSIDE navbar container to avoid jitter.
 * - Mascot is absolutely positioned inside the nav (navRef) using offset inside nav.
 * - Updates are throttled via requestAnimationFrame.
 * - Active tab shows inner frosted pill (no outer glow).
 *
 * Requirements:
 * - framer-motion installed (or remove motion/AnimatePresence if you don't want it)
 * - Geist Mono loaded in your app
 */

const NAV_ITEMS = [
  { name: "Home", path: "/home" },
  { name: "Features", path: "/features" },
  { name: "Changelog", path: "/changelog" },
  { name: "Contact", path: "/contact" },
  { name: "View Animes", path: "/animes" },
];

export default function Navbar() {
  const location = useLocation();
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const rafRef = useRef(null);

  // left offset in pixels inside navRef where mascot centers
  const [mascotLeft, setMascotLeft] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(null);

  const activeItem = NAV_ITEMS.find((i) => i.path === location.pathname) || NAV_ITEMS[0];

  // Compute mascot position relative to nav container
  function updateMascotPosition(targetName) {
    const navEl = navRef.current;
    if (!navEl) return;

    const target = itemRefs.current[targetName];
    if (!target) {
      // fallback: center
      setMascotLeft(navEl.clientWidth / 2);
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();

    // offset inside nav: (target.left - nav.left) + half target width
    const offsetInsideNav = (tRect.left - navRect.left) + tRect.width / 2;

    setMascotLeft(offsetInsideNav);
  }

  // schedule update via RAF (throttle)
  function scheduleUpdate(targetName = activeItem.name) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updateMascotPosition(targetName));
  }

  useEffect(() => {
    setMounted(true);
    // initial placement after small delay so layout stable
    const id = setTimeout(() => scheduleUpdate(activeItem.name), 60);

    const onResize = () => scheduleUpdate(activeItem.name);
    const onScroll = () => scheduleUpdate(activeItem.name);

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

  // reposition when route changes (active tab changes)
  useEffect(() => {
    scheduleUpdate(activeItem.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // small helper styling values
  const NAV_HEIGHT = 66;     // px
  const MASCOT_SIZE = 52;    // px (diameter)
  const MASCOT_OFFSET_Y = -Math.round(MASCOT_SIZE / 2) + 8; // move slightly down so not cut off

  return (
    <>
      <style>{`
        :root { --geist: 'Geist Mono', 'Geist Mono Fallback', monospace; }
      `}</style>

      <nav
        ref={navRef}
        className="fixed left-0 right-0 z-[9999] flex justify-center select-none pointer-events-none"
        style={{ top: 20 }}
      >
        <div
          className="pointer-events-auto"
          style={{
            width: "100%",
            maxWidth: 700,
            height: NAV_HEIGHT,
            marginTop: 24,
            background: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 999,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative", // IMPORTANT: mascot positioned relative to this container
            boxShadow: "0 6px 20px rgba(0,0,0,0.55)",
          }}
        >
          {/* LUNAR text (exact block) */}
          <Link to="/home" className="flex items-center select-none" style={{ textDecoration: "none" }}>
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

          {/* Menu items center */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, pointerEvents: "auto" }}>
            {NAV_ITEMS.map((it) => {
              const isActive = it.name === activeItem.name;
              return (
                <a
                  key={it.name}
                  href={it.path}
                  ref={(el) => (itemRefs.current[it.name] = el)}
                  onClick={(e) => {
                    e.preventDefault();
                    // use location change via window for simplicity - adapt to your router if needed
                    window.location.href = it.path;
                  }}
                  onMouseEnter={() => setHovering(it.name)}
                  onMouseLeave={() => setHovering(null)}
                  style={{
                    position: "relative",
                    padding: "10px 18px",
                    borderRadius: 999,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.78)",
                    fontFamily: "var(--geist)",
                    fontWeight: 500,
                    fontSize: 16,
                    textDecoration: "none",
                    transition: "color 140ms ease",
                    cursor: "pointer",
                    zIndex: 2,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {/* inner frosted pill if active (no outer glow) */}
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
                </a>
              );
            })}
          </div>

          {/* right spacer to keep layout balanced */}
          <div style={{ width: 48 }} />
          
          {/* Mascot positioned INSIDE the nav container */}
          {mounted && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: MASCOT_OFFSET_Y, // above the pill
                left: mascotLeft !== null ? mascotLeft : "50%",
                transform: "translateX(-50%)",
                transition: "left 260ms cubic-bezier(.25,.8,.25,1), top 160ms ease, opacity 180ms",
                pointerEvents: "none",
                zIndex: 2000,
                opacity: mascotLeft === null ? 0 : 1,
                width: MASCOT_SIZE,
                height: MASCOT_SIZE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Mascot (white face) */}
              <div style={{ width: 40, height: 40, borderRadius: 999, background: "#fff", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* eyes */}
                <div style={{ width: 6, height: 6, borderRadius: 999, background: "#000", position: "absolute", left: "28%", top: "36%" }} />
                <div style={{ width: 6, height: 6, borderRadius: 999, background: "#000", position: "absolute", right: "28%", top: "36%" }} />
                {/* mouth */}
                <svg viewBox="0 0 24 24" width="20" height="10" style={{ position: "absolute", bottom: "28%" }}>
                  <path d="M8 6 Q12 9 16 6" stroke="#000" strokeWidth="1.6" strokeLinecap="round" fill="none" transform="scale(1,-1) translate(0,-12)" />
                </svg>
              </div>

              {/* small pointer diamond under mascot */}
              <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 12, height: 12 }}>
                <div style={{ width: "100%", height: "100%", background: "#fff", transform: "rotate(45deg)", margin: 0 }} />
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
