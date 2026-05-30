import { createClient } from "@supabase/supabase-js";
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

const { data: profs } = await admin.from("profiles").select("id, username").in("username", ["driprobot", "lunabakes", "mirastudio", "atlasmoves", "novalux", "kaiwave"]);
const m = new Map(profs.map((p) => [p.username, p.id]));

const campaigns = [
  { brand: "driprobot", title: "Showcase our new AI sneakers", description: "Looking for 5 creators to feature our limited drop in a 30s video. Bonus coins for over 10k views.", budget: 5000, category: "fashion", deadline: "2026-07-15" },
  { brand: "lunabakes", title: "Bake with our matcha kit", description: "Create a fun recipe video using our ceremonial matcha starter kit.", budget: 2500, category: "food", deadline: "2026-06-30" },
  { brand: "atlasmoves", title: "30-day mobility challenge", description: "Document your mobility journey. We pay per check-in video.", budget: 4000, category: "fitness", deadline: "2026-08-01" },
  { brand: "novalux", title: "Neon night photography series", description: "Tech + aesthetic creators wanted to feature our LED panels.", budget: 3200, category: "tech", deadline: "2026-07-20" },
];

await admin.from("campaigns").delete().in("brand_id", [...m.values()]);
const rows = campaigns.map((c) => ({
  brand_id: m.get(c.brand), title: c.title, description: c.description, budget: c.budget, category: c.category, deadline: c.deadline, status: "active",
}));
const { error } = await admin.from("campaigns").insert(rows);
if (error) { console.error("campaigns", error.message); } else console.log("campaigns:", rows.length);

// one live stream
await admin.from("live_streams").delete().in("creator_id", [...m.values()]);
const { error: le } = await admin.from("live_streams").insert([
  { creator_id: m.get("kaiwave"), title: "Sunset surf session live 🌅", status: "live", viewer_count: 1280, total_gifts: 47 },
  { creator_id: m.get("lunabakes"), title: "Baking a giant cookie live 🍪", status: "live", viewer_count: 642, total_gifts: 23 },
]);
if (le) console.error("streams", le.message); else console.log("streams: 2");
process.exit(0);
