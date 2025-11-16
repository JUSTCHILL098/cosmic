import { useLocation, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const location = useLocation();
  const menuRefs = useRef({});
  const [dollPos, setDollPos] = useState({ left: 0, width: 0 });

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Features", path: "/features" },
    { name: "Changelog", path: "/changelog" },
    { name: "Contact", path: "/contact" },
    { name: "View Animes", path: "/animes" },
  ];

  // Move doll to active tab
  useEffect(() => {
    const active = navItems.find(i => i.path === location.pathname);
    if (active && menuRefs.current[active.name]) {
      const rect = menuRefs.current[active.name].getBoundingClientRect();
      setDollPos({
        left: rect.left + rect.width / 2,
        width: rect.width,
      });
    }
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;700;800&display=swap');
      `}</style>

      {/* DOLL ABOVE ACTIVE ITEM */}
      <div
        className="fixed z-[200002] transition-all duration-300 ease-out"
        style={{
          left: dollPos.left,
          top: "40px",
          transform: "translateX(-50%)",
        }}
      >
        {/* EXACT LUNAR FACE SVG */}
        <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="12" r="10" />
          <circle cx="9" cy="10" r="1.5" fill="black" />
          <circle cx="15" cy="10" r="1.5" fill="black" />
          <path d="M8 15 Q12 18 16 15" stroke="black" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        </svg>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-16 left-0 right-0 flex justify-center z-[200000] select-none">
        <div
          className="
            w-full max-w-[980px]
            h-[52px]
            bg-black/60
            backdrop-blur-xl
            border border-white/10
            rounded-full
            shadow-[0_0_20px_rgba(0,0,0,0.5)]
            flex items-center justify-between px-6
          "
        >
          {/* LUNAR TEXT */}
          <div
            className="text-white font-bold"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "17px",
            }}
          >
            LUNAR
          </div>

          {/* MENU ITEMS */}
          <div className="flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  ref={(el) => (menuRefs.current[item.name] = el)}
                  className="relative px-4 py-1 rounded-full transition text-white/80 hover:text-white"
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "14px",
                  }}
                >
                  {/* Active bubble */}
                  {isActive && (
                    <span className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full"></span>
                  )}
                  <span className={isActive ? "relative z-10" : ""}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="w-[50px]"></div>
        </div>
      </nav>
    </>
  );
}
