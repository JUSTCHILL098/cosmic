// LunarNavbar.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------
//   Mascot Component
// ---------------------
function Mascot({ hovering }) {
  return (
    <motion.div
      className="relative w-12 h-12"
      animate={
        hovering
          ? { y: [-4, -7, -4], rotate: [0, 3, -3, 0] }
          : { y: [-3, -5, -3] }
      }
      transition={{
        duration: hovering ? 0.6 : 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Face */}
      <div className="absolute w-10 h-10 bg-white rounded-full left-1/2 -translate-x-1/2 shadow-xl">
        {/* Eyes */}
        <motion.div
          className="absolute w-2 h-2 bg-black rounded-full"
          style={{ left: "26%", top: "38%" }}
          animate={hovering ? { scaleY: [1, 0.3, 1] } : {}}
        />
        <motion.div
          className="absolute w-2 h-2 bg-black rounded-full"
          style={{ right: "26%", top: "38%" }}
          animate={hovering ? { scaleY: [1, 0.3, 1] } : {}}
        />

        {/* Blush */}
        <motion.div
          className="absolute w-2.5 h-1.5 bg-pink-300 rounded-full"
          style={{ left: "15%", top: "58%" }}
          animate={{ opacity: hovering ? 1 : 0.7 }}
        />
        <motion.div
          className="absolute w-2.5 h-1.5 bg-pink-300 rounded-full"
          style={{ right: "15%", top: "58%" }}
          animate={{ opacity: hovering ? 1 : 0.7 }}
        />

        {/* Mouth */}
        <motion.div
          className="absolute w-4 h-2 border-b-2 border-black rounded-full"
          style={{ left: "33%", top: "63%" }}
          animate={{
            scaleY: hovering ? 1.4 : 1,
            y: hovering ? -1 : 0,
          }}
        />
      </div>

      {/* Sparkles */}
      <AnimatePresence>
        {hovering && (
          <>
            <motion.div
              className="absolute -top-1 -right-1 text-yellow-300"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              ✨
            </motion.div>

            <motion.div
              className="absolute -top-2 left-0 text-yellow-300"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.1 }}
            >
              ✨
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pointer diamond */}
      <motion.div
        className="absolute -bottom-1 left-1/2 w-4 h-4 -translate-x-1/2"
        animate={
          hovering
            ? { y: [-1, -3, -1] }
            : { y: [1, 3, 1] }
        }
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full bg-white rotate-45" />
      </motion.div>
    </motion.div>
  );
}

// ---------------------
//   NAVBAR COMPONENT
// ---------------------
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@700&display=swap');
      `}</style>

      <div className="fixed left-0 right-0 top-6 flex justify-center z-[9999]">
        <div className="relative">

          {/* Mascot ABOVE active tab */}
          <motion.div
            className="absolute -top-16 left-0 right-0 flex justify-center pointer-events-none"
            layout
          >
            <motion.div
              key={active}
              layoutId="mascot-position"
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative flex justify-center"
            >
              <Mascot hovering={hovering === active} />
            </motion.div>
          </motion.div>

          {/* NAV CONTAINER */}
          <motion.div
            className="flex bg-black/50 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-full items-center gap-3 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* LUNAR TEXT - Geist Mono 700 */}
            <span
              className="text-white"
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 700,
                fontSize: "18px",
                letterSpacing: "-0.6px",
              }}
            >
              LUNAR
            </span>

            {/* NAV ITEMS */}
            {items.map((item) => {
              const isActive = item.name === active;

              return (
                <motion.div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setHovering(item.name)}
                  onMouseLeave={() => setHovering(null)}
                >
                  {/* FULL GLOW for active */}
                  {isActive && (
                    <motion.div
                      layoutId="glow"
                      className="absolute inset-0 rounded-full -z-10"
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="absolute inset-0 bg-white/40 blur-xl rounded-full" />
                      <div className="absolute inset-0 bg-white/15 rounded-full" />
                    </motion.div>
                  )}

                  <a
                    href={item.url}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive(item.name);
                      window.location.href = item.url;
                    }}
                    className="px-6 py-3 text-sm font-medium text-white/80 hover:text-white transition-all"
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                  >
                    {item.name}
                  </a>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </>
  );
}
