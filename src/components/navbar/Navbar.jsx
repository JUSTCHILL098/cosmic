// LunarNavbar.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mascot Component (smaller + centered above active tab)
function Mascot({ hovering }) {
  return (
    <div className="relative w-10 h-10">
      {/* Head */}
      <motion.div
        className="absolute w-8 h-8 bg-white rounded-full left-1/2 -translate-x-1/2"
        animate={
          hovering
            ? { scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          hovering
            ? { duration: 0.5, ease: "easeInOut" }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Eyes */}
        <motion.div
          className="absolute w-1.5 h-1.5 bg-black rounded-full"
          style={{ left: "25%", top: "40%" }}
          animate={hovering ? { scaleY: [1, 0.2, 1] } : {}}
        />
        <motion.div
          className="absolute w-1.5 h-1.5 bg-black rounded-full"
          style={{ right: "25%", top: "40%" }}
          animate={hovering ? { scaleY: [1, 0.2, 1] } : {}}
        />

        {/* Blush FIXED */}
        <motion.div
          className="absolute w-2 h-1 bg-pink-300 rounded-full"
          style={{ left: "17%", top: "58%" }}
          animate={{ opacity: hovering ? 0.9 : 0.55 }}
        />
        <motion.div
          className="absolute w-2 h-1 bg-pink-300 rounded-full"
          style={{ right: "17%", top: "58%" }}
          animate={{ opacity: hovering ? 0.9 : 0.55 }}
        />

        {/* Mouth */}
        <motion.div
          className="absolute w-3 h-1.5 border-b-2 border-black rounded-full"
          style={{ left: "32%", top: "63%" }}
          animate={hovering ? { scaleY: 1.4, y: -1 } : { scaleY: 1, y: 0 }}
        />

        {/* Sparkles */}
        <AnimatePresence>
          {hovering && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -top-1 -right-1 text-yellow-300 text-xs"
              >
                ✨
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute -top-2 left-0 text-yellow-300 text-xs"
              >
                ✨
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Diamond pointer */}
      <motion.div
        className="absolute -bottom-1 left-1/2 w-3 h-3 -translate-x-1/2"
        animate={
          hovering
            ? { y: [0, -4, 0], transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" } }
            : { y: [0, 2, 0], transition: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }
        }
      >
        <div className="w-full h-full bg-white rotate-45" />
      </motion.div>
    </div>
  );
}

export default function LunarNavbar() {
  const items = ["Home", "Popular", "Movie", "Random", "Schedule"];

  const [active, setActive] = useState("Home");
  const [hovering, setHovering] = useState(null);

  return (
    <>
      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@700&display=swap');
        :root { --geist: "Geist Mono", monospace; }
      `}</style>

      {/* Navbar WRAPPER (moved slightly up) */}
      <div className="fixed left-0 right-0 top-4 z-[9999] flex justify-center select-none pointer-events-none">
        <div className="pointer-events-auto pt-4">
          {/* Navbar Container */}
          <motion.div
            className="flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-lg shadow-lg rounded-full px-3 py-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Mascot FOLLOWING ACTIVE TAB */}
            <AnimatePresence>
              <motion.div
                key={active}
                layoutId="mascot"
                className="absolute -top-12 left-0 right-0 mx-auto flex justify-center pointer-events-none"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Mascot hovering={hovering === active} />
              </motion.div>
            </AnimatePresence>

            {/* LUNAR */}
            <span
              className="font-bold text-white text-lg"
              style={{
                fontFamily: "var(--geist)",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              LUNAR
            </span>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center ml-4 space-x-1">
              {items.map((name) => {
                const isActive = name === active;

                return (
                  <motion.div
                    key={name}
                    onClick={() => setActive(name)}
                    onMouseEnter={() => setHovering(name)}
                    onMouseLeave={() => setHovering(null)}
                    className="relative cursor-pointer px-5 py-2 text-sm font-medium text-white/70 hover:text-white rounded-full"
                  >
                    {/* Glow following active tab */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="glow"
                          className="absolute inset-0 rounded-full bg-white/15 blur-md -z-10"
                          transition={{ type: "spring", stiffness: 250, damping: 25 }}
                        />
                      )}
                    </AnimatePresence>

                    {name}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
