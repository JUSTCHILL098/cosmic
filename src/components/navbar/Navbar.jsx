import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRandom,
  faMagnifyingGlass,
  faXmark,
  faFilm,
  faFire
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
    const handleScroll = () => setIsScrolled(window.scrollY > 2);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHamburgerClick = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const handleRandomClick = () => {
    if (location.pathname === "/random") {
      window.location.reload();
    }
  };

  return (
    <SearchProvider>
      <nav
        className={`fixed top-0 left-0 w-full z-[1000000] transition-all duration-300 ${
          isScrolled ? "bg-black/60 backdrop-blur-md shadow-lg" : "bg-black/30 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: menu + logo */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Open Menu"
              title="Open Menu"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 transition-colors"
              onClick={handleHamburgerClick}
            >
              <FontAwesomeIcon icon={faBars} className="text-lg" />
            </button>
            <Link to="/home" className="flex items-center">
              <img src="/logo.png" alt="JustAnime Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Center: desktop search + quick actions */}
          <div className="flex-1 hidden md:flex items-center justify-center">
            <div className="flex items-center gap-2 w-[700px] max-w-[700px]">
              {/* Discord */}
              <a
                href="https://discord.gg/YourDiscordInvite"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-white/60 hover:text-[#5865F2] transition-colors"
                title="Discord"
              >
                <FontAwesomeIcon icon={faDiscord} className="text-lg" />
              </a>
              {/* Telegram */}
              <a
                href="https://t.me/YourTelegramLink"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-white/60 hover:text-[#229ED9] transition-colors"
                title="Telegram"
              >
                <FontAwesomeIcon icon={faTelegram} className="text-lg" />
              </a>

              {/* Search Bar */}
              <div className="flex-1">
                <WebSearch />
              </div>

              {/* Random */}
              <Link
                to={location.pathname === "/random" ? "#" : "/random"}
                onClick={handleRandomClick}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Random"
              >
                <FontAwesomeIcon icon={faRandom} className="text-lg" />
              </Link>
              {/* Movie */}
              <Link
                to="/movie"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Movies"
              >
                <FontAwesomeIcon icon={faFilm} className="text-lg" />
              </Link>
              {/* Popular */}
              <Link
                to="/most-popular"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-orange-400 transition-colors"
                title="Popular"
              >
                <FontAwesomeIcon icon={faFire} className="text-lg" />
              </Link>
            </div>
          </div>

          {/* Right: language toggle (desktop) + mobile search */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="hidden md:flex items-center gap-1 bg-[#27272A] rounded-md p-1">
              {["EN", "JP"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    language === lang
                      ? "bg-[#3F3F46] text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                  title={`Language: ${lang}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors w-[38px] h-[38px]"
              title={isMobileSearchOpen ? "Close Search" : "Search"}
              aria-label="Toggle Search"
            >
              <FontAwesomeIcon
                icon={isMobileSearchOpen ? faXmark : faMagnifyingGlass}
                className="w-[18px] h-[18px] transition-transform duration-200"
                style={{ transform: isMobileSearchOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              />
            </button>
          </div>
        </div>

        {/* Indigo accent line */}
        <div className="h-[1px] bg-gradient-to-r from-indigo-500/40 via-transparent to-indigo-500/40"></div>

        {/* Mobile Search Dropdown */}
        {isMobileSearchOpen && (
          <div className="md:hidden bg-[#18181B] shadow-lg">
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
