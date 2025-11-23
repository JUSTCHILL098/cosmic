import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LunarNavbar() {
  const items = [
    { name: "Home", url: "/home" },
    { name: "Features", url: "/features" },
    { name: "Changelog", url: "/changelog" },
    { name: "Contact", url: "/contact" },
    { name: "View Anime", url: "/view-anime" },
  ];

  const [active, setActive] = useState("Home");
  const [hover, setHover] = useState(null);
  const [mobile, setMobile] = useState(false);

  return (
    <>
      <div className="header">
        <div className={`header-inner ${mobile ? "menu-open" : ""}`}>
          {/* Brand */}
          <div className="brand">
            <div className="brand-icon-wrapper">
              <div className="w-6 h-6 bg-white rounded-lg" />
            </div>
            <span className="brand-text">LUNAR</span>
          </div>

          {/* Desktop nav */}
          <nav className="nav">
            <ul className="nav-list">
              {items.map((item) => {
                const isActive = item.name === active;
                return (
                  <li key={item.name} className="nav-item">
                    <a
                      href={item.url}
                      className={`nav-link ${isActive ? "active" : ""}`}
                      onMouseEnter={() => setHover(item.name)}
                      onMouseLeave={() => setHover(null)}
                      onClick={(e) => {
                        e.preventDefault();
                        setActive(item.name);
                        window.location.href = item.url;
                      }}
                    >
                      {/* Active glowing backdrop */}
                      {isActive && (
                        <div className="active-backdrop">
                          <div className="layer layer-1" />
                          <div className="layer layer-2" />
                          <div className="layer layer-3" />
                          <div className="layer layer-4" />
                          <div className="shine" />
                        </div>
                      )}

                      {/* Hover backdrop */}
                      {!isActive && hover === item.name && (
                        <div className="hover-backdrop" />
                      )}

                      <span className="label-desktop">{item.name}</span>
                      <span className="label-mobile">{item.name}</span>

                      {/* Mascot over the active item */}
                      {isActive && (
                        <div className="mascot">
                          <div className="mascot-inner">
                            <div className="head">
                              <div className="eye eye-left"></div>
                              <div className="eye eye-right"></div>
                              <div className="blush blush-left"></div>
                              <div className="blush blush-right"></div>
                              <div className="mouth"></div>
                              <div className="sparkle sparkle-1">✨</div>
                              <div className="sparkle sparkle-2">✨</div>
                            </div>
                            <div className="body"></div>
                          </div>
                        </div>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            className="menu-button md:hidden"
            onClick={() => setMobile(!mobile)}
          >
            <span className="menu-bar" />
            <span className="menu-bar" />
            <span className="menu-bar" />
          </button>

          {/* Mobile dropdown */}
          {mobile && (
            <div className="mobile-menu">
              {items.map((item) => (
                <button
                  key={item.name}
                  className={`mobile-menu-item ${
                    active === item.name ? "active" : ""
                  }`}
                  onClick={() => {
                    setActive(item.name);
                    setMobile(false);
                    window.location.href = item.url;
                  }}
                >
                  <span className="mobile-menu-label">{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
