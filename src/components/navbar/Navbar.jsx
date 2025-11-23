// LunarNavbar.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ======================
// Mascot Component
// ======================
function Mascot({ hovering }) {
  return (
    <div className="relative w-12 h-12">
      <motion.div
        className="absolute w-10 h-10 bg-white rounded-full left-1/2 -translate-x-1/2"
        animate={
          hovering
            ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          hovering
            ? { duration: 0.5, ease: "easeInOut" }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* EYES */}
        <motion.div
          className="absolute w-2 h-2 bg-black rounded-full"
          style={{ left: "25%", top: "40%" }}
          animate={hovering ? { scaleY: [1, 0.2, 1] } : {}}
        />
        <motion.div
          className="absolute w-2 h-2 bg-black rounded-full"
          style={{ right: "25%", top: "40%" }}
          animate={hovering ? { scaleY: [1, 0.2, 1] } : {}}
        />

        {/* BLUSH */}
        <motion.div
          className="absolute w-2 h-1.5 bg-pink-300 rounded-full"
          style={{ left: "15%", top: "55%" }}
          animate={{ opacity: hovering ? 0.8 : 0.6 }}
        />
        <motion.div
          className="absolute w-2 h-1.5 bg-pink-300 rounded-full"
          style={{ right: "15%", top: "55%" }}
          animate={{ opacity: hovering ? 0.8 : 0.6 }}
        />

        {/* MOUTH */}
        <motion.div
          className="absolute w-4 h-2 border-b-2 border-black rounded-full"
          style={{ left: "30%", top: "60%" }}
          animate={hovering ? { scaleY: 1.5, y: -1 } : { scaleY: 1, y: 0 }}
        />

        {/* SPARKLES */}
        <AnimatePresence>
          {hovering && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -top-1 -right-1 w-2 h-2 text-yellow-300"
              >
                ✨
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute -top-2 left-0 w-2 h-2 text-yellow-300"
              >
                ✨
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* POINTER DIAMOND */}
      <motion.div
        className="absolute -bottom-1 left-1/2 w-4 h-4 -translate-x-1/2"
        animate={
          hovering
            ? {
                y: [0, -4, 0],
                transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
              }
            : {
                y: [0, 2, 0],
                transition: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              }
        }
      >
        <div className="w-full h-full bg-white rotate-45" />
      </motion.div>
    </div>
  );
}

// ======================
// Navbar Component
// ======================
export default function LunarNavbar() {
  const items = [
    { name: "Home", url: "/home" },
    { name: "Features", url: "/features" },
    { name: "Changelog", url: "/changelog" },
    { name: "Contact", url: "/contact" },
    { name: "View Anime", url: "/view-anime" },
  ];

  const [active, setActive] = useState("Home");
  const [hovering, setHovering] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://api.fonts.coollabs.io/css2?family=Geist+Mono:wght@700&display=swap');
      `}</style>

      <div className="fixed left-0 right-0 top-5 z-[9999] flex justify-center select-none pointer-events-none">
        <div className="pointer-events-auto pt-6">
          <motion.div
            className="relative flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-lg shadow-lg w-auto py-2 px-3 rounded-full"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* ⭐ Mascot ABOVE ACTIVE TAB */}
            <AnimatePresence>
              <motion.div
                layoutId="active-mascot"
                className="absolute -top-12 left-[50%] -translate-x-1/2"
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Mascot hovering={hovering === active} />
              </motion.div>
            </AnimatePresence>

            {/* LUNAR TEXT — Geist Mono 700 */}
            <span
              className="text-white text-lg font-bold"
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              LUNAR
            </span>

            {/* DESKTOP NAV ITEMS */}
            <div className="hidden md:flex items-center space-x-2 ml-3">
              {items.map((item) => {
                const isActive = active === item.name;
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
                    className="relative cursor-pointer text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 text-white/70 hover:text-white"
                  >
                    {/* ⭐ ACTIVE GLOW */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-full -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 24 }}
                        >
                          <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.span className="relative z-10">{item.name}</motion.span>
                  </motion.a>
                );
              })}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-1.5">
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
