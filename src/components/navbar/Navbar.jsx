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
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Koulen&display=swap');
        `}
      </style>

      <nav className="fixed left-0 right-0 top-3 z-[100000]">
        <div className="flex justify-center px-4">
          <div
            className={`w-full max-w-[800px] rounded-full border border-white/10 shadow-lg
                        ${isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-black/65 backdrop-blur"}
                        px-4 py-[4px]`}
          >
            <div className="flex items-center justify-between flex-wrap relative z-[100001]">
              {/* === LEFT SIDE === */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleHamburgerClick}
                  className="p-[6px] text-white/80 hover:text-white transition-colors flex items-center justify-center"
                  title="Menu"
                >
                  <FontAwesomeIcon icon={faBars} className="text-[18px]" />
                </button>

                <Link to="/home" className="flex items-center select-none">
                  <span
                    className="text-white text-[20px] tracking-wide"
                    style={{
                      fontFamily: "'Koulen', sans-serif",
                    }}
                  >
                    KAITO
                  </span>
                </Link>
              </div>

              {/* === MIDDLE / RIGHT SECTION === */}
              <div className="flex items-center gap-5">
                {/* Discord */}
                <a
                  href="#"
                  className="text-white/80 hover:text-[#5865F2] transition-colors"
                  title="Discord"
                >
                  <FontAwesomeIcon icon={faDiscord} className="text-[19px]" />
                </a>

                {/* Telegram */}
                <a
                  href="#"
                  className="text-white/80 hover:text-[#229ED9] transition-colors"
                  title="Telegram"
                >
                  <FontAwesomeIcon icon={faTelegram} className="text-[19px]" />
                </a>

                {/* Search Bar */}
                <div className="hidden md:block basis-[150px] max-w-[150px] flex-shrink-0">
                  <WebSearch />
                </div>

                {/* Random */}
                <Link
                  to={location.pathname === "/random" ? "#" : "/random"}
                  onClick={handleRandomClick}
                  className="text-white/80 hover:text-white transition-colors"
                  title="Random Anime"
                >
                  <FontAwesomeIcon icon={faRandom} className="text-[19px]" />
                </Link>

                {/* Movie */}
                <Link
                  to="/movie"
                  className="text-white/80 hover:text-white transition-colors"
                  title="Movies"
                >
                  <FontAwesomeIcon icon={faFilm} className="text-[19px]" />
                </Link>

                {/* Popular */}
                <Link
                  to="/most-popular"
                  className="text-white/80 hover:text-orange-500 transition-colors"
                  title="Popular Anime"
                >
                  <FontAwesomeIcon icon={faFire} className="text-[19px]" />
                </Link>

                {/* Language Toggle */}
                <div className="hidden md:flex items-center gap-1 bg-[#1f1f1f] rounded-md p-[1px]">
                  {["EN", "JP"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-2 py-[1px] text-xs font-medium rounded ${
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
                    className="p-[6px] text-white/70 hover:text-white transition-colors flex items-center justify-center w-[30px] h-[30px]"
                    title={isMobileSearchOpen ? "Close Search" : "Search Anime"}
                  >
                    <FontAwesomeIcon
                      icon={isMobileSearchOpen ? faXmark : faMagnifyingGlass}
                      className="w-[16px] h-[16px]"
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
