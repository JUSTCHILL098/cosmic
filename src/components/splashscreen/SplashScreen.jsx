import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";

/**
 * SplashScreen.jsx — Part 2 (Hero + Mask + Marquee)
 *
 * Notes:
 * - Font files are injected automatically (Geist/Geist Mono).
 * - Marquee uses duplicated tracks for continuous scroll.
 * - Mask uses the local path from your upload history:
 *     /mnt/data/index.html
 *   Replace maskUrl with a proper SVG/PNG mask if you have one (recommended).
 */

export default function SplashScreen() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const maskUrl = "/mnt/data/index.html"; // <--- uploaded file path (replace with /mask/lunar-mask.png if you add a mask image)
  // Marquee items (copied from original)
  const items = [
    "Solo Leveling ソロレベリング",
    "One Piece ワンピース",
    "Dragon Ball ドラゴンボール",
    "Attack on Titan 進撃の巨人",
    "Demon Slayer 鬼滅の刃",
    "Naruto ナルト",
    "Jujutsu Kaisen 呪術廻戦",
    "Death Note デスノート",
    "Bleach ブリーチ",
    "Hunter x Hunter ハンター×ハンター",
    "Fullmetal Alchemist 鋼の錬金術師",
    "My Hero Academia 僕のヒーローアカデミア",
    "Chainsaw Man チェンソーマン",
    "Tokyo Ghoul 東京喰種",
    "Spy x Family スパイファミリー",
    "Violet Evergarden ヴァイオレット・エヴァーガーデン",
    "Vinland Saga ヴィンランド・サガ",
    "Cowboy Bebop カウボーイビバップ",
    "Evangelion 新世紀エヴァンゲリオン",
    "Your Name 君の名は",
  ];

  // inject fonts once
  useEffect(() => {
    const addLink = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      document.head.appendChild(l);
    };

    // Geist fonts CDN — these were used in the CSS part
    addLink("https://fonts.cdnfonts.com/css/geist-mono");
    addLink("https://fonts.cdnfonts.com/css/geist");

    // try to autoplay the intro video (mute required on many browsers)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <main className="min-h-screen">
      <div className="splash-wrapper flex flex-col min-h-screen relative bg-black text-white px-[5%] md:px-[10%] lg:px-[15%]">
        {/* HERO / INTRO */}
        <section
          className="relative flex flex-col items-center justify-center space-y-6 py-12 md:py-24 lg:py-32 text-center overflow-hidden border-b border-gray-800"
          aria-label="Hero"
        >
          {/* radial glow */}
          <div className="absolute inset-0 -z-10 splash-bg" />

          {/* small status badge */}
<div className="fade z-10">
  <div
    className="rounded-md font-semibold shadow bg-indigo-500/20 text-indigo-500 border border-indigo-500 px-2 py-1 text-xs inline-flex items-center gap-1.5 whitespace-nowrap"
  >
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
    </span>
    0 users watching now
  </div>
</div>

          {/* MASKED LOGO + VIDEO */}
          <div
            className="relative w-full max-w-4xl mx-auto"
            style={{ zIndex: 10, width: "100%", maxWidth: 1200 }}
          >
            {/* The "mask" container. We use an inline style for mask-image so you can swap source easily */}
            <div
              className="mx-auto"
              style={{
                width: "100%",
                maxWidth: 900,
                height: 120,
                margin: "0 auto",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="mask-logo"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  maskImage: `url("${maskUrl}")`,
                  WebkitMaskImage: `url("${maskUrl}")`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                  background: "transparent", // video sits inside
                  position: "relative",
                }}
              >
                {/* Video inside the masked block */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                >
                  <source
                    src="https://api.lunaranime.ru/static/intro.mp4"
                    type="video/mp4"
                  />
                  {/* fallback image if video fails */}
                  <img
                    src="https://i.imgur.com/Jp9w4wF.png"
                    alt="LUNAR"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </video>
              </div>
            </div>

            {/* Screen text under the mask */}
            <div className="mt-4 text-center">
              <h1
                className="mono"
                style={{
                  margin: 0,
                  fontSize: "18px",
                  letterSpacing: "0.04em",
                  color: "#cbd5e1",
                }}
              >
                Your Ultimate Anime Streaming Platform
              </h1>
              <p className="text-zinc-400" style={{ marginTop: 6 }}>
                Thousands of anime series and movies in English and German
              </p>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-6 flex gap-4 items-center z-20">
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 text-sm font-medium rounded-md h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow"
            >
              Start Watching
            </button>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium rounded-md h-10 px-6 border border-zinc-700 shadow text-white"
            >
              Discord
            </a>
          </div>

          {/* Preview window (big dots + url pill + screenshot) */}
          <div
            className="w-full max-w-5xl mt-12 rounded-lg overflow-hidden border border-zinc-800 relative z-10"
            style={{ background: "#0b0b0b" }}
          >
            <div
              className="bg-zinc-900 flex items-center px-4 py-2 gap-4"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div className="window-dot dot-red" />
                <div className="window-dot dot-yellow" />
                <div className="window-dot dot-green" />
              </div>

              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div className="url-pill rounded-md px-3 py-1 text-xs text-zinc-400">
                  https://lunar.animes
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-4">
              <img
                alt="Lunar Animes Interface"
                className="w-full rounded border border-zinc-800"
                src="https://i.imgur.com/Jp9w4wF.png"
                style={{ display: "block" }}
              />
            </div>
          </div>
        </section>

        {/* MARQUEE / SCROLLER — 3 layers in original, we'll do two duplicate tracks per row for smoothness */}
        <section
          className="w-full px-[5%] md:px-[10%] lg:px-[15%] overflow-hidden border-b border-gray-800"
          aria-hidden
        >
          <div
            className="group flex overflow-hidden p-2"
            style={{
              "--gap": "1rem",
              "--duration": "120s",
              alignItems: "center",
            }}
          >
            {/* Track 1 */}
            <div
              className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee"
              style={{ gap: "var(--gap)", width: "200%" }}
            >
              {/* render items twice so track is seamless */}
              {[...items, ...items].map((label, i) => (
                <div
                  key={`t1-${i}`}
                  className="flex items-center gap-8 w-full whitespace-nowrap mx-2"
                >
                  <div className="flex items-center gap-4 whitespace-nowrap mx-2">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="h-4 w-[1px] bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>

            {/* Track 2 (offset) */}
            <div
              className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee"
              style={{ gap: "var(--gap)", width: "200%", animationDelay: "60s" }}
            >
              {[...items, ...items].map((label, i) => (
                <div
                  key={`t2-${i}`}
                  className="flex items-center gap-8 w-full whitespace-nowrap mx-2"
                >
                  <div className="flex items-center gap-4 whitespace-nowrap mx-2">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="h-4 w-[1px] bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* small overview preview section (kept minimal for splash) */}
        <section id="overview" className="container mx-auto max-w-7xl py-12 md:py-24">
          <div className="mx-auto max-w-[58rem] flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl text-white">
              Overview
            </h2>
            <p className="max-w-[85%] text-sm text-zinc-400 sm:text-base mt-4">
              Everything you need for your perfect anime experience
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
