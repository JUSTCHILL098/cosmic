import { useEffect } from "react";
import { useMaintenance } from "@/src/context/MaintenanceContext";

// Detects devtools open via window size difference and console timing trick
export function useDevToolsDetect() {
  const { isAdmin } = useMaintenance();

  useEffect(() => {
    if (isAdmin) return; // admins are allowed

    let warned = false;

    const check = () => {
      const threshold = 160;
      const widthDiff  = window.outerWidth  - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const open = widthDiff > threshold || heightDiff > threshold;

      if (open && !warned) {
        warned = true;
        // Blur the page and show warning
        document.body.style.filter = "blur(8px) brightness(0.3)";
        document.body.style.pointerEvents = "none";
        document.body.style.userSelect = "none";

        // Inject overlay
        const el = document.createElement("div");
        el.id = "__devtools_warning__";
        el.style.cssText = `
          position:fixed;inset:0;z-index:2147483647;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          background:rgba(0,0,0,0.95);color:#fff;font-family:monospace;text-align:center;
          gap:16px;padding:32px;
        `;
        el.innerHTML = `
          <div style="font-size:48px">🚫</div>
          <h1 style="font-size:1.5rem;font-weight:900;letter-spacing:-0.03em">Developer Tools Detected</h1>
          <p style="color:rgba(255,255,255,0.4);font-size:13px;max-width:360px;line-height:1.6">
            This site does not allow developer tools to be open.<br/>
            Please close DevTools to continue watching.
          </p>
          <div style="width:6px;height:6px;border-radius:50%;background:#ef4444;animation:pulse 1.5s infinite"></div>
          <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}</style>
        `;
        document.body.appendChild(el);
      }

      if (!open && warned) {
        warned = false;
        document.body.style.filter = "";
        document.body.style.pointerEvents = "";
        document.body.style.userSelect = "";
        document.getElementById("__devtools_warning__")?.remove();
      }
    };

    const interval = setInterval(check, 1000);
    window.addEventListener("resize", check);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", check);
      document.body.style.filter = "";
      document.body.style.pointerEvents = "";
      document.body.style.userSelect = "";
      document.getElementById("__devtools_warning__")?.remove();
    };
  }, [isAdmin]);
}
