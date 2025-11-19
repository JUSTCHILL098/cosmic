// LunarNavbar.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ------------------- MASCOT -------------------
function Mascot({ hovering }) {
  return (
    <div className="relative w-12 h-12">
      {/* MAIN HEAD */}
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
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute w-2 h-2 bg-black rounded-full"
          style={{ right: "25%", top: "40%" }}
          animate={hovering ? { scaleY: [1, 0.2, 1] } : {}}
          transition={{ duration: 0.2 }}
        />

        {/* BLUSH FIXED */}
        <motion.div
          className="absolute w-2 h-1.5 bg-pink-300 rounded-full"
          style={{ left: "15%", top: "55%" }}
          animate={{ opacity: hovering ? 0.85 : 0.55 }}
        />
        <motion.div
          className="absolute w-2 h-1.5 bg-pink-300 rounded-full"
          style={{ right: "15%", top: "55%" }}
          animate={{ opacity: hovering ? 0.85 : 0.55 }}
        />

        {/* MOUTH */}
        <motion.div
          className="absolute w-4 h-2 border-b-2 border-black rounded-full"
          style={{ left: "30%", top: "60%" }}
          animate={
            hovering ? { scaleY: 1.5, y: -1 } : { scaleY: 1, y: 0 }
          }
        />
      </motion.div>

      {/* POINTER / DIAMOND */}
      <motion.div
        className="absolute -bottom-1 left-1/2 w-4 h-4 -translate-x-1/2"
        animate={
          hovering
            ? { y: [0, -4, 0] }
            : { y: [0, 2, 0] }
        }
        transition={
          hovering
            ? { duration: 0.3, repeat: Infinity, repeatType: "reverse" }
            : { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
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
    { name: "Schedule", url: "/schedule" },
  ];

  const [active, setActive] = useState("Home");
  const [hovering, setHovering] = useState(null);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@700&display=swap');
          :root { --geist: 'Geist Mono', monospace; }
        `}
      </style>

      {/* FIXED NAV HEIGHT & POSITION */}
      <div className="fixed left-0 right-0 top-5 z-[9999] flex justify-center select-none pointer-events-none">
        <motion.div
          className="flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-lg shadow-lg rounded-full py-2 px-3 pointer-events-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ height: "48px" }} // SMALLER HEIGHT LIKE LUNAR
        >
          {/* MASCOT ALWAYS ON LEFT */}
          <motion.div
            animate={
              hovering
                ? { y: [0, -5, 0], rotate: [0, 5, 0, -5, 0] }
                : { y: [0, -5, 0] }
            }
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          >
            <Mascot hovering={hovering} />
          </motion.div>

          {/* PERFECT LUNAR TEXT */}
          <span
            className="text-white font-bold"
            style={{
              fontFamily: "var(--geist)",
              fontWeight: 700,
              letterSpacing: "-0.6px",
              fontSize: "18px",
              transform: "translateY(-1px)",
            }}
          >
            LUNAR
          </span>

          {/* MENU ITEMS */}
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
                >
                  {/* GLOW UNDER TEXT (INSIDE ONLY) */}
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

                  {/* TEXT */}
                  <motion.span
                    className="relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.name}
                  </motion.span>

                  {/* MASCOT ON TOP OF ACTIVE TAB — FIXED POSITION */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute -top-12 left-1/2 -translate-x-1/2"
                        layoutId="mascot-position"
                        initial={false}
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
        </motion.div>
      </div>
    </>
  );
}
