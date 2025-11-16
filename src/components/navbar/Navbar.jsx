
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
      {/* Import Koulen Regular font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Staatliches&display=swap');
        `}
      </style>

      <nav className="fixed left-0 right-0 top-4 z-[100000]">
        <div className="flex justify-center px-4">
          <div
            className={`w-full max-w-[900px] rounded-full border border-white/10 shadow-lg
                        ${isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-black/65 backdrop-blur"}
                        px-4 py-[6px]`}
          >
            <div className="flex items-center justify-between relative z-[100001]">
              
              {/* === LEFT SIDE: Hamburger, KAITO, Social Icons, and Web Search === */}
              {/* Increased gap-2 for better spacing on the crowded left side */}
              <div className="flex items-center gap-2"> 
                
                {/* Hamburger */}
                <button
                  onClick={handleHamburgerClick}
                  className="p-[8px] text-white/80 hover:text-white transition-colors flex items-center justify-center"
                  title="Menu"
                >
                  <FontAwesomeIcon icon={faBars} className="text-[20px]" />
                </button>

                {/* KAITO Text (Adjusted with mt-1 for better vertical alignment) */}
                <Link to="/home" className="flex items-center select-none">
                  <span
                    className="text-white text-[22px] font-bold tracking-wide mt-1" 
                    style={{
                      fontFamily: "'Koulen', sans-serif",
                    }}
                  >
                    KAITO
                  </span>
                </Link>

                {/* Discord (MOVED TO LEFT) */}
                <a
                  href="#"
                  className="p-[8px] text-white/80 hover:text-[#5865F2] transition-colors rounded-md hidden sm:block"
                  title="Discord"
                >
                  <FontAwesomeIcon icon={faDiscord} className="text-[20px]" />
                </a>

                {/* Telegram (MOVED TO LEFT) */}
                <a
                  href="#"
                  className="p-[8px] text-white/80 hover:text-[#229ED9] transition-colors rounded-md hidden sm:block"
                  title="Telegram"
                >
                  <FontAwesomeIcon icon={faTelegram} className="text-[20px]" />
                </a>
                
                {/* Compact Web Search (MOVED TO LEFT) */}
                <div className="hidden md:block basis-[170px] max-w-[170px] flex-shrink-0">
                  <WebSearch />
                </div>
              </div>

              {/* === RIGHT SIDE: Random, Movie, Popular, and Language Toggle === */}
              {/* Using gap-1 to create minimal space between all the items on the right side. */}
              <div className="flex items-center gap-1"> 
                
                {/* Random */}
                <Link
                  to={location.pathname === "/random" ? "#" : "/random"}
                  onClick={handleRandomClick}
                  className="p-[8px] text-white/80 hover:text-white transition-colors rounded-md"
                  title="Random Anime"
                >
                  <FontAwesomeIcon icon={faRandom} className="text-[20px]" />
                </Link>

                {/* Movies */}
                <Link
                  to="/movie"
                  className="p-[8px] text-white/80 hover:text-white transition-colors rounded-md hidden sm:block"
                  title="Movies"
                >
                  <FontAwesomeIcon icon={faFilm} className="text-[20px]" />
                </Link>

                {/* Popular */}
                <Link
                  to="/most-popular"
                  className="p-[8px] text-white/80 hover:text-orange-500 transition-colors rounded-md hidden sm:block"
                  title="Popular Anime"
                >
                  <FontAwesomeIcon icon={faFire} className="text-[20px]" />
                </Link>

                {/* Language Toggle */}
                <div className="hidden md:flex items-center gap-2 bg-[#1f1f1f] rounded-md p-[2px] ml-1">
                  {["EN", "JP"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-2 py-[2px] text-sm font-medium rounded ${
                        language === lang
                          ? "bg-[#2a2a2a] text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* Mobile Search */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                    className="p-[8px] text-white/70 hover:text-white transition-colors flex items-center justify-center w-[34px] h-[34px]"
                    title={isMobileSearchOpen ? "Close Search" : "Search Anime"}
                  >
                    <FontAwesomeIcon
                      icon={isMobileSearchOpen ? faXmark : faMagnifyingGlass}
                      className="w-[18px] h-[18px]"
                      style={{
                        transform: isMobileSearchOpen
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isMobileSearchOpen && (
          <div className="md:hidden mx-4 mt-2 bg-black/90 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
            <MobileSearch onClose={() => setIsMobileSearchOpen(false)} />
          </div>
        )}

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      </nav>
    </SearchProvider>
  );
}

export default Navbar;
