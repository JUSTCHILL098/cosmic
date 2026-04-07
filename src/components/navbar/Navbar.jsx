import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Clock, Flame, Tv, Film, Shuffle, Search } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import Sidebar from "../sidebar/Sidebar";
import { SearchProvider } from "@/src/context/SearchContext";

const NAV_ITEMS = [
  { name: "Home",     url: "/home",           icon: Home  },
  { name: "Popular",  url: "/most-popular",   icon: Flame },
  { name: "Movies",   url: "/movie",          icon: Film  },
  { name: "TV",       url: "/tv",             icon: Tv    },
  { name: "Schedule", url: "/top-upcoming",   icon: Clock },
];

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { language, toggleLanguage } = useLanguage();

  const [mounted,           setMounted]           = useState(false);
  const [isScrolled,        setIsScrolled]        = useState(false);
  const [isMobile,          setIsMobile]          = useState(false);
  const [mobileMenuOpen,    setMobileMenuOpen]    = useState(false);
  const [isSidebarOpen,     setIsSidebarOpen]     = useState(false);
  const [hovered,           setHovered]           = useState(null);

  const isSplash = location.pathname === "/";
  const active   = NAV_ITEMS.find(i => location.pathname.startsWith(i.url))?.name || "Home";

  useEffect(() => {
    setMounted(true);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // close mobile menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!mobileMenuOpen) return;
      const menu = document.querySelector("[data-mobile-menu]");
      const btn  = document.querySelector("[data-menu-button]");
      if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileMenuOpen]);

  if (!mounted || isSplash) return null;

  return (
    <SearchProvider>
      {/* ── FLOATING PILL NAV ── */}
      <div className="fixed left-0 right-0 z-[999999] top-4 flex justify-center pointer-events-none">
        <motion.div
          className="pointer-events-auto flex items-center gap-3 bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl px-4 py-2.5 rounded-full font-mono"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          {/* Logo */}
          <Link to="/home" className="flex items-center mr-2 select-none">
            <img src="/logo.png" alt="kaito" className="h-7 w-auto" />
          </Link>

          {/* Desktop nav items */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive  = active === item.name;
              const isHovered = hovered === item.name;
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  onMouseEnter={() => setHovered(item.name)}
                  onMouseLeave={() => setHovered(null)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 font-mono
                    ${isActive ? "text-white" : "text-white/60 hover:text-white"}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/10 border border-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <AnimatePresence>
                    {isHovered && !isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-full bg-white/[0.06]"
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-white/10 mx-1" />

          {/* Language toggle */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.06] rounded-full p-1 ml-1">
            {["EN", "JP"].map((lang) => (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full transition-colors font-mono
                  ${language === lang ? "bg-white/15 text-white" : "text-white/40 hover:text-white"}`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Mobile: hamburger */}
          <button
            data-menu-button
            className="md:hidden p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(v => !v)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Sidebar trigger (desktop hamburger) */}
          <button
            className="hidden md:flex p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              data-mobile-menu
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto absolute top-[56px] left-1/2 -translate-x-1/2 w-[92vw] max-w-sm bg-black/95 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-3 flex flex-col gap-1 font-mono"
            >
              {NAV_ITEMS.map((item) => {
                const Icon     = item.icon;
                const isActive = active === item.name;
                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors
                      ${isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/[0.06]"}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="border-t border-white/[0.06] mt-1 pt-2 flex items-center gap-2 px-2">
                <span className="text-xs text-white/30 font-mono">Lang:</span>
                {["EN", "JP"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors font-mono
                      ${language === lang ? "bg-white/15 text-white" : "text-white/30 hover:text-white"}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </SearchProvider>
  );
}
