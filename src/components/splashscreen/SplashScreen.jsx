import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Search, ChevronRight, Play, Zap, Globe, Wifi, Clock, Smartphone, Heart, Tv, BookOpen } from "lucide-react";
import CosmicWaves from "@/src/components/ui/CosmicWaves";
import { VideoText } from "@/src/components/ui/VideoText";
import { useOnlineCount } from "@/src/hooks/useOnlineCount";

const MARQUEE = ["One Piece","Naruto","Attack on Titan","Demon Slayer","Jujutsu Kaisen","Bleach","Dragon Ball Z","Hunter x Hunter","Fullmetal Alchemist","Tokyo Ghoul","Sword Art Online","My Hero Academia","Death Note","Vinland Saga","Chainsaw Man","Re:Zero","Steins;Gate","Code Geass","Cowboy Bebop","Evangelion"];
const FEATURES = [
  { icon: Zap,        title: "Zero Ads",      desc: "Watch without interruptions. No banners, no pop-ups, ever." },
  { icon: Globe,      title: "Sub & Dub",     desc: "Every title in both subbed and dubbed formats." },
  { icon: Wifi,       title: "HD Streaming",  desc: "Up to 1080p with adaptive bitrate for any connection." },
  { icon: Clock,      title: "Daily Updates", desc: "New episodes added within hours of Japanese broadcast." },
  { icon: Smartphone, title: "Any Device",    desc: "Works seamlessly on desktop, tablet, and mobile." },
  { icon: Heart,      title: "Watchlist",     desc: "Track what you're watching, completed, and plan to watch." },
];
const STATS = [
  { value: "10K+",  label: "Anime Titles" },
  { value: "500K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "0",     label: "Ads" },
];

const DiscordSVG = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 71 55" fill="currentColor">
    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
  </svg>
);

export default function SplashScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const onlineCount = useOnlineCount();
  const submit = useCallback(() => { const q = search.trim(); if (q) navigate(`/search?keyword=${encodeURIComponent(q)}`); }, [search, navigate]);
  const onKey  = useCallback((e) => { if (e.key === "Enter") submit(); }, [submit]);

  return (
    <div className="relative text-white overflow-x-hidden" style={{ background: "transparent" }}>

      {/* PERMANENT FULL-PAGE COSMIC BACKGROUND */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", width: "100vw", height: "100vh" }}>
        <div style={{ position: "absolute", inset: 0, filter: "blur(40px)", transform: "scale(1.05)" }}>
          <CosmicWaves speed={0.5} amplitude={0.9} frequency={1.1} starDensity={1.2} colorShift={0.8} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }} />
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center" style={{ zIndex: 10 }}>
        <div className="relative z-30 flex flex-col items-center w-full max-w-5xl mx-auto px-6 py-20">

          {/* Badge */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }} className="mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500 bg-indigo-500/20 px-3 py-1 text-xs font-semibold font-mono text-indigo-300 backdrop-blur-md cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              {onlineCount} {onlineCount === 1 ? "user" : "users"} watching now
            </span>
          </motion.div>

          {/* VideoText title */}
          <motion.div
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.4, type:"spring", duration:1.5 }}
            className="w-full select-none pointer-events-none"
            style={{ height: "clamp(80px, 14vw, 160px)" }}
          >
            <VideoText
              src="https://api.lunaranime.ru/static/intro.mp4"
              fontSize={14}
              fontWeight="900"
              fontFamily="monospace"
              className="w-full h-full"
            >
              COSMIC
            </VideoText>
          </motion.div>

          {/* Taglines + search + buttons */}
          <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
            <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}
              className="text-zinc-300 text-lg sm:text-xl font-mono">
              Your Complete Anime Entertainment Platform
            </motion.p>
            <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.65 }}
              className="text-zinc-500 text-xs sm:text-sm font-mono -mt-2">
              Thousands of series in English Sub &amp; Dub — completely free
            </motion.p>

            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.72 }}
              className="relative w-full max-w-[480px]">
              <Input type="text" placeholder="Search anime..." value={search}
                onChange={e => setSearch(e.target.value)} onKeyDown={onKey}
                className="pr-12 h-11 text-sm bg-white/[0.08] border-white/15 text-white placeholder:text-white/40 backdrop-blur-md focus-visible:ring-white/20 rounded-md font-mono" />
              <Button variant="ghost" size="icon" onClick={submit} aria-label="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-transparent rounded-md">
                <Search className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8 }}
              className="flex flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/home')}
                className="h-11 px-8 rounded-md bg-white hover:bg-gray-100 text-black font-mono text-sm font-semibold shadow-none">
                <Play className="mr-2 h-4 w-4 fill-current" /> Start Watching
              </Button>
              <Button asChild variant="outline"
                className="h-11 px-8 rounded-md border-white/20 hover:border-[#5865f2]/60 bg-transparent hover:bg-[#5865f2]/10 text-white hover:text-[#7289da] font-mono text-sm">
                <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <DiscordSVG size={16} /> Discord
                </a>
              </Button>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
              className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => navigate('/home')} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors font-mono">
                <Tv className="w-3.5 h-3.5" />Anime<ChevronRight className="w-3 h-3 opacity-50" />
              </button>
              <button onClick={() => navigate('/manga')} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors font-mono">
                <BookOpen className="w-3.5 h-3.5" />Manga<ChevronRight className="w-3 h-3 opacity-50" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="relative z-10 border-y border-white/[0.06] py-4 overflow-hidden bg-black/30 backdrop-blur-sm">
        <div className="mq-track flex gap-6">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <div key={i} className="flex items-center gap-6 whitespace-nowrap flex-shrink-0">
              <span onClick={() => navigate(`/search?keyword=${encodeURIComponent(t)}`)}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer font-mono">{t}</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
              className="p-6 rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all text-center">
              <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">{s.value}</p>
              <p className="text-[11px] text-zinc-500 uppercase tracking-[0.2em] font-medium mt-2 font-mono">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 font-mono">Everything you need</h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">Built for anime fans, by anime fans.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
                className="group p-5 rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-md hover:border-indigo-500/30 hover:bg-black/60 transition-all">
                <Icon className="w-5 h-5 text-zinc-400 mb-3 group-hover:text-indigo-400 transition-colors" />
                <h3 className="font-semibold text-sm text-white mb-1.5 font-mono">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="relative z-10 border-t border-white/[0.06] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}
            className="flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-md border border-indigo-500 text-indigo-400 bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold font-mono cursor-default hover:bg-indigo-500/30 transition-colors">
              <DiscordSVG size={14} /> Join Thousands of Happy Users
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-mono">Ready to Start Watching?</h2>
            <p className="text-zinc-400 font-mono max-w-lg text-lg">Dive into the world of anime — free and ad-free. No credit card required.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
              <Button onClick={() => navigate('/home')} className="h-11 px-8 rounded-md bg-white hover:bg-gray-100 text-black font-mono text-sm font-semibold shadow-none">
                <Play className="mr-2 h-4 w-4 fill-current" /> Get Started
              </Button>
              <Button asChild variant="outline" className="h-11 px-8 rounded-md border-zinc-700 hover:border-[#5865f2]/60 hover:text-[#7289da] bg-transparent font-mono text-sm">
                <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <DiscordSVG size={16} /> Join Discord
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .mq-track { animation: mq 35s linear infinite; }
        .mq-track:hover { animation-play-state: paused; }
        @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
    </div>
  );
}
