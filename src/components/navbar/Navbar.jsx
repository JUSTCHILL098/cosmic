// Navbar.jsx
import { useState, useRef, useEffect } from "react";

const navItems = ["Home", "Browse Genres", "Trending", "Schedule", "Playlists"];

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navRef = useRef([]);

  useEffect(() => {
    const activeIndex = navItems.indexOf(active);
    const activeEl = navRef.current[activeIndex];
    if (activeEl) {
      setUnderlineStyle({
        width: `${activeEl.offsetWidth}px`,
        left: `${activeEl.offsetLeft}px`,
      });
    }
  }, [active]);

  return (
    <div className="relative bg-[#1F1B2E] p-4 rounded-xl flex justify-center">
      <div className="flex gap-6 relative">
        {navItems.map((item, index) => (
          <button
            key={item}
            ref={(el) => (navRef.current[index] = el)}
            onClick={() => setActive(item)}
            className={`text-white font-medium relative transition-colors ${
              active === item ? "text-purple-400" : "text-gray-400"
            }`}
          >
            {item}
          </button>
        ))}
        <span
          className="absolute bottom-0 h-1 bg-purple-500 rounded transition-all duration-300"
          style={underlineStyle}
        />
      </div>
    </div>
  );
}
