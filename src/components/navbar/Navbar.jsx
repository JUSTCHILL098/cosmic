// LunarNavbar.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ------------------- MASCOT COMPONENT -------------------
function Mascot({ hovering }) {
  return (
    <div className="relative w-14 h-14">
      {/* MAIN FACE */}
      <motion.div
        className="absolute w-12 h-12 bg-white rounded-full left-1/2 -translate-x-1/2"
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
          style={{ left: "25%", top: "38%" }}
          animate={hovering ? { scaleY: [1, 0.2, 1] } : {}}
        />
        <motion.div
          className="absolute w-2 h-2 bg-black rounded-full"
          style={{ right: "25%", top: "38%" }}
          animate={hovering ? { scaleY: [1, 0.2, 1] } : {}}
        />

        {/* BLUSH FIXED (now visible) */}
        <motion.div
          className="absolute w-3 h-2 bg-pink-300 rounded-full opacity-70"
          style={{ left: "12%", top: "58%" }}
          animate={{ opacity: hovering ? 1 : 0.7 }}
        />
        <motion.div
          className="absolute w-3 h-2 bg-pink-300 rounded-full opacity-70"
          style={{ right: "12%", top: "58%" }}
          animate={{ opacity: hovering ? 1 : 0.7 }}
        />

        {/* MOUTH */}
        <motion.div
          className="absolute w-5 h-2 border-b-2 border-black rounded-full"
          style={{ left: "33%", top: "65%" }}
          animate={
            hovering
              ? { scaleY: 1.4, y: -1 }
              : { scaleY: 1, y: 0 }
          }
        />

        {/* SPARKLES */}
        <AnimatePresence>
          {hovering && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -top-1 -right-1 text-yellow-300"
              >
                ✨
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute -top-2 left-0 text-yellow-300"
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
            ? { y: [0, -4, 0], transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" } }
            : { y: [0, 2, 0], transition: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }
        }
      >
        <div className="w-full h-full bg-white rotate-45" />
      </motion.div>
    </div>
  );
}

// ------------------- NAVBAR -------------------
export default function LunarNavbar() {
  const items = [
    { name: "Home", url: "/home" },
    { name: "Popular", url: "/popular" },
    { name: "Movie", url: "/movie" },
    { name: "Random", url: "/random" },
    { name: "Schedule", url: "/schedule" }
  ];

  const [active, setActive] = useState("Home");
  const [hovering, setHovering] = useState(null);

  return (
    <>
      {/* FONT FOR LUNAR */}
      <style>{`
        :root { --geist: 'Geist Mono', monospace; }
      `}</style>

      {/* LOWERED NAVBAR SO HEAD IS VISIBLE */}
      <div className="fixed left-0 right-0 top-[20px] z-[9999] flex justify-center select-none pointer-events-none">

        <div className="flex justify-center pointer-events-auto pt-4">
          <motion.div
            className="flex items-center gap-4 bg-black/50 border border-white/10 backdrop-blur-lg shadow-lg w-auto py-3 px-4 rounded-full"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* LUNAR TEXT */}
            <span
              className="font-bold text-lg text-white"
              style={{
                fontFamily: "var(--geist)",
                fontWeight: 700,
                letterSpacing: "-0.7px",
              }}
            >
              LUNAR
            </span>

            {/* MENU ITEMS */}
            <div className="hidden md:flex items-center space-x-2 ml-2">
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
                    className="relative cursor-pointer text-sm px-6 py-3 rounded-full text-white/70 hover:text-white transition-all"
                  >
                    {/* ACTIVE GLOW */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-full -z-10 overflow-visible"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="absolute inset-0 bg-white/15 rounded-full blur-md" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* MASCOT ON TOP OF ACTIVE TAB */}
                    {isActive && (
                      <motion.div
                        layoutId="mascot"
                        className="absolute -top-[66px] left-1/2 -translate-x-1/2"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <Mascot hovering={isHover} />
                      </motion.div>
                    )}

                    <span className="relative z-10">{item.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
