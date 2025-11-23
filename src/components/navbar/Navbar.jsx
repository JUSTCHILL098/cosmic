// LunarNavbar.jsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- Inline SVGs extracted from the bundle (logo + mascot) ---------- */
/* I converted the SVG path code into small React components so nothing gets chopped. */

function LogoIcon({ className = "w-7 h-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* This path block comes from the bundle's icon piece */}
      <g id="SVGRepo_iconCarrier">
        <path
          fill="currentColor"
          d="M11.0174 2.80157C6.37072 3.29221 2.75 7.22328 2.75 12C2.75 13.1448 2.95764 14.2397 3.33685 15.25H12.8489C10.1562 14.1916 8.25 11.5684 8.25 8.5C8.25 6.18738 9.33315 4.1283 11.0174 2.80157ZM18.1508 15.25H20.6631C20.9324 14.5327 21.1151 13.7727 21.1985 12.9825C20.4085 13.9854 19.359 14.7751 18.1508 15.25ZM22.2375 15.2884C22.5704 14.2513 22.75 13.1461 22.75 12C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 13.1461 1.4296 14.2513 1.76248 15.2884C1.46468 15.3877 1.25 15.6688 1.25 16C1.25 16.4142 1.58579 16.75 2 16.75H22C22.4142 16.75 22.75 16.4142 22.75 16C22.75 15.6688 22.5353 15.3877 22.2375 15.2884ZM4.25 19C4.25 18.5858 4.58579 18.25 5 18.25H19C19.4142 18.25 19.75 18.5858 19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H5C4.58579 19.75 4.25 19.4142 4.25 19ZM7.25 22C7.25 21.5858 7.58579 21.25 8 21.25H16C16.4142 21.25 16.75 21.5858 16.75 22C16.75 22.4142 16.4142 22.75 16 22.75H8C7.58579 22.75 7.25 22.4142 7.25 22Z"
        />
        <path
          fill="currentColor"
          d="M20.3655 2.12433C20.0384 1.29189 18.8624 1.29189 18.5353 2.12433L18.1073 3.21354L17.0227 3.6429C16.1933 3.97121 16.1933 5.14713 17.0227 5.47544L18.1073 5.90481L18.5353 6.99401C18.8624 7.82645 20.0384 7.82646 20.3655 6.99402L20.7935 5.90481L21.8781 5.47544C22.7075 5.14714 22.7075 3.97121 21.8781 3.6429L20.7935 3.21354L20.3655 2.12433ZM19.4504 2.52989L19.8651 3.58533C19.9648 3.83891 20.165 4.04027 20.4188 4.14073L21.4759 4.55917L20.4188 4.97762C20.165 5.07808 19.9648 5.27943 19.8651 5.53301L19.4504 6.58846L19.0357 5.53301C18.936 5.27943 18.7358 5.07808 18.482 4.97762L17.4249 4.55917L18.482 4.14073C18.7358 4.04027 18.936 3.83891 19.0357 3.58533L19.4504 2.52989ZM16.4981 7.94681C16.171 7.11437 14.9951 7.11437 14.668 7.94681L14.5134 8.34008L14.1222 8.49497C13.2928 8.82328 13.2928 9.9992 14.1222 10.3275L14.5134 10.4824L14.668 10.8757C14.9951 11.7081 16.171 11.7081 16.4981 10.8757L16.6527 10.4824L17.0439 10.3275C17.8733 9.9992 17.8733 8.82328 17.0439 8.49497L16.6527 8.34008L16.4981 7.94681ZM15.583 8.35237L15.7243 8.71188C15.824 8.96545 16.0242 9.16681 16.278 9.26727L16.6417 9.41124L16.278 9.55521C16.0242 9.65567 15.824 9.85703 15.7243 10.1106L15.583 10.4701L15.4418 10.1106C15.3421 9.85703 15.1419 9.65567 14.8881 9.55521L14.5244 9.41124L14.8881 9.26727C15.1419 9.16681 15.3421 8.96545 15.4418 8.71188L15.583 8.35237Z"
        />
      </g>
    </svg>
  );
}

/* Simple mascot SVG (face + eyes + blush). 
   I used the face-like structure from the bundle and made it a self-contained inline icon
   so it will scale and animate crisp without raster images. */
function MascotSVG({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g fill="none" fillRule="evenodd">
        <circle cx="32" cy="16" r="14" fill="#FFF" />
        {/* Eyes */}
        <circle cx="24" cy="14" r="2" fill="#111" />
        <circle cx="40" cy="14" r="2" fill="#111" />
        {/* Blush */}
        <ellipse cx="22" cy="18" rx="2.2" ry="1.2" fill="#F7A8C1" />
        <ellipse cx="42" cy="18" rx="2.2" ry="1.2" fill="#F7A8C1" />
        {/* Mouth */}
        <path d="M24 20c2 2 8 2 10 0" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  );
}

/* ---------- Main Navbar component ---------- */
export default function LunarNavbar() {
  const items = [
    { name: "Home", url: "/home" },
    { name: "Features", url: "/features" },
    { name: "Changelog", url: "/changelog" },
    { name: "Contact", url: "/contact" },
    { name: "View Animes", url: "/view-anime" },
  ];

  const [active, setActive] = useState("Home");
  const [hovering, setHovering] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Root nav container (fixed and centered) */}
      <div className="fixed left-0 right-0 top-5 z-[9999] flex justify-center pointer-events-none select-none">
        <div className="pointer-events-auto flex justify-center pt-6">
          <motion.div
            className="relative flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-lg shadow-lg w-auto py-2 px-2 rounded-full overflow-visible"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Mascot container: ensure overflow visible so it doesn't get chopped */}
            <div
              className="relative -left-1 mr-1 z-20"
              style={{ pointerEvents: "auto" }}
            >
              <motion.div
                onMouseEnter={() => setHovering("mascot")}
                onMouseLeave={() => setHovering(null)}
                animate={
                  hovering === "mascot"
                    ? { y: [0, -6, 0], rotate: [0, 6, 0, -6, 0] }
                    : { y: [0, -5, 0] }
                }
                transition={
                  hovering === "mascot"
                    ? { duration: 0.6, ease: "easeInOut" }
                    : { duration: 3, repeat: Infinity, repeatType: "reverse" }
                }
                style={{ transformOrigin: "center bottom" }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30">
                  <MascotSVG className="w-12 h-12" />
                </div>

                {/* small diamond pointer under mascot */}
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 z-10"
                  animate={
                    hovering === "mascot"
                      ? { y: [0, -4, 0] }
                      : { y: [0, 2, 0] }
                  }
                  transition={
                    hovering === "mascot"
                      ? { duration: 0.3, repeat: Infinity, repeatType: "reverse" }
                      : { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                  }
                >
                  <div className="w-full h-full bg-white rotate-45" />
                </motion.div>
              </motion.div>
            </div>

            {/* Logo + text */}
            <div className="flex items-center gap-2 pr-3 border-r border-white/10 z-10">
              <LogoIcon className="w-6 h-6 text-indigo-400" />
              <span
                className="text-white font-bold text-base sm:text-lg"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  letterSpacing: "-0.6px",
                }}
              >
                LUNAR
              </span>
            </div>

            {/* Desktop nav items (hidden on md and below) */}
            <div className="hidden md:flex items-center space-x-2 ml-3 z-10">
              {items.map((item) => {
                const isActive = item.name === active;
                return (
                  <motion.a
                    key={item.name}
                    href={item.url}
                    onClick={(e) => {
                      e.preventDefault();
                      setActive(item.name);
                      window.location.href = item.url;
                    }}
                    onMouseEnter={() => setHovering(item.name)}
                    onMouseLeave={() => setHovering(null)}
                    className={`relative cursor-pointer text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 ${isActive ? "text-white" : "text-white/70 hover:text-white"}`}
                    style={{ pointerEvents: "auto" }}
                  >
                    {/* Active pill (layoutId for smooth motion) */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, scale: [1, 1.03, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <div className="absolute inset-0 bg-white/15 rounded-full blur-md" />
                          <div className="absolute inset-[-6px] bg-white/10 rounded-full blur-xl" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <span className="relative z-10">{item.name}</span>
                  </motion.a>
                );
              })}
            </div>

            {/* Mobile burger */}
            <div className="md:hidden z-10 ml-2">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-white p-1.5"
                aria-label="menu"
                style={{ pointerEvents: "auto" }}
              >
                {mobileOpen ? "✖" : "☰"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile slide-out */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed inset-x-4 top-24 z-[9998] rounded-2xl bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl p-4 md:hidden"
            style={{ pointerEvents: "auto" }}
          >
            {items.map((item) => (
              <a
                key={item.name}
                href={item.url}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(item.name);
                  setMobileOpen(false);
                  window.location.href = item.url;
                }}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
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
