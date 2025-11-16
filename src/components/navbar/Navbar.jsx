import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navRef = useRef(null);
  const menuRefs = useRef({});
  const [dollStyle, setDollStyle] = useState({ left: -9999, top: -9999, opacity: 0 });

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Features", path: "/features" },
    { name: "Changelog", path: "/changelog" },
    { name: "Contact", path: "/contact" },
    { name: "View Animes", path: "/animes" },
  ];

  function moveDollTo(el) {
    if (!el || !navRef.current) {
      setDollStyle((s) => ({ ...s, opacity: 0 }));
      return;
    }

    const rect = el.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const top = navRect.top + window.scrollY + 10;

    setDollStyle({
      left: centerX,
      top,
      opacity: 1,
    });
  }

  useEffect(() => {
    let active = navItems.find((i) => i.path === location.pathname) || navItems[0];
    const el = menuRefs.current[active.name];

    requestAnimationFrame(() => moveDollTo(el));

    const update = () => moveDollTo(el);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [location.pathname]);

  return (
    <>
      <style>{`
        :root {
          --geist: "Geist Mono", "Geist Mono Fallback", monospace;
        }
      `}</style>

      {/* DOLL */}
      <div
        style={{
          position: "absolute",
          left: dollStyle.left,
          top: dollStyle.top,
          transform: "translateX(-50%)",
          transition: "left 250ms cubic-bezier(.25,.8,.25,1), top 150ms ease",
          pointerEvents: "none",
          zIndex: 200002,
          opacity: dollStyle.opacity,
        }}
      >
        <svg width="52" height="52" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="white" />
          <circle cx="9" cy="10" r="1.5" fill="black" />
          <circle cx="15" cy="10" r="1.5" fill="black" />
          <path d="M8 15 Q12 18 16 15" stroke="black" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </div>

      {/* NAVBAR */}
      <nav
        ref={navRef}
        className="fixed left-0 right-0 flex justify-center select-none"
        style={{ zIndex: 200000 }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "680px",           // wider so LUNAR fits cleanly
            height: "66px",              // taller for proper vertical centering
            marginTop: "24px",
            background: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "999px",
            padding: "0 20px",           // increased to give breathing room
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LOGO */}
          <div
            style={{
              fontFamily: "var(--geist)",
              fontWeight: 700,
              fontSize: "17.5px",
              color: "white",
            }}
          >
            KAITO
          </div>

          {/* MENU */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px", // little bit of space between texts
            }}
          >
            {navItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  ref={(el) => (menuRefs.current[item.name] = el)}
                  onClick={() => moveDollTo(menuRefs.current[item.name])}
                  style={{
                    position: "relative",
                    padding: "10px 18px",
                    borderRadius: "999px",
                    color: active ? "#fff" : "rgba(255,255,255,0.78)",
                    fontFamily: "var(--geist)",
                    fontWeight: 500,
                    fontSize: "16px",   // stronger text, not timid
                    textDecoration: "none",
                    transition: "color 150ms ease",
                  }}
                >
                  {/* TRUE Lunar Inner Glow */}
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.14)",  
                        backdropFilter: "blur(10px)",          // perfect frosted effect
                        zIndex: 0,
                      }}
                    />
                  )}

                  <span style={{ position: "relative", zIndex: 1 }}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
