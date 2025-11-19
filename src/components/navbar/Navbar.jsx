// LunarNavbar.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Surgical fixes:
 * - Only one mascot instance (above active tab).
 * - Lowered navbar so mascot head is fully visible.
 * - Blush opacity works (base + hover).
 *
 * Everything else unchanged from your last version.
 */

// ------------------- MASCOT -------------------
function Mascot({ hovering }) {
  return (
    <div className="relative w-12 h-12">
      {/* HEAD */}
      <motion.div
        className="absolute w-10 h-10 bg-white rounded-full left-1/2 -translate-x-1/2"
        animate={hovering ? { scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] } : { y: [0, -2.6, 0] }}
        transition={hovering ? { duration: 0.45, ease: "easeInOut" } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* EYES */}
        <motion.div
          className="absolute w-2 h-2 bg-black rounded-full"
          style={{ left: "25%", top: "40%" }}
          animate={hovering ? { scaleY: [1, 0.2, 1] } : {}}
          transition={{ duration: 0.18 }}
        />
        <motion.div
          className="absolute w-2 h-2 bg-black rounded-full"
          style={{ right: "25%", top: "40%" }}
          animate={hovering ? { scaleY: [1, 0.2, 1] } : {}}
          transition={{ duration: 0.18 }}
        />

        {/* BLUSH: base opacity + stronger on hover */}
        <motion.div
          className="absolute w-2 h-1.5 bg-pink-300 rounded-full"
          style={{ left: "15%", top: "55%" }}
          animate={{ opacity: hovering ? 0.88 : 0.55 }}
          transition={{ duration: 0.16 }}
        />
        <motion.div
          className="absolute w-2 h-1.5 bg-pink-300 rounded-full"
          style={{ right: "15%", top: "55%" }}
          animate={{ opacity: hovering ? 0.88 : 0.55 }}
          transition={{ duration: 0.16 }}
        />

        {/* MOUTH */}
        <motion.div
          className="absolute w-4 h-2 border-b-2 border-black rounded-full"
          style={{ left: "30%", top: "60%" }}
          animate={hovering ? { scaleY: 1.45, y: -1 } : { scaleY: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        />
      </motion.div>

      {/* POINTER/DIAMOND */}
      <motion.div
        className="absolute -bottom-1 left-1/2 w-4 h-4 -translate-x-1/2"
        animate={hovering ? { y: [0, -4, 0] } : { y: [0, 2, 0] }}
        transition={hovering ? { duration: 0.3, repeat: Infinity, repeatType: "reverse" } : { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="w-full h-full bg-white rotate-45" />
      </motion.div>
    </div>
  );
}

// ------------------- NAVBAR -------------------
export default function LunarNavbar() {
  const items = [
    { name: "HOME", url: "/home" },
    { name: "POPULAR", url: "/popular" },
    { name: "MOVIE", url: "/movie" },
    { name: "RANDOM", url: "/random" },
    { name: "SHEDULE", url: "/shedule" },
  ];

  const [active, setActive] = useState("HOME");
  const [hovering, setHovering] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@700&display=swap');
          :root { --geist: 'Geist Mono', monospace; }
        `}
      </style>

      {/* LOWERED NAVBAR TOP so mascot head fully visible */}
      <div className="fixed left-0 right-0 z-[9999] flex justify-center select-none pointer-events-none" style={{ top: 26 }}>
        <div className="flex justify-center pointer-events-auto pt-6 relative">

          {/* NAV BAR FRAME */}
          <motion.div
            className="flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-lg shadow-lg w-auto py-2 px-2 rounded-full"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{ height: 44 }} // reduced height so compact
          >
            {/* LUNAR TEXT - corrected styling */}
            <span
              className="text-white font-bold"
              style={{
                fontFamily: "var(--geist)",
                fontWeight: 700,
                letterSpacing: "-0.6px",
                fontSize: "16px",
                transform: "translateY(-1px)",
              }}
            >
              LUNAR
            </span>

            {/* DESKTOP TABS */}
            <div className="hidden md:flex items-center space-x-1 ml-3">
              {items.map((item) => {
                const isActive = item.name === active;
                const isHover = hovering === item.name;

                return (
                  <motion.a
                    key={item.name}
                    href={item.url}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive(item.name);
                      window.location.href = item.url;
                    }}
                    onMouseEnter={() => setHovering(item.name)}
                    onMouseLeave={() => setHovering(null)}
                    className="relative cursor-pointer text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 text-white/70 hover:text-white"
                    style={{ fontSize: 14.5 }} // slightly smaller tab text
                  >
                    {/* INNER ACTIVE GLOW */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="absolute inset-0 bg-white/15 rounded-full blur-md" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* TAB TEXT */}
                    <motion.span
                      className="relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.name}
                    </motion.span>

                    {/* === MASCOT APPEARS ABOVE THE ACTIVE TAB ONLY === */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-none z-[200]"
                          layoutId="mascot-position"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <Mascot hovering={isHover} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.a>
                );
              })}
            </div>

            {/* MOBILE ICON */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white p-1.5"
            >
              {mobileOpen ? "✖" : "☰"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed inset-x-4 top-24 z-[9998] rounded-2xl bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl p-4 md:hidden"
          >
            {items.map((item) => (
              <a
                key={item.name}
                href={item.url}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(item.name);
                  window.location.href = item.url;
                }}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
