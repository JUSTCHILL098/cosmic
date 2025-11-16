// Updated Navbar.jsx with KAITO text set to 48px width x 24px height container and 16px font size

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

function Navbar() {
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

  const handleHamburgerClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);
  const handleRandomClick = () => {
    if (location.pathname === "/random") window.location.reload();
  };

  return (
    <SearchProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@700&display=swap');
      `}</style>

      <nav className="fixed left-0 right-0 top-4 z-[100000]">
        <div className="flex justify-center px-4">
          <div
            className={`w-full max-w-[900px] rounded-full border border-white/10 shadow-lg ${
              isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-black/65 backdrop-blur"
            } px-4 py-[6px]`}
          >
            <div className="flex items-center justify-between relative z-[100001]">

              {/* LEFT SIDE */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleHamburgerClick}
                  className="p-[8px] text-white/80 hover:text-white transition-colors flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faBars} className="text-[20px]" />
                </button>

                {/* === KAITO FIXED 48x24 CONTAINER + 16PX TEXT === */}
                <Link to="/home" className="flex items-center select-none">
                  <div
                    className="flex items-center justify-center bg-transparent"
                    style={{ width: "48px", height: "24px" }}
                  >
                    <span
                      className="text-white font-bold tracking-wide"
                      style={{
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: "16px",
                        lineHeight: "16px",
                      }}
                    >
                      KAITO
                    </span>
                  </div>
                </Link>

                <a href="#" className="p-[8px] text-white/80 hover:text-[#5865F2] transition-colors hidden sm:block">
                  <FontAwesomeIcon icon={faDiscord} className="text-[20px]" />
                </a>

                <a href="#" className="p-[8px] text-white/80 hover:text-[#229ED9] transition-colors hidden sm:block">
                  <FontAwesomeIcon icon={faTelegram} className="text-[20px]" />
                </a>

                <div className="hidden md:block basis-[170px] max-w-[170px] flex-shrink-0">
                  <WebSearch />
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-1">
                <Link
                  to={location.pathname === "/random" ? "#" : "/random"}
                  onClick={handleRandomClick}
                  className="p-[8px] text-white/80 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faRandom} className="text-[20px]" />
                </Link>

                <Link
                  to="/movie"
                  className="p-[8px] text-white/80 hover:text-white hidden sm:block"
                >
                  <FontAwesomeIcon icon={faFilm} className="text-[20px]" />
                </Link>

                <Link
                  to="/most-popular"
                  className="p-[8px] text-white/80 hover:text-orange-500 hidden sm:block"
                >
                  <FontAwesomeIcon icon={faFire} className="text-[20px]" />
                </Link>

                <div className="hidden md:flex items-center gap-2 bg-[#1f1f1f] rounded-md p-[2px] ml-1">
                  {['EN', 'JP'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-2 py-[2px] text-sm font-medium rounded ${
                        language === lang ? "bg-[#2a2a2a] text-white" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                    className="p-[8px] text-white/70 hover:text-white w-[34px] h-[34px]"
                  >
                    <FontAwesomeIcon
                      icon={isMobileSearchOpen ? faXmark : faMagnifyingGlass}
                      className="w-[18px] h-[18px]"
                      style={{ transform: isMobileSearchOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="md:hidden mx-4 mt-2 bg-black/90 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
            <MobileSearch onClose={() => setIsMobileSearchOpen(false)} />
          </div>
        )}

        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      </nav>
    </SearchProvider>
  );
}

export default Navbar;
