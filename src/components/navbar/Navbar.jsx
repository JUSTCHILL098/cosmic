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
      {/* Transparent page-level nav; only the inner pill has rounded corners */}
      <nav className="fixed left-0 right-0 top-4 z-[1000000]">
        <div className="flex justify-center px-4">
          {/* Rounded pill bar like Lunar; everything sits inside this bar */}
          <div
            className={`w-full max-w-[1100px] rounded-full border border-white/10 shadow-lg
                        ${isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-black/65 backdrop-blur"}
                        px-4 py-2`}
          >
            {/* Use flex-wrap so no zoom is needed; items wrap inside the pill */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Left: hamburger + logo */}
              <button
                onClick={handleHamburgerClick}
                className="p-[10px] aspect-square bg-[#1f1f1f] text-white/70 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                title="Menu"
              >
                <FontAwesomeIcon icon={faBars} className="text-lg" />
              </button>

              <Link to="/home" className="flex items-center mr-1">
                <img src="/logo.png" alt="JustAnime Logo" className="h-8 w-auto" />
              </Link>

              {/* Center cluster: icons + compact search (kept inside pill) */}
              <div className="flex items-center gap-2 flex-1 min-w-0 justify-center flex-wrap">
                {/* Discord */}
                <a
                  href="https://discord.gg/YourDiscordInvite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-[10px] aspect-square bg-[#1f1f1f] text-white/70 hover:text-[#5865F2] rounded-lg transition-colors flex items-center justify-center"
                  title="Discord"
                >
                  <FontAwesomeIcon icon={faDiscord} className="text-lg" />
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/YourTelegramLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-[10px] aspect-square bg-[#1f1f1f] text-white/70 hover:text-[#229ED9] rounded-lg transition-colors flex items-center justify-center"
                  title="Telegram"
                >
                  <FontAwesomeIcon icon={faTelegram} className="text-lg" />
                </a>

                {/* Compact search: constrained width; hidden on small screens */}
                <div className="hidden md:block basis-[240px] max-w-[240px] flex-shrink">
                  <WebSearch />
                </div>

                {/* Random */}
                <Link
                  to={location.pathname === "/random" ? "#" : "/random"}
                  onClick={handleRandomClick}
                  className="p-[10px] aspect-square bg-[#1f1f1f] text-white/70 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Random Anime"
                >
                  <FontAwesomeIcon icon={faRandom} className="text-lg" />
                </Link>

                {/* Movies */}
                <Link
                  to="/movie"
                  className="p-[10px] aspect-square bg-[#1f1f1f] text-white/70 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Movies"
                >
                  <FontAwesomeIcon icon={faFilm} className="text-lg" />
                </Link>

                {/* Popular */}
                <Link
                  to="/most-popular"
                  className="p-[10px] aspect-square bg-[#1f1f1f] text-white/70 hover:text-orange-500 rounded-lg transition-colors flex items-center justify-center"
                  title="Popular Anime"
                >
                  <FontAwesomeIcon icon={faFire} className="text-lg" />
                </Link>
              </div>

              {/* Language toggle (desktop) */}
              <div className="hidden md:flex items-center gap-2 bg-[#1f1f1f] rounded-md p-1 ml-auto">
                {["EN", "JP"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      language === lang ? "bg-[#2a2a2a] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Mobile search toggle (shows dropdown below pill) */}
              <div className="md:hidden ml-auto">
                <button
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  className="p-[10px] aspect-square bg-[#1f1f1f] text-white/70 hover:text-white rounded-lg transition-colors flex items-center justify-center w-[38px] h-[38px]"
                  title={isMobileSearchOpen ? "Close Search" : "Search Anime"}
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

        {/* Mobile search dropdown — below the pill */}
        {isMobileSearchOpen && (
          <div className="md:hidden mx-4 mt-2 bg-black/90 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
            <MobileSearch onClose={() => setIsMobileSearchOpen(false)} />
          </div>
        )}

        {/* Sidebar (menu) */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

        {/* Blue underline accent under navbar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-blue-500/60 via-blue-400/60 to-blue-500/60" />
      </nav>
    </SearchProvider>
  );
}

export default Navbar;
