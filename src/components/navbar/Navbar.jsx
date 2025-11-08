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
      <nav
        className={`fixed top-0 left-0 w-full z-[1000000] transition-all duration-300 ease-in-out
          ${isScrolled ? "bg-black/70 backdrop-blur-md shadow-lg" : "bg-black/60 backdrop-blur"}`}
      >
        <div className="max-w-[1920px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon
                icon={faBars}
                className="text-xl text-gray-200 cursor-pointer hover:text-white transition-colors"
                onClick={handleHamburgerClick}
              />
              <Link to="/home" className="flex items-center">
                <img src="/logo.png" alt="JustAnime Logo" className="h-9 w-auto" />
              </Link>
            </div>
          </div>

          {/* Center: Search + Quick Links */}
          <div className="flex-1 flex justify-center items-center max-w-none mx-8 hidden md:flex">
            <div className="flex items-center gap-2 w-[900px]">
              {/* Discord */}
              <a
                href="https://discord.gg/YourDiscordInvite"
                target="_blank"
                rel="noopener noreferrer"
                className="p-[10px] aspect-square bg-[#1f1f1f] text-white/60 hover:text-[#5865F2] rounded-lg transition-colors flex items-center justify-center"
                title="Join us on Discord"
              >
                <FontAwesomeIcon icon={faDiscord} className="text-lg" />
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/YourTelegramLink"
                target="_blank"
                rel="noopener noreferrer"
                className="p-[10px] aspect-square bg-[#1f1f1f] text-white/60 hover:text-[#229ED9] rounded-lg transition-colors flex items-center justify-center"
                title="Join us on Telegram"
              >
                <FontAwesomeIcon icon={faTelegram} className="text-lg" />
              </a>

              {/* Search */}
              <WebSearch />

              {/* Quick Links (glass pills) */}
              <div className="flex items-center gap-2">
                <Link
                  to="/most-popular"
                  className="px-3 py-2 rounded-full bg-[#1f1f1f] text-gray-200/90 hover:text-white hover:bg-[#2a2a2a] border border-white/10 transition"
                  title="Popular"
                >
                  Popular
                </Link>
                <Link
                  to="/movie"
                  className="px-3 py-2 rounded-full bg-[#1f1f1f] text-gray-200/90 hover:text-white hover:bg-[#2a2a2a] border border-white/10 transition"
                  title="Movies"
                >
                  Movies
                </Link>
                <Link
                  to="/a2z"
                  className="px-3 py-2 rounded-full bg-[#1f1f1f] text-gray-200/90 hover:text-white hover:bg-[#2a2a2a] border border-white/10 transition"
                  title="A–Z"
                >
                  A–Z
                </Link>
                <Link
                  to="/schedule"
                  className="px-3 py-2 rounded-full bg-[#1f1f1f] text-gray-200/90 hover:text-white hover:bg-[#2a2a2a] border border-white/10 transition"
                  title="Schedule"
                >
                  Schedule
                </Link>
              </div>

              {/* Random */}
              <Link
                to={location.pathname === "/random" ? "#" : "/random"}
                onClick={handleRandomClick}
                className="p-[10px] aspect-square bg-[#1f1f1f] text-white/60 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                title="Random Anime"
              >
                <FontAwesomeIcon icon={faRandom} className="text-lg" />
              </Link>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="hidden md:flex items-center gap-2 bg-[#1f1f1f] rounded-md p-1">
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

          {/* Mobile Search Icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-[10px] aspect-square bg-[#1f1f1f] text-white/60 hover:text-white rounded-lg transition-colors flex items-center justify-center w-[38px] h-[38px]"
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

        {/* Mobile Search Dropdown */}
        {isMobileSearchOpen && (
          <div className="md:hidden bg-black shadow-lg">
            <MobileSearch onClose={() => setIsMobileSearchOpen(false)} />
          </div>
        )}

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

        {/* Bottom Gradient Accent */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-indigo-500/40 via-cyan-400/40 to-transparent" />
      </nav>
    </SearchProvider>
  );
}

export default Navbar;
