import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Navbar.jsx
 * - Geist Mono used via your existing @font-face (you pasted it earlier)
 * - max-width: 900px
 * - height: 60px
 * - nav item padding: 12px 24px
 * - menu margin-left: 8px
 * - doll (inline SVG) floats above the active item and animates on route change
 * - active bubble + correct font weights
 */

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

  // helper to move doll above a given menu item element
  function moveDollTo(el) {
    if (!el || !navRef.current) {
      setDollStyle((s) => ({ ...s, opacity: 0 }));
      return;
    }
    const rect = el.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();

    const dollWidth = 34; // px (svg width)
    // compute center X (page coordinates)
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    // place doll slightly above the navbar (navRect.top is viewport Y)
    // We'll place doll  (navRect.top - 10px) relative to document
    const top = navRect.top + window.scrollY - 14; // small overlap above navbar
    setDollStyle({ left: centerX, top, opacity: 1 });
  }

  // on route change, move the doll to active item (A = active only)
  useEffect(() => {
    // find matching nav item by path; fallback to first item if none
    let active = navItems.find((i) => i.path === location.pathname);
    if (!active) {
      // attempt matching root or home routes
      if (location.pathname === "/" || location.pathname === "") active = navItems[0];
      else active = navItems[0];
    }
    const el = menuRefs.current[active.name];
    // slight timeout to allow layout/styling to settle
    requestAnimationFrame(() => moveDollTo(el));
    // reposition on resize/scroll to keep it aligned
    const onResize = () => moveDollTo(el);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // initial placement after mount
  useEffect(() => {
    // place on active item after initial paint
    setTimeout(() => {
      const active = navItems.find((i) => i.path === location.pathname) || navItems[0];
      moveDollTo(menuRefs.current[active.name]);
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* ensure Geist Mono is used if your project provides the font-face you pasted earlier.
          If not, load a fallback. */}
      <style>{`
        /* Use the local @font-face you already added; fallback to system if missing */
        :root { --geist: 'Geist Mono', 'Geist Mono Fallback', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
      `}</style>

      {/* DOLL — absolute positioned in document; translateX centers it */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: dollStyle.left,
          top: dollStyle.top,
          transform: "translateX(-50%)",
          transition: "left 300ms cubic-bezier(.2,.9,.2,1), top 220ms ease, opacity 200ms linear",
          pointerEvents: "none",
          zIndex: 200002,
          opacity: dollStyle.opacity,
        }}
      >
        {/* Inline SVG (simple Lunar face) */}
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <circle cx="12" cy="12" r="10" fill="#ffffff" />
          <circle cx="9" cy="10" r="1.4" fill="#000000" />
          <circle cx="15" cy="10" r="1.4" fill="#000000" />
          <path d="M8 15 Q12 18 16 15" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* NAVBAR */}
      <nav
        ref={navRef}
        style={{ zIndex: 200000 }}
        className="fixed left-0 right-0 flex justify-center select-none"
      >
        <div
          className="flex items-center"
          style={{
            width: "100%",
            maxWidth: "900px",        // decrease width (user requested)
            height: "60px",          // increased height slightly
            margin: "24px auto 0 auto",
            background: "rgba(0,0,0,0.60)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "999px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.55)",
            padding: "0 20px", // outer padding for full bar
            boxSizing: "border-box",
          }}
        >
          {/* Left: LUNAR */}
          <div
            style={{
              fontFamily: "var(--geist)",
              fontWeight: 800, // Geist Mono 700/800 for LUNAR
              color: "#fff",
              fontSize: "17px",
              paddingLeft: "16px",
            }}
          >
            LUNAR
          </div>

          {/* Center menu: margin 0 0 0 8px (i.e. left margin 8px) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",            // S2 spacing-ish
              margin: "0 0 0 8px",    // user-specified margin
              flex: "1",
              justifyContent: "center",
            }}
          >
            {navItems.map((it) => {
              const active = location.pathname === it.path;
              return (
                <Link
                  key={it.name}
                  to={it.path}
                  ref={(el) => (menuRefs.current[it.name] = el)}
                  onClick={() => {
                    // move doll immediately on click for snappy UX
                    moveDollTo(menuRefs.current[it.name]);
                  }}
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 24px",        // user requested padding
                    borderRadius: "999px",
                    textDecoration: "none",
                    color: active ? "#ffffff" : "rgba(255,255,255,0.80)",
                    fontFamily: "var(--geist)",
                    fontWeight: 400,             // menu items weight 400
                    fontSize: "14px",
                    zIndex: 1,
                    transition: "color 160ms ease",
                    cursor: "pointer",
                    margin: 0,
                  }}
                >
                  {/* active bubble */}
                  {active && (
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "999px",
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                        zIndex: 0,
                      }}
                    />
                  )}

                  <span style={{ position: "relative", zIndex: 2 }}>{it.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right spacer to keep centering */}
          <div style={{ width: "56px" }} />
        </div>
      </nav>
    </>
  );
}
