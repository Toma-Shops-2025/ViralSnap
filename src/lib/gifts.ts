import type { Database } from "@/integrations/supabase/types";

export type GiftType = Database["public"]["Enums"]["gift_type"];

export const GIFTS: { type: GiftType; emoji: string; label: string; coins: number }[] = [
  { type: "fire", emoji: "🔥", label: "Fire", coins: 10 },
  { type: "lightning", emoji: "⚡", label: "Lightning", coins: 25 },
  { type: "heartburst", emoji: "💖", label: "Heart Burst", coins: 50 },
  { type: "rocket", emoji: "🚀", label: "Rocket", coins: 100 },
  { type: "diamond", emoji: "💎", label: "Diamond", coins: 250 },
  { type: "crown", emoji: "👑", label: "Crown", coins: 500 },
];
