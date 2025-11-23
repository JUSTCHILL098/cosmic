import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./splashscreen.css";

export default function splashscreen() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <main className="min-h-screen">
      <div className="splash-wrapper flex flex-col min-h-screen relative bg-black text-white px-[5%] md:px-[10%] lg:px-[15%]">

        {/* HERO SECTION */}
        <section className="relative flex flex-col items-center justify-center space-y-4 py-12 text-center md:py-24 lg:py-32 border-b border-zinc-800 -mx-[5%] md:-mx-[10%] lg:-mx-[15%] px-[5%] md:px-[10%] lg:px-[15%] overflow-hidden">

          <div className="absolute inset-0 -z-10 bg-radial-glow" />

          <div className="space-y-4 max-w-4xl mx-auto relative z-10">
            <div className="status-badge" aria-hidden>
              <span className="status-dot" />
              0 users watching now
            </div>

            {/* Masked Video */}
            <div className="relative h-[100px] w-full overflow-hidden">
              <div className="relative size-full">
                <div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  style={{
                    maskImage: "url(_data_image/svg%2bxml%2c_.html)",
                    WebkitMaskImage: "url(_data_image/svg%2bxml%2c_.html)",
                    maskSize: "100%",
                    WebkitMaskSize: "100%",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                    transform: "scale(1.02)",
                  }}
                >
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    preload="auto"
                    playsInline
                  >
                    <source src="https://api.lunaranime.ru/static/intro.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>

            <p className="mx-auto max-w-[700px] text-sm text-zinc-400 sm:text-base md:text-lg">
              Your Ultimate Anime Streaming Platform
            </p>

            <p className="mx-auto max-w-[700px] text-xs text-zinc-500 sm:text-sm">
              Thousands of anime series and movies in English and German
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              className="inline-flex items-center justify-center gap-2 text-sm font-medium rounded-md h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow"
              onClick={() => navigate("/home")}
            >
              Start Watching
            </button>

            <a className="inline-flex items-center justify-center gap-2 text-sm font-medium rounded-md h-10 px-6 border border-zinc-700 shadow text-white">
              Discord
            </a>
          </div>

          <div className="w-full max-w-5xl mt-12 rounded-lg overflow-hidden border border-zinc-800 relative z-10">
            <div className="bg-zinc-900 flex items-center px-4 py-2 gap-2">
              <div className="flex gap-1.5">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>

              <div className="flex-1 mx-auto max-w-md">
                <div className="rounded-md px-3 py-1 text-xs text-zinc-400 text-center">
                  https://lunar.animes
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-4">
              <img
                alt="Lunar Animes Interface"
                className="w-full rounded border border-zinc-800"
                src="https://i.imgur.com/Jp9w4wF.png"
              />
            </div>
          </div>
        </section>

        {/* MARQUEE SECTION */}
        <section className="relative py-12 border-b border-zinc-800 -mx-[5%] md:-mx-[10%] lg:-mx-[15%] px-[5%] md:px-[10%] lg:px-[15%] bg-black overflow-hidden">
          <div className="overflow-hidden whitespace-nowrap flex gap-8 text-zinc-500 text-sm font-medium">
            <div className="flex gap-8 animate-marquee">
              <span>• Fastest Anime Updates</span>
              <span>• Subbed & Dubbed</span>
              <span>• Smooth Video Player</span>
              <span>• High-Quality Streams</span>
            </div>

            <div className="flex gap-8 animate-marquee">
              <span>• Fastest Anime Updates</span>
              <span>• Subbed & Dubbed</span>
              <span>• Smooth Video Player</span>
              <span>• High-Quality Streams</span>
            </div>
          </div>
        </section>

        {/* OVERVIEW SECTION */}
        <section id="overview" className="relative py-20 text-center border-b border-zinc-800 bg-black">
          <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why Choose Lunar Anime?
            </h2>

            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
              LunarAnime delivers fast, clean, and high-quality anime streaming
              with no ads.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">⚡ Fast Streaming</h3>
                <p className="text-zinc-400 text-sm">Ultra low buffering.</p>
              </div>

              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">🎧 Dub & Sub</h3>
                <p className="text-zinc-400 text-sm">English & German support.</p>
              </div>

              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">⭐ Clean UI</h3>
                <p className="text-zinc-400 text-sm">Modern interface.</p>
              </div>

              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">🧲 Smart Tracking</h3>
                <p className="text-zinc-400 text-sm">Auto-save progress.</p>
              </div>

              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">🔍 Advanced Search</h3>
                <p className="text-zinc-400 text-sm">Find anything instantly.</p>
              </div>

              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">📺 Huge Library</h3>
                <p className="text-zinc-400 text-sm">Thousands of shows.</p>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="footer" className="relative py-16 bg-black border-t border-zinc-800">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-zinc-400">

            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Lunar Anime</h3>
              <p className="text-sm">
                The fastest and cleanest anime streaming platform.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-semibold">Navigation</h4>
              <ul className="text-sm space-y-1">
                <li><a href="#overview" className="hover:text-white">Overview</a></li>
                <li><a href="/home" className="hover:text-white">Start Watching</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-semibold">Connect</h4>
              <ul className="text-sm space-y-1">
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-zinc-800 mt-12 pt-6 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} LunarAnime. All rights reserved.
          </div>
        </footer>

      </div>
    </main>
  );
}
