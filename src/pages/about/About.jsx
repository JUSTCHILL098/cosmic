import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Globe, Wifi, Heart, Shield, Users, Play, Star, MessageSquare, Tv } from "lucide-react";

const FEATURES = [
  { icon: Zap,           title: "Zero Ads",         desc: "No banners, no pop-ups, no interruptions. Ever." },
  { icon: Globe,         title: "Sub & Dub",         desc: "Every title available in both subbed and dubbed formats." },
  { icon: Wifi,          title: "HD Streaming",      desc: "Up to 1080p with adaptive bitrate for any connection speed." },
  { icon: Heart,         title: "Watchlist",         desc: "Save anime to your personal playlist with one tap." },
  { icon: Shield,        title: "No Account Needed", desc: "Browse and watch freely. Sign up only when you want to." },
  { icon: MessageSquare, title: "Community Chat",    desc: "Talk about anime in real-time with other fans." },
  { icon: Users,         title: "Watch Together",    desc: "Sync playback with friends in a shared room." },
  { icon: Star,          title: "Levels & Badges",   desc: "Earn XP as you watch and unlock badges over time." },
];

const STATS = [
  { value: "10K+",  label: "Anime Titles" },
  { value: "500K+", label: "Episodes" },
  { value: "0",     label: "Ads" },
  { value: "Free",  label: "Forever" },
];

const STACK = [
  { name: "React",       desc: "UI framework" },
  { name: "Vite",        desc: "Build tool" },
  { name: "Tailwind",    desc: "Styling" },
  { name: "Supabase",    desc: "Auth & database" },
  { name: "Vidstack",    desc: "Video player" },
  { name: "Framer",      desc: "Animations" },
];

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay: i * 0.06 },
});

export default function About() {
  return (
    <div className="min-h-screen pb-32 text-white" style={{ background: "#000" }}>
      <div className="max-w-4xl mx-auto px-4 pt-24">

        {/* Hero */}
        <motion.div {...fade()} className="mb-16 text-center">
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-4">About</p>
          <h1 className="text-5xl font-black font-mono tracking-tighter text-white mb-4">COSMIC</h1>
          <p className="text-white/40 font-mono text-base max-w-xl mx-auto leading-relaxed">
            A free, ad-free anime streaming platform built for fans who just want to watch — no friction, no paywalls, no nonsense.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Link to="/home"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-semibold transition-all"
              style={{ background: "#fff", color: "#000" }}>
              <Play className="w-4 h-4 fill-current" /> Start Watching
            </Link>
            <Link to="/users"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              <Users className="w-4 h-4" /> Community
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div {...fade(1)} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {STATS.map((s, i) => (
            <div key={i} className="p-5 rounded-xl text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-2xl font-black font-mono text-white">{s.value}</p>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Mission */}
        <motion.div {...fade(2)} className="p-6 rounded-xl mb-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-sm font-bold font-mono text-white mb-3 flex items-center gap-2">
            <Tv className="w-4 h-4 text-white/30" /> Our Mission
          </h2>
          <p className="text-sm text-white/45 font-mono leading-relaxed">
            COSMIC was built out of frustration with ad-heavy, slow, and unreliable anime sites. The goal is simple — give anime fans a clean, fast, and completely free place to watch their favourite shows in both sub and dub, without being bombarded by ads or forced to create an account just to press play.
          </p>
          <p className="text-sm text-white/45 font-mono leading-relaxed mt-3">
            We believe great anime should be accessible to everyone. That's why COSMIC will always be free, always ad-free, and always improving.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div {...fade(3)} className="mb-6">
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-4">Features</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} {...fade(i * 0.5)}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Icon className="w-4 h-4 text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white font-mono mb-0.5">{title}</p>
                  <p className="text-xs text-white/35 font-mono leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div {...fade(4)} className="p-6 rounded-xl mb-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-4">Built With</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STACK.map((t, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono font-semibold text-white/70">{t.name}</p>
                  <p className="text-[10px] font-mono text-white/25">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div {...fade(5)} className="p-5 rounded-xl mb-6"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Disclaimer</p>
          <p className="text-xs text-white/30 font-mono leading-relaxed">
            COSMIC does not host any video files. All content is sourced from third-party providers. We do not claim ownership of any anime titles displayed on this site. If you are a rights holder and wish to have content removed, please visit our{" "}
            <Link to="/dmca" className="text-white/50 hover:text-white underline underline-offset-2 transition-colors">DMCA page</Link>.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div {...fade(6)} className="text-center pt-4">
          <p className="text-white/20 font-mono text-xs mb-4">Have a question or want to report something?</p>
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
            <MessageSquare className="w-4 h-4" /> Contact Us
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
