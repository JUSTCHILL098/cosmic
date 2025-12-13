import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

/* ===================== UTILS ===================== */

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CookieMock = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
};

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  return pathname;
}

const Link = ({ href, children, ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

/* ===================== ICON ===================== */

const IconMark = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 1.25C6.06 1.25 1.25 6.06 1.25 12S6.06 22.75 12 22.75 22.75 17.94 22.75 12 17.94 1.25 12 1.25z" />
  </svg>
);

/* ===================== TEXT REVEAL ===================== */

const TextReveal = ({ text, by = "word", className = "" }) => {
  const split = by === "word" ? text.split(" ") : text.split("");
  return (
    <motion.div className={className}>
      {split.map((item, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: index * 0.05 }}
          className="inline-block mr-1"
        >
          {item}
        </motion.span>
      ))}
    </motion.div>
  );
};

/* ===================== NAVBAR ===================== */

export default function Navbar({
  items,
  defaultActive = "Home",
  onProviderChange,
}) {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(defaultActive);
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [eggStep, setEggStep] = useState(0);
  const [showEggButtons, setShowEggButtons] = useState(false);

  const [iconColor, setIconColor] = useState("text-indigo-500");

  useEffect(() => {
    setMounted(true);
    const resize = () => setIsMobile(window.innerWidth < 768);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleLogoClick = () => {
    const interaction = localStorage.getItem("lunar_moon_interaction");

    if (interaction === "true") {
      CookieMock.set("selectedProvider", "hentai");
      setIconColor("text-purple-500");
      onProviderChange?.("hentai");
      setTimeout(() => window.location.reload(), 300);
      return;
    }

    setShowEasterEgg(true);
    setEggStep(1);
    setTimeout(() => setEggStep(2), 4000);
    setTimeout(() => setShowEggButtons(true), 8000);
  };

  const confirmEasterEgg = async () => {
    setShowEggButtons(false);
    setEggStep(3);
    await new Promise((r) => setTimeout(r, 3000));
    localStorage.setItem("lunar_moon_interaction", "true");
    CookieMock.set("selectedProvider", "hentai");
    setIconColor("text-purple-500");
    onProviderChange?.("hentai");
    await new Promise((r) => setTimeout(r, 2000));
    window.location.reload();
  };

  const handleNavClick = (url, name) => {
    setActive(name);
    window.location.href = url;
  };

  if (!mounted) return null;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="fixed top-6 left-0 right-0 z-[9999] flex justify-center">
        <div className="flex items-center gap-3 bg-black/50 backdrop-blur-lg border border-white/10 rounded-full px-4 py-3 shadow-lg">
          <motion.button
            animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            onClick={handleLogoClick}
          >
            <IconMark className={`w-7 h-7 ${iconColor}`} />
          </motion.button>

          {!isMobile && (
            <div className="flex gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.url, item.name);
                    }}
                    onMouseEnter={() => setHovered(item.name)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "px-6 py-2 rounded-full text-white/70 hover:text-white transition relative",
                      active === item.name && "text-white"
                    )}
                  >
                    {item.name}
                    {hovered === item.name && (
                      <motion.div
                        layoutId="hover"
                        className="absolute inset-0 bg-white/10 rounded-full -z-10"
                      />
                    )}
                  </a>
                );
              })}
            </div>
          )}

          {isMobile && (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          )}
        </div>
      </div>

      {/* ================= EASTER EGG ================= */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center text-white font-mono">
              {eggStep === 1 && (
                <TextReveal
                  text="A cold silence lingers beneath the moonlight."
                  className="text-3xl"
                />
              )}
              {eggStep === 2 && (
                <>
                  <TextReveal
                    text="You seek to trespass into the dark side…"
                    className="text-3xl"
                  />
                  {showEggButtons && (
                    <div className="mt-10 flex gap-6 justify-center">
                      <button
                        onClick={() => setShowEasterEgg(false)}
                        className="px-6 py-3 border border-white/30 rounded"
                      >
                        NO
                      </button>
                      <button
                        onClick={confirmEasterEgg}
                        className="px-6 py-3 bg-indigo-600 rounded"
                      >
                        YES
                      </button>
                    </div>
                  )}
                </>
              )}
              {eggStep === 3 && (
                <TextReveal text="Ok..." by="character" className="text-5xl" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
