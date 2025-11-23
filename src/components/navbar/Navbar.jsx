import React, { useState } from "react";
import { motion } from "framer-motion";

export default function LunarNavbar() {
  const [hovered, setHovered] = useState(null);
  const navItems = ["Home", "Features", "Changelog", "Contact", "View Animes"];

  return (
    <div style={styles.wrapper}>
      {/* Mascot */}
      <motion.div
        style={{
          ...styles.mascot,
          y: hovered !== null ? -8 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <div style={styles.mascotHead}>
          <div style={styles.eyeLeft}></div>
          <div style={styles.eyeRight}></div>
          <div style={styles.smile}></div>
          <div style={styles.blushLeft}></div>
          <div style={styles.blushRight}></div>
        </div>
        <div style={styles.pointer}></div>
      </motion.div>

      {/* Main Nav */}
      <div style={styles.navbar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🔭</span>
          <span style={styles.logoText}>LUNAR</span>
        </div>

        <div style={styles.menu}>
          {navItems.map((item, i) => (
            <div
              key={i}
              style={styles.menuItemContainer}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                style={{
                  ...styles.glowBubble,
                  opacity: hovered === i ? 1 : 0,
                }}
                transition={{ duration: 0.25 }}
              ></motion.div>

              <span
                style={{
                  ...styles.menuItem,
                  color: hovered === i ? "white" : "#d0d0d0",
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------
   INLINE CSS (Perfect 1:1 Styling)
--------------------------------------------*/
const styles = {
  wrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "70px",
    position: "relative",
  },

  /* Mascot */
  mascot: {
    position: "absolute",
    top: "-55px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 100,
  },

  mascotHead: {
    width: "55px",
    height: "55px",
    background: "white",
    borderRadius: "50%",
    position: "relative",
    boxShadow: "0 0 25px rgba(255,255,255,0.7)",
  },

  eyeLeft: {
    width: "8px",
    height: "8px",
    background: "black",
    borderRadius: "50%",
    position: "absolute",
    top: "18px",
    left: "14px",
  },

  eyeRight: {
    width: "8px",
    height: "8px",
    background: "black",
    borderRadius: "50%",
    position: "absolute",
    top: "18px",
    right: "14px",
  },

  smile: {
    width: "26px",
    height: "10px",
    borderBottom: "4px solid black",
    borderRadius: "0 0 40px 40px",
    position: "absolute",
    top: "28px",
    left: "50%",
    transform: "translateX(-50%)",
  },

  blushLeft: {
    width: "10px",
    height: "10px",
    background: "rgba(255,100,150,0.5)",
    borderRadius: "50%",
    position: "absolute",
    top: "28px",
    left: "6px",
  },

  blushRight: {
    width: "10px",
    height: "10px",
    background: "rgba(255,100,150,0.5)",
    borderRadius: "50%",
    position: "absolute",
    top: "28px",
    right: "6px",
  },

  pointer: {
    width: "0",
    height: "0",
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: "15px solid white",
    marginTop: "-4px",
  },

  /* Navbar */
  navbar: {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(10px)",
    borderRadius: "40px",
    padding: "12px 25px",
    width: "85%",
    maxWidth: "900px",
    border: "1px solid rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* Logo */
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logoIcon: {
    fontSize: "26px",
  },

  logoText: {
    color: "white",
    fontWeight: "700",
    fontSize: "20px",
    letterSpacing: "1px",
  },

  /* Menu */
  menu: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },

  menuItemContainer: {
    position: "relative",
    cursor: "pointer",
  },

  menuItem: {
    fontSize: "16px",
    fontWeight: "500",
    position: "relative",
    zIndex: 2,
  },

  glowBubble: {
    width: "80px",
    height: "38px",
    background: "rgba(255,255,255,0.25)",
    filter: "blur(8px)",
    borderRadius: "30px",
    position: "absolute",
    top: "-7px",
    left: "-20px",
    zIndex: 1,
    transition: "0.2s ease",
  },
};
