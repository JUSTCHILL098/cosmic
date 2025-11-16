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

    // BIGGER DOLL + LOWERED PROPERLY
    const top = navRect.top + window.scrollY + 6;

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

    const onResize = () => moveDollTo(el);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, [location.pathname]);

  return (
    <>
      <style>{`
        :root { --geist: "Geist Mono", "Geist Mono Fallback", monospace; }
      `}</style>

      {/* DOLL (BIG + CENTERED + NOT CUT OFF) */}
      <div
        style={{
          position: "absolute",
          left: dollStyle.left,
          top: dollStyle.top,
          transform: "translateX(-50%)",
          transition: "left 260ms cubic-bezier(.25,.8,.25,1), top 160ms ease",
          pointerEvents: "none",
          zIndex: 200002,
          opacity: dollStyle.opacity,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#fff" />
          <circle cx="9" cy="10" r="1.4" fill="#000" />
          <circle cx="15" cy="10" r="1.4" fill="#000" />
          <path d="M8 15 Q12 18 16 15" stroke="#000" strokeWidth="1.7" strokeLinecap="round" />
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
            maxWidth: "680px",   // SMALLER WIDTH
            height: "60px",
            marginTop: "24px",
            background: "rgba(0,0,0,0.60)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "999px",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
          }}
        >
          {/* LUNAR */}
          <div
            style={{
              fontFamily: "var(--geist)",
              fontWeight: 700,   // YOU REQUESTED 700
              fontSize: "16px",
              color: "#fff",
            }}
          >
            LUNAR
          </div>

          {/* MENU (tight spacing, no padding/margin) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",   // TIGHT LIKE BEFORE
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
                    padding: "8px 14px",  // natural small Lunar paddings
                    borderRadius: "999px",
                    color: active ? "#fff" : "rgba(255,255,255,0.80)",
                    fontFamily: "var(--geist)",
                    fontWeight: 400,
                    fontSize: "14px",
                    textDecoration: "none",
                    transition: "color 150ms ease",
                  }}
                >
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(4px)",
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
