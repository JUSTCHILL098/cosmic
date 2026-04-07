import { useEffect, useRef, useState } from "react";
import { supabase } from "@/src/lib/supabase";

// One key per page load — stable across re-renders, unique per tab
const TAB_KEY = `tab_${Math.random().toString(36).slice(2, 9)}`;

export function useOnlineCount() {
  const [count, setCount] = useState(0);
  const chRef = useRef(null);

  useEffect(() => {
    // Remove any stale channel first
    if (chRef.current) supabase.removeChannel(chRef.current);

    const ch = supabase.channel("site_online_v2", {
      config: { presence: { key: TAB_KEY } },
    });

    ch.on("presence", { event: "sync" }, () => {
      setCount(Object.keys(ch.presenceState()).length);
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ at: Date.now() });
      }
    });

    chRef.current = ch;
    return () => { supabase.removeChannel(ch); };
  }, []); // strict once

  return count;
}
