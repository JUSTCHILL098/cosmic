// LUNAR ANIME EXACT CLONE NAVBAR (React Version)
// A) Logo remains "LUNAR" (your choice)
// B) Uses your existing search (WebSearch + MobileSearch)
// C) Uses your existing Sidebar

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRandom,
  faMagnifyingGlass,
  faXmark,
  faFilm,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { SearchProvider } from "@/src/context/SearchContext";
import WebSearch from "../searchbar/WebSearch";
import MobileSearch from "../searchbar/MobileSearch";

export default function Navbar() {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SearchProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@700&display=swap');
      `}</style>

      <nav className="fixed left-0 right-0 top-4 z-[200000]">
        <div className="flex justify-center px-4">
          <div
            className={`w-full max-w-[900px] rounded-full border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.7)] px-5 py-[8px] transition-all duration-300
              ${isScrolled ? "bg-black/85 backdrop-blur-xl scale-[0.98]" : "bg-black/65 backdrop-blur-md scale-100"}`}
          >
            <div className="flex items-center justify-between">
              {/* LEFT SIDE */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-[8px] text-white/80 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faBars} className="text-[20px]" />
                </button>

                {/* LUNAR LOGO */}
                <Link to="/home" className="flex items-center select-none">
                  <div className="flex items-center justify-center" style={{ width: 48, height: 24 }}>
                    <span
                      className="text-white font-bold tracking-wide"
                      style={{ fontFamily: "'Geist Mono', monospace", fontSize: 16, lineHeight: "16px" }}
                    >
                      LUNAR
                    </span>
                  </div>
                </Link>

                {/* SOCIALS */}
                <a href="#" className="p-[8px] text-white/80 hover:text-[#5865F2] hidden sm:block transition">
                  <FontAwesomeIcon icon={faDiscord} className="text-[20px]" />
                </a>
                <a href="#" className="p-[8px] text-white/80 hover:text-[#229ED9] hidden sm:block transition">
                  <FontAwesomeIcon icon={faTelegram} className="text-[20px]" />
                </a>

                {/* DESKTOP SEARCH */}
                <div className="hidden md:block w-[170px] max-w-[170px]">
                  <WebSearch />
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-1">
                <Link
                  to={location.pathname === "/random" ? "#" : "/random"}
                  onClick={() => location.pathname === "/random" && window.location.reload()}
                  className="p-[8px] text-white/80 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faRandom} className="text-[20px]" />
                </Link>

                <Link to="/movie" className="p-[8px] text-white/80 hover:text-white hidden sm:block transition">
                  <FontAwesomeIcon icon={faFilm} className="text-[20px]" />
                </Link>

                <Link
                  to="/most-popular"
                  className="p-[8px] text-white/80 hover:text-orange-500 hidden sm:block transition"
                >
                  <FontAwesomeIcon icon={faFire} className="text-[20px]" />
                </Link>

                {/* LANGUAGE SWITCH */}
                <div className="hidden md:flex items-center gap-2 bg-[#1f1f1f] rounded-md p-[2px] ml-1 border border-[#2a2a2a]">
                  {["EN", "JP"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-2 py-[2px] text-sm rounded transition
                        ${language === lang ? "bg-[#2a2a2a] text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* MOBILE SEARCH */}
                <button
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  className="md:hidden p-[8px] text-white/70 hover:text-white transition w-[34px] h-[34px]"
                >
                  <FontAwesomeIcon
                    icon={isMobileSearchOpen ? faXmark : faMagnifyingGlass}
                    className="w-[18px] h-[18px] transition-transform duration-200"
                    style={{ transform: isMobileSearchOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH DROPDOWN */}
        {isMobileSearchOpen && (
          <div className="md:hidden mx-4 mt-2 bg-black/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/10">
            <MobileSearch onClose={() => setIsMobileSearchOpen(false)} />
          </div>
        )}

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </nav>
    </SearchProvider>
  );
}
export default Navbar;
