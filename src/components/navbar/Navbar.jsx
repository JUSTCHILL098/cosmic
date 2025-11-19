import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------- MASCOT ----------------------
function Mascot({ hovering }) {
  return (
    <div className="relative w-12 h-12 pointer-events-none">
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
        {/* Eyes */}
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

        {/* Blush FIXED */}
        <motion.div
          className="absolute w-3 h-2 bg-pink-300 rounded-full opacity-70"
          style={{ left: "13%", top: "57%" }}
          animate={{ opacity: hovering ? 1 : 0.7 }}
        />
        <motion.div
          className="absolute w-3 h-2 bg-pink-300 rounded-full opacity-70"
          style={{ right: "13%", top: "57%" }}
          animate={{ opacity: hovering ? 1 : 0.7 }}
        />

        {/* Mouth */}
        <motion.div
          className="absolute w-4 h-2 border-b-2 border-black rounded-full"
          style={{ left: "30%", top: "62%" }}
          animate={hovering ? { scaleY: 1.5, y: -1 } : { scaleY: 1, y: 0 }}
        />

        {/* Sparkles */}
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

      {/* Pointer diamond */}
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

// ---------------------- NAVBAR ----------------------
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
      {/* Navbar LOWERED so head is fully visible */}
      <div className="fixed left-0 right-0 top-[26px] z-[9999] flex justify-center select-none pointer-events-none">

        <motion.div
          className="flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-lg shadow-lg py-2.5 px-3 rounded-full pointer-events-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* LUNAR text */}
          <span
            className="font-bold text-base text-white"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontWeight: 700,
            }}
          >
            LUNAR
          </span>

          {/* NAV ITEMS */}
          <div className="flex items-center space-x-1 ml-2">
            {items.map((item) => {
              const isActive = item.name === active;
              const hover = hovering === item.name;

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
                  className="relative cursor-pointer text-sm px-5 py-2.5 rounded-full text-white/70 hover:text-white"
                >
                  {/* Active Glow */}
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

                  {/* MASCOT ON TOP OF THIS TAB EXACTLY */}
                  {isActive && (
                    <motion.div
                      layoutId="mascot"
                      className="absolute -top-[62px] left-1/2 -translate-x-1/2"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <Mascot hovering={hover} />
                    </motion.div>
                  )}

                  <span className="relative z-10">{item.name}</span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
}
