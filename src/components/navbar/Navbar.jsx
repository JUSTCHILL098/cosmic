import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRandom,
  faMagnifyingGlass,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
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
      {/* Centered rounded pill bar */}
      <nav className="fixed left-0 right-0 top-4 z-[1000000]">
        <div className="flex justify-center px-4">
          <div
            className={`flex items-center gap-3 max-w-[1100px] w-full
              rounded-full px-4 py-2
              ${isScrolled ? "bg-black/75" : "bg-black/60"}
              backdrop-blur-md border border-white/10 shadow-lg`}
          >
            {/* Left: hamburger + logo */}
            <button
              onClick={handleHamburgerClick}
              className="p-[10px] aspect-square bg-[#1f1f1f] text-white/70 hover:text-white rounded-lg transition-colors flex items-center justify-center"
              title="Menu"
            >
              <FontAwesomeIcon icon={faBars} className="text-lg" />
            </button>

            <Link to="/home" className="flex items-center mr-2">
              <img src="/logo.png" alt="JustAnime Logo" className="h-8 w-auto" />
            </Link>

            {/* Center navigation labels (Lunar-like) */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/home" className="px-3 py-2 rounded-full bg-[#1f1f1f] text-white/80 hover:bg-[#2a2a2a] transition">Home</Link>
              <Link to="#" className="px-3 py-2 rounded-full bg-[#1f1f1f] text-white/60 hover:bg-[#2a2a2a] transition">Features</Link>
              <Link to="#" className="px-3 py-2 rounded-full bg-[#1f1f1f] text-white/60 hover:bg-[#2a2a2a] transition">Changelog</Link>
              <Link to="/contact" className="px-3 py-2 rounded-full bg-[#1f1f1f] text-white/80 hover:bg-[#2a2a2a] transition">Contact</Link>
              <Link to="/a2z" className="px-3 py-2 rounded-full bg-[#1f1f1f] text-white/80 hover:bg-[#2a2a2a] transition">View Animes</Link>
            </div>

            {/* Search inside the pill */}
            <div className="flex-1 hidden md:flex justify-center">
              <WebSearch />
            </div>

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

            {/* Random */}
            <Link
              to={location.pathname === "/random" ? "#" : "/random"}
              onClick={handleRandomClick}
              className="p-[10px] aspect-square bg-[#1f1f1f] text-white/70 hover:text-white rounded-lg transition-colors flex items-center justify-center"
              title="Random Anime"
            >
              <FontAwesomeIcon icon={faRandom} className="text-lg" />
            </Link>

            {/* Language toggle (desktop) */}
            <div className="hidden md:flex items-center gap-2 bg-[#1f1f1f] rounded-md p-1 ml-1">
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

            {/* Mobile search toggle */}
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

        {/* Mobile search dropdown — below the pill */}
        {isMobileSearchOpen && (
          <div className="md:hidden mx-4 mt-2 bg-black/85 backdrop-blur-md rounded-xl shadow-lg border border-white/10">
            <MobileSearch onClose={() => setIsMobileSearchOpen(false)} />
          </div>
        )}

        {/* Sidebar outside the pill */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

        {/* Blue underline under the navbar (like Lunar) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-blue-500/60 via-blue-400/60 to-blue-500/60" />
      </nav>
    </SearchProvider>
  );
}

export default Navbar;
