// FINAL LUNAR NAVBAR (S2 SPACING + GHOST DOLL ABOVE NAVBAR)
// EXACT clone of the navbar from your local Lunar HTML
// Includes:
//  • Medium spacing (S2)
//  • LUNAR in Geist Mono 700/800
//  • Menu items in Geist Mono 400
//  • Doll image above navbar that scrolls WITH the navbar
//  • Correct height (~50–52px)
//  • Medium width (not oversized)
//  • Blur, border, shadow exactly like Lunar
//  • Pixel-matched spacing

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Doll from "@/src/assets/doll.png";   // <-- replace with your doll image

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Features", path: "/features" },
    { name: "Changelog", path: "/changelog" },
    { name: "Contact", path: "/contact" },
    { name: "View Animes", path: "/animes" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;700;800&display=swap');
      `}</style>

      {/* DOLL ABOVE NAVBAR (scrolls with navigation bar) */}
      <div className="fixed top-0 left-0 right-0 flex justify-center z-[200001] pointer-events-none select-none">
        <img
          src={Doll}
          alt="doll"
          className="w-[38px] h-[38px] mt-[-10px] opacity-90"
        />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-6 left-0 right-0 flex justify-center z-[200000] select-none">
        <div
          className="
            w-full max-w-[980px]
            h-[52px]
            bg-black/60
            backdrop-blur-xl
            border border-white/10
            rounded-full
            shadow-[0_0_20px_rgba(0,0,0,0.55)]
            flex items-center justify-between
            px-6
          "
        >
          {/* LEFT: LUNAR */}
          <div
            className="text-white font-bold"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "17px",
              letterSpacing: "0.5px",
            }}
          >
            LUNAR
          </div>

          {/* CENTER MENU – S2 SPACING */}
          <div className="flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative px-4 py-1 rounded-full transition text-white/80 hover:text-white"
                  style={{ fontFamily: "'Geist Mono', monospace", fontSize: "14px" }}
                >
                  {/* Active highlight bubble */}
                  {isActive && (
                    <span
                      className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full"
                    ></span>
                  )}
                  <span className={isActive ? "relative z-10" : ""}>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Invisible spacer for perfect centering */}
          <div className="w-[50px]"></div>
        </div>
      </nav>
    </>
  );
}
