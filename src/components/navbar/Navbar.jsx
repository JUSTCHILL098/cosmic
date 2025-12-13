import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

/* =======================
   INLINE HELPERS (NO IMPORTS)
======================= */
const cn = (...c) => c.filter(Boolean).join(" ");

const CookieMock = {
  get: (k) => localStorage.getItem(k),
  set: (k, v) => localStorage.setItem(k, v),
};

const usePathname = () => {
  const [p, setP] = useState(window.location.pathname);
  useEffect(() => {
    const h = () => setP(window.location.pathname);
    window.addEventListener("popstate", h);
    return () => window.removeEventListener("popstate", h);
  }, []);
  return p;
};

const IconMark = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
  </svg>
);

/* =======================
   NAVBAR
======================= */
export default function Navbar({ items = [] }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState("Home");
  const [hovered, setHovered] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const resize = () => setIsMobile(window.innerWidth < 768);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* ===== NAVBAR CONTAINER ===== */}
      <div className="fixed inset-x-0 top-4 z-[9999] flex justify-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={cn(
            "flex items-center gap-4",
            "px-4 py-2",
            "rounded-full",
            /* 🔥 THIS IS THE FIX */
            "bg-[#0e0e0e]/70",
            "backdrop-blur-xl",
            "border border-white/10",
            "shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
          )}
        >
          {/* ===== LOGO ===== */}
          <div className="flex items-center gap-2 px-2">
            <IconMark className="h-7 w-7 text-indigo-400" />
            <span className="font-mono font-bold text-white">LUNAR</span>
          </div>

          {/* ===== DESKTOP ===== */}
          {!isMobile && (
            <div className="flex items-center gap-1">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    onMouseEnter={() => setHovered(item.name)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive(item.name);
                      window.location.href = item.url;
                    }}
                    className={cn(
                      "relative px-5 py-2 rounded-full",
                      "text-sm font-medium",
                      isActive ? "text-white" : "text-white/70 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-white/10 -z-10" />
                    )}
                    {item.name}
                  </a>
                );
              })}
            </div>
          )}

          {/* ===== MOBILE BUTTON ===== */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-2"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          )}
        </motion.div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-4 top-20 z-[9998] rounded-2xl bg-[#0e0e0e]/95 backdrop-blur-xl border border-white/10 p-4"
          >
            {items.map((item) => (
              <a
                key={item.name}
                href={item.url}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
