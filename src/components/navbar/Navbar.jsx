"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Flame,
  Film,
  Search,
  Sparkles
} from "lucide-react";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "movies", label: "Movies", icon: Film },
  { id: "random", label: "Random", icon: Sparkles }
];

// Mascot SVG (clean + cute like LunarAnime)
function Mascot() {
  return (
    <motion.div
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="w-12 h-12 flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-10 h-10 rounded-full bg-white shadow-xl"
      />
    </motion.div>
  );
}

export default function LunarNavbar() {
  const [active, setActive] = useState("home");

  return (
    <nav
      style={{ fontFamily: "Geist Mono" }}
      className="fixed top-0 left-0 w-full bg-[#0c0c0c]/80 backdrop-blur-xl border-b border-white/10 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">

        {/* LOGO */}
        <motion.div
          className="text-white text-3xl font-bold tracking-tight"
          style={{ fontFamily: "Geist Mono", fontWeight: 700 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          LUNAR
        </motion.div>

        {/* NAV TABS */}
        <div className="relative flex items-center gap-10">
          {TABS.map((tab) => {
            const Icon = tab.icon;

            const isActive = active === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className="relative flex flex-col items-center"
              >
                {/* Mascot ON TOP of active tab */}
                {isActive && (
                  <motion.div
                    layoutId="mascot"
                    className="absolute -top-14 flex items-center justify-center"
                  >
                    <Mascot />
                  </motion.div>
                )}

                {/* Active glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute -bottom-1 h-10 w-full blur-xl bg-purple-500/60 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}

                {/* Tab icon */}
                <Icon
                  className={`${
                    isActive ? "text-white" : "text-gray-400"
                  } w-6 h-6 transition-all`}
                />

                {/* Tab text */}
                <span
                  className={`mt-1 text-sm ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH ICON */}
        <Search className="text-gray-300 w-6 h-6" />
      </div>
    </nav>
  );
}
