import { createClient } from "@supabase/supabase-js";
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

const usernames = ["novalux", "kaiwave", "mirastudio", "driprobot", "lunabakes", "atlasmoves"];
const B = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";
const clips = ["ElephantsDream.mp4","ForBiggerBlazes.mp4","ForBiggerEscapes.mp4","ForBiggerFun.mp4","ForBiggerJoyrides.mp4","ForBiggerMeltdowns.mp4","Sintel.mp4","SubaruOutbackOnStreetAndDirt.mp4","TearsOfSteel.mp4","VolkswagenGTIReview.mp4","WeAreGoingOnBullrun.mp4","BigBuckBunny.mp4"];
const covers = ["https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80","https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&q=80","https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80","https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=600&q=80"];
const captions = [["Late night studio energy 🔥",["aesthetic","neon","vibes"]],["Caught the perfect wave today 🌊",["surf","summer","ocean"]],["A little moment of calm ☕️",["slowliving","cozy","morning"]],["The future is now 🤖",["ai","fashion","future"]],["Mini matcha cake, full obsession 🍵",["baking","dessert","matcha"]],["3 mobility moves to start your day",["fitness","mobility","wellness"]]];
const products = [
  { product_title: "Glow Ring Light Pro", product_description: "The light I use in every video", product_url: "https://example.com/ringlight", product_cta: "Shop", is_affiliate: true },
  null,
  { product_title: "Linen Throw Blanket", product_description: "Softest blanket, code SNAP10", product_url: "https://example.com/blanket", product_cta: "Get it", is_affiliate: true },
  null,
  { product_title: "Matcha Starter Kit", product_description: "Ceremonial grade, whisk included", product_url: "https://example.com/matcha", product_cta: "Buy", is_affiliate: false },
  null,
];

const { data: profs } = await admin.from("profiles").select("id, username").in("username", usernames);
const map = new Map(profs.map((p) => [p.username, p.id]));
const ids = usernames.map((u) => map.get(u)).filter(Boolean);

const rows = [];
let ci = 0;
for (let i = 0; i < ids.length; i++) {
  for (let j = 0; j < 2; j++) {
    const cap = captions[i % captions.length];
    const prod = j === 0 ? products[i % products.length] : null;
    rows.push({
      creator_id: ids[i],
      title: cap[0], caption: cap[0],
      media_url: B + clips[ci % clips.length],
      cover_url: covers[ci % covers.length],
      tags: cap[1],
      duration: 15 + (ci % 20),
      view_count: Math.floor(Math.random() * 90000) + 1000,
      like_count: Math.floor(Math.random() * 8000) + 50,
      status: "published",
      is_affiliate: prod ? prod.is_affiliate : false,
      product_title: prod ? prod.product_title : null,
      product_description: prod ? prod.product_description : null,
      product_url: prod ? prod.product_url : null,
      product_cta: prod ? prod.product_cta : null,
    });
    ci++;
  }
}
await admin.from("videos").delete().in("creator_id", ids);
const { error } = await admin.from("videos").insert(rows);
if (error) { console.error(error.message); process.exit(1); }
console.log("inserted videos:", rows.length);

for (let i = 0; i < ids.length; i++)
  for (let j = 0; j < ids.length; j++)
    if (i !== j && Math.random() > 0.5)
      await admin.from("follows").upsert({ follower_id: ids[i], following_id: ids[j] }, { onConflict: "follower_id,following_id" });
console.log("done");
process.exit(0);
