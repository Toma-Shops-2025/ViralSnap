import { useEffect, useState } from "react";
import { isMeteredConnection } from "@/lib/network-playback";

export function useMeteredConnection(): boolean {
  const [metered, setMetered] = useState(() => isMeteredConnection());

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { addEventListener?: (t: string, fn: () => void) => void; removeEventListener?: (t: string, fn: () => void) => void } })
      .connection;
    const refresh = () => setMetered(isMeteredConnection());
    refresh();
    conn?.addEventListener?.("change", refresh);
    return () => conn?.removeEventListener?.("change", refresh);
  }, []);

  return metered;
}
