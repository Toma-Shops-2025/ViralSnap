/** True when we should treat the connection as metered / cellular. */
export function isMeteredConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  const type = conn.type;
  if (type === "cellular") return true;
  if (conn.effectiveType === "slow-2g" || conn.effectiveType === "2g") {
    return true;
  }
  return false;
}

interface NetworkInformation {
  type?: string;
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
}
