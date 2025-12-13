import React, { useEffect, useState } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

/* =======================
   INLINE UTILS
======================= */
const cn = (...classes) => classes.filter(Boolean).join(" ");

const CookieMock = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
};

/* =======================
   usePathname
======================= */
const usePathname = () => {
  const location = useLocation();
  return location.pathname;
};

/* =======================
   Link
======================= */
const Link = ({ to, href, children, ...props }) => (
  <RouterLink to={to || href} {...props}>
    {children}
  </RouterLink>
);

/* =======================
   IconMark
======================= */
const IconMark = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.0174 2.80157C6.37072 3.29221 2.75 7.22328 2.75 12C2.75 13.1448 2.95764 14.2397 3.33685 15.25H12.8489C10.1562 14.1916 8.25 11.5684 8.25 8.5C8.25 6.18738 9.33315 4.1283 11.0174 2.80157Z" />
    <path d="M22.75 12C22.75 6.06294 17.9371 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 13.1461 1.4296 14.2513 1.76248 15.2884H22.2375C22.5704 14.2513 22.75 13.1461 22.75 12Z" />
  </svg>
);

/* =======================
   NAVBAR
======================= */
export default function Navbar({ items = [] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const current = items.find((i) => i.url === pathname);
    if (current) setActive(current.name);
  }, [pathname, items]);

  return (
    <div className="fixed top-4 left-0 right-0 z-[9999] flex justify-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="
          flex items-center justify-between
          bg-black border border-white/10
          px-4 py-3 rounded-full
          shadow-xl w-[92%] max-w-5xl
        "
      >
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <IconMark className="w-7 h-7 text-white" />
          <span className="text-white font-bold tracking-widest">
            LUNAR
          </span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-2">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => setActive(item.name)}
              className={cn(
                "px-5 py-2 rounded-full text-sm transition",
                active === item.name
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </motion.div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              absolute top-20 w-[92%] max-w-5xl
              bg-black border border-white/10
              rounded-2xl p-4 md:hidden
            "
          >
            {items.map((item) => (
              <Link
                key={item.name}
                to={item.url}
                onClick={() => {
                  setActive(item.name);
                  setMobileOpen(false);
                }}
                className={cn(
                  "block px-4 py-3 rounded-lg transition",
                  active === item.name
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
