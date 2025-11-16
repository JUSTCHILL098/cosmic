import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <nav className="fixed top-6 left-0 right-0 flex justify-center z-[99999] select-none">
        <div
          className="
            w-full max-w-[1150px] 
            h-[56px] 
            bg-black/60 
            backdrop-blur-xl
            border border-white/10
            rounded-full 
            flex items-center justify-between 
            px-6
            shadow-[0_0_25px_rgba(0,0,0,0.6)]
          "
        >
          {/* LEFT: LUNAR */}
          <div
            className="font-semibold text-white tracking-wide"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "17px",
            }}
          >
            LUNAR
          </div>

          {/* CENTER MENU */}
          <div className="flex items-center gap-5 mx-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    relative px-4 py-1 rounded-full transition
                    text-white/80 hover:text-white
                    ${isActive ? "text-white" : ""}
                  `}
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "15px" }}
                >
                  {/* Active tab pill */}
                  {isActive && (
                    <span
                      className="
                        absolute inset-0 
                        bg-white/10 
                        backdrop-blur-sm 
                        rounded-full
                      "
                    ></span>
                  )}

                  <span className={isActive ? "relative z-10" : ""}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* EMPTY right side (for perfect centering like screenshot) */}
          <div className="w-[60px]"></div>
        </div>
      </nav>
    </>
  );
}
