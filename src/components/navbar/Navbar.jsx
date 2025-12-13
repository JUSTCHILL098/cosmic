import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { usePathname } from "./usePathname";
import Link from "./Link";
import { cn } from "@/src/lib/utils";
import { IconMark } from "./IconMark";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/dialog-mock";

/* ---------------- Text Reveal ---------------- */

const TextReveal = ({ text, by = "word", className = "" }) => {
  const split = by === "word" ? text.split(" ") : text.split("");
  return (
    <motion.div className={className}>
      {split.map((item, index) => (
        <motion.span
          key={`${index}-${item}`}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.3,
            delay: index * (by === "word" ? 0.1 : 0.05),
          }}
          className={`inline-block ${by === "word" ? "mr-2" : "mr-1"}`}
        >
          {item}
        </motion.span>
      ))}
    </motion.div>
  );
};

/* ---------------- Navbar ---------------- */

export function Navbar({
  items,
  className,
  defaultActive = "Home",
  onProviderChange,
}) {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [active, setActive] = useState(defaultActive);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Easter Egg
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [eggStep, setEggStep] = useState(0);
  const [showEggButtons, setShowEggButtons] = useState(false);

  // Provider
  const [providerOpen, setProviderOpen] = useState(false);
  const [iconColor, setIconColor] = useState("text-indigo-500");

  /* ----------- SAFE MOUNT RESET (FIX BLACK SCREEN) ----------- */
  useEffect(() => {
    setMounted(true);
    setShowEasterEgg(false);
    setEggStep(0);
    setShowEggButtons(false);

    const provider = CookieMock.get("selectedProvider");
    setIconColor(provider === "hentai" ? "text-purple-500" : "text-indigo-500");
  }, []);

  /* ---------------- Resize / Scroll ---------------- */

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ---------------- Logo Click ---------------- */

  const handleLogoClick = () => {
    const provider = CookieMock.get("selectedProvider");
    const interaction = localStorage.getItem("lunar_moon_interaction");

    if (provider === "hentai") {
      setProviderOpen(true);
      return;
    }

    if (interaction === "true") {
      CookieMock.set("selectedProvider", "hentai");
      setIconColor("text-purple-500");
      onProviderChange?.("hentai");
      setTimeout(() => window.location.reload(), 300);
      return;
    }

    if (!showEasterEgg) {
      setShowEasterEgg(true);
      setEggStep(1);
      setTimeout(() => setEggStep(2), 4000);
      setTimeout(() => setShowEggButtons(true), 8000);
    }
  };

  /* ---------------- Provider Select ---------------- */

  const handleProviderSelect = (provider) => {
    CookieMock.set("selectedProvider", provider);
    setIconColor(provider === "hentai" ? "text-purple-500" : "text-indigo-500");
    onProviderChange?.(provider);
    setProviderOpen(false);
    setTimeout(() => window.location.reload(), 300);
  };

  /* ---------------- Confirm Egg ---------------- */

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

  if (!mounted) return null;

  return (
    <>
      {/* ---------------- NAVBAR ---------------- */}
      <div className={cn("fixed left-0 right-0 z-[9999]", isMobile ? "top-2" : "top-6")}>
        <div className="flex justify-center">
          <motion.div
            className="flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-lg shadow-lg rounded-full px-4 py-3 font-mono"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <motion.button
              onClick={handleLogoClick}
              animate={{ y: [0, -5, 0], rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <IconMark className={`h-7 w-7 ${iconColor}`} />
            </motion.button>

            <span className="text-white font-bold">LUNAR</span>

            {!isMobile && (
              <div className="flex gap-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.name;

                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      onClick={(e) => {
                        e.preventDefault();
                        setActive(item.name);
                        window.location.href = item.url;
                      }}
                      className={cn(
                        "px-6 py-2 rounded-full text-white/70 hover:text-white transition",
                        isActive && "text-white"
                      )}
                    >
                      {item.name}
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
          </motion.div>
        </div>
      </div>

      {/* ---------------- EASTER EGG OVERLAY ---------------- */}
      <AnimatePresence>
        {showEasterEgg && eggStep > 0 && (
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
                    text="You seek to trespass into the dark side of the lunar realm…"
                    className="text-3xl mb-8"
                  />
                  {showEggButtons && (
                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowEasterEgg(false);
                          setEggStep(0);
                        }}
                      >
                        NO
                      </Button>
                      <Button onClick={confirmEasterEgg}>YES</Button>
                    </div>
                  )}
                </>
              )}

              {eggStep === 3 && (
                <TextReveal text="Ok..." by="character" className="text-6xl" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- PROVIDER DRAWER ---------------- */}
      <Drawer open={providerOpen} onOpenChange={setProviderOpen}>
        <DrawerContent className="rounded-xl">
          <DrawerHeader>
            <DrawerTitle>Select Provider</DrawerTitle>
            <DrawerDescription>Choose which provider you want</DrawerDescription>
          </DrawerHeader>
          <div className="space-y-2">
            <Button variant="outline" onClick={() => handleProviderSelect("1st")}>
              1st Provider
            </Button>
            <Button variant="outline" onClick={() => handleProviderSelect("2nd")}>
              2nd Provider
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
