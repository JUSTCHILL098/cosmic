import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRandom,
  faMagnifyingGlass,
  faXmark,
  faFilm,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";

/**
 * Full Lunar-like Navbar — responsive, mascot (floating) + animations
 *
 * - Desktop: centered pill navbar, LUNAR logo left (48x24). Mascot floats above active tab.
 * - Mobile: collapsible menu, icons shown. Mascot animates with layoutId.
 * - Uses framer-motion for spring + layout animations.
 *
 * IMPORTANT:
 * - Requires Geist Mono loaded in your app (your @font-face is fine).
 * - Tailwind CSS classes used; adapt if not using Tailwind.
 */

const NAV_ITEMS = [
  { name: "Home", path: "/home", icon: null },
  { name: "Features", path: "/features", icon: null },
  { name: "Changelog", path: "/changelog", icon: null },
  { name: "Contact", path: "/contact", icon: null },
  { name: "View Animes", path: "/animes", icon: null },
];

export default function Navbar() {
  const location = useLocation();
  const navRef = useRef(null);
  const menuRefs = useRef({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovering, setHovering] = useState(null);
  const [mounted, setMounted] = useState(false);

  // track active tab name (derived from route)
  const activeItem = NAV_ITEMS.find((i) => i.path === location.pathname) || NAV_ITEMS[0];
  const activeName = activeItem.name;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Move mascot when route changes or on resize/scroll — framer-motion layoutId handles most,
  // but we still trigger repositioning by re-rendering when necessary.
  useEffect(() => {
    const onResize = () => {
      // reflow by forcing state update (no-op local)
      setMounted((s) => !s);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, []);

  // Motion variants for the pill show
  const pillVariants = {
    hidden: { opacity: 0, y: -8 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } },
  };

  return (
    <>
      {/* Ensure Geist Mono is available in the page (you already added @font-face earlier) */}
      <style>{`
        :root { --geist: 'Geist Mono', 'Geist Mono Fallback', system-ui, -apple-system, 'Segoe UI', Roboto, Arial; }
      `}</style>

      {/* Top fixed container */}
      <div className="fixed left-0 right-0 z-[9999] pointer-events-none">
        {/* Desktop & mobile placement wrapper */}
        <div className="flex justify-center px-4">
          {/* NAVBAR PILL */}
          <motion.div
            ref={navRef}
            initial="hidden"
            animate="show"
            variants={pillVariants}
            className="pointer-events-auto"
          >
            <div
              className="flex items-center justify-between"
              style={{
                width: "100%",
                maxWidth: "700px",
                height: 66,
                background: "rgba(0,0,0,0.62)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 999,
                padding: "0 20px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.55)",
              }}
            >
              {/* LEFT — exact LUNAR text block (48x24) */}
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

              {/* CENTER menu (desktop) */}
              <div className="hidden md:flex items-center gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.name === activeName;
                  return (
                    <a
                      key={item.name}
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        // navigate with link click — use location change by setting href
                        window.location.href = item.path;
                      }}
                      ref={(el) => (menuRefs.current[item.name] = el)}
                      onMouseEnter={() => setHovering(item.name)}
                      onMouseLeave={() => setHovering(null)}
                      className="relative px-3 py-[10px] rounded-full transition-colors"
                      style={{
                        color: isActive ? "#fff" : "rgba(255,255,255,0.78)",
                        fontFamily: "var(--geist)",
                        fontWeight: 500,
                        fontSize: 16,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        cursor: "pointer",
                      }}
                    >
                      {/* Inner glow / active bubble (only inner, no outer glow) */}
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

                      <span style={{ position: "relative", zIndex: 1 }}>{item.name}</span>
                    </a>
                  );
                })}
              </div>

              {/* RIGHT — icons + mobile button */}
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                  <a className="p-2 rounded-full text-white/80 hover:text-white" href="#" onClick={(e) => e.preventDefault()}>
                    <FontAwesomeIcon icon={faDiscord} />
                  </a>
                  <a className="p-2 rounded-full text-white/80 hover:text-white" href="#" onClick={(e) => e.preventDefault()}>
                    <FontAwesomeIcon icon={faTelegram} />
                  </a>
                </div>

                {/* Random/movie/trending icons on desktop */}
                <div className="hidden sm:flex items-center gap-1">
                  <a className="p-2 rounded-full text-white/80 hover:text-white" href="/random" onClick={(e) => { e.preventDefault(); window.location.href = "/random"; }}>
                    <FontAwesomeIcon icon={faRandom} />
                  </a>
                  <a className="p-2 rounded-full text-white/80 hover:text-white" href="/movie" onClick={(e) => { e.preventDefault(); window.location.href = "/movie"; }}>
                    <FontAwesomeIcon icon={faFilm} />
                  </a>
                  <a className="p-2 rounded-full text-white/80 hover:text-white" href="/most-popular" onClick={(e) => { e.preventDefault(); window.location.href = "/most-popular"; }}>
                    <FontAwesomeIcon icon={faFire} />
                  </a>
                </div>

                {/* mobile search / hamburger */}
                <div className="md:hidden flex items-center">
                  <button
                    onClick={() => setMobileOpen((s) => !s)}
                    className="p-2 rounded-md text-white/80 hover:text-white"
                    aria-label="menu"
                  >
                    <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating mascot (layoutId for smooth shared layout between mobile/desktop) */}
        <div className="pointer-events-none">
          <AnimatePresence>
            {/* render mascot when mounted (desktop & mobile scenarios) */}
            <motion.div
              key={activeName}
              layoutId="anime-mascot"
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "absolute",
                // compute center above active element using ref (best-effort; layoutId ensures smooth slide)
                left: (() => {
                  try {
                    const el = menuRefs.current[activeName];
                    if (!el) return "50%";
                    const r = el.getBoundingClientRect();
                    return r.left + r.width / 2 + window.scrollX;
                  } catch (e) {
                    return "50%";
                  }
                })(),
                top: (() => {
                  try {
                    const pill = navRef.current?.getBoundingClientRect();
                    if (!pill) return 10;
                    // place mascot slightly above the pill so head not cut off
                    return pill.top + window.scrollY + 8;
                  } catch (e) {
                    return 10;
                  }
                })(),
                transform: "translateX(-50%)",
                zIndex: 200002,
              }}
            >
              {/* mascot SVG container */}
              <div style={{ width: 52, height: 52, position: "relative" }}>
                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  animate={hovering === activeName ? { rotate: [0, -6, 6, 0] } : { y: [0, -3, 0] }}
                  transition={hovering === activeName ? { duration: 0.6 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* white face */}
                  <div style={{ width: 40, height: 40, borderRadius: 999, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    {/* eyes */}
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: "#000", position: "absolute", left: "28%", top: "36%" }} />
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: "#000", position: "absolute", right: "28%", top: "36%" }} />
                    {/* mouth */}
                    <svg viewBox="0 0 24 24" width="20" height="10" style={{ position: "absolute", bottom: "28%" }}>
                      <path d="M8 6 Q12 9 16 6" stroke="#000" strokeWidth="1.7" strokeLinecap="round" fill="none" transform="scale(1,-1) translate(0,-12)"/>
                    </svg>
                  </div>

                  {/* tiny sparkle when hovering */}
                  <AnimatePresence>
                    {hovering === activeName && (
                      <>
                        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ duration: 0.25 }} style={{ position: "absolute", top: -6, left: 38 }}>
                          <div style={{ width: 8, height: 8, color: "#FFD56B" }}>✨</div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed inset-x-4 top-20 z-[9998] rounded-2xl bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl p-4 md:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((it) => {
                const isActive = it.name === activeName;
                return (
                  <a
                    key={it.name}
                    href={it.path}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileOpen(false);
                      window.location.href = it.path;
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left ${isActive ? "text-white" : "text-white/80"}`}
                    style={{ textDecoration: "none", fontFamily: "var(--geist)", fontWeight: 500 }}
                  >
                    {it.name}
                  </a>
                );
              })}
              <div className="flex items-center gap-3 pt-2">
                <a href="#" onClick={(e) => e.preventDefault()} className="p-2 rounded-full text-white/80 hover:text-white"><FontAwesomeIcon icon={faDiscord} /></a>
                <a href="#" onClick={(e) => e.preventDefault()} className="p-2 rounded-full text-white/80 hover:text-white"><FontAwesomeIcon icon={faTelegram} /></a>
                <a href="/animes" onClick={(e) => { e.preventDefault(); window.location.href = "/animes"; }} className="ml-auto p-2 rounded-full text-white/80 hover:text-white"><FontAwesomeIcon icon={faFire} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
