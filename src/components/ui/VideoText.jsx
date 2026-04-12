/* eslint-disable react/prop-types */
// Magic UI VideoText — masks a video to only show through text letters
// Ported from TypeScript to JSX for this project
import { useEffect, useState } from "react";

export function VideoText({
  src,
  children,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  fontSize = 20,
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
}) {
  const [svgMask, setSvgMask] = useState("");
  const content = String(children);

  useEffect(() => {
    const update = () => {
      const fs = typeof fontSize === "number" ? `${fontSize}vw` : fontSize;
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><text x='50%' y='50%' font-size='${fs}' font-weight='${fontWeight}' text-anchor='${textAnchor}' dominant-baseline='${dominantBaseline}' font-family='${fontFamily}'>${content}</text></svg>`;
      setSvgMask(svg);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [content, fontSize, fontWeight, textAnchor, dominantBaseline, fontFamily]);

  const maskUrl = `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`;

  return (
    <div className={`relative size-full ${className}`}>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          maskImage: maskUrl,
          WebkitMaskImage: maskUrl,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      >
        <video
          className="h-full w-full object-cover"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          playsInline
        >
          <source src={src} />
        </video>
      </div>
      <span className="sr-only">{content}</span>
    </div>
  );
}
