import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search as SearchIcon, ArrowLeft, Play, Heart, Hash, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/bottom-nav";
import { supabase } from "@/integrations/supabase/client";
import { compact } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — ViralSnap" },
      { name: "description", content: "Search ViralSnap creators, videos, and hashtags." },
    ],
  }),
  component: SearchPage,
});

type Vid = Tables<"videos">;
type Profile = Pick<Tables<"profiles">, "id" | "username" | "display_name" | "avatar_url" | "bio">;

async function runSearch(q: string) {
  const term = q.trim();
  if (!term) return { creators: [] as Profile[], videos: [] as Vid[], tags: [] as string[] };

  const like = `%${term}%`;

  const [{ data: creators }, { data: videos }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio")
      .or(`username.ilike.${like},display_name.ilike.${like}`)
      .limit(12),
    supabase
      .from("videos")
      .select("*")
      .eq("status", "published")
      .or(`title.ilike.${like},caption.ilike.${like}`)
      .order("view_count", { ascending: false })
      .limit(30),
  ]);

  // hashtag matches scanned from trending videos
  const { data: tagVids } = await supabase
    .from("videos")
    .select("tags")
    .eq("status", "published")
    .limit(200);
  const lower = term.replace(/^#/, "").toLowerCase();
  const tagSet = new Set<string>();
  (tagVids ?? []).forEach((v) => {
    (v.tags ?? []).forEach((t) => {
      if (t.toLowerCase().includes(lower)) tagSet.add(t);
    });
  });

  return {
    creators: (creators ?? []) as Profile[],
    videos: (videos ?? []) as Vid[],
    tags: [...tagSet].slice(0, 12),
  };
}

function SearchPage() {
  const [q, setQ] = useState("");
  const { data } = useQuery({
    queryKey: ["search", q],
    queryFn: () => runSearch(q),
    enabled: q.trim().length > 0,
  });

  const hasResults =
    (data?.creators.length ?? 0) + (data?.videos.length ?? 0) + (data?.tags.length ?? 0) > 0;

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link to="/discover" className="flex h-9 w-9 items-center justify-center rounded-full bg-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search creators, videos, #tags"
            className="rounded-full bg-card pl-9"
          />
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 px-4 py-4">
        {!q.trim() && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Find creators, videos, and trending hashtags.
          </p>
        )}

        {q.trim() && !hasResults && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No results for “{q}”.
          </p>
        )}

        {/* hashtags */}
        {(data?.tags.length ?? 0) > 0 && (
          <section>
            <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Hashtags
            </h2>
            <div className="flex flex-wrap gap-2">
              {data?.tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 rounded-full border border-gold/40 bg-card px-3 py-1.5 text-sm font-medium text-gold"
                >
                  <Hash className="h-3.5 w-3.5" />
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* creators */}
        {(data?.creators.length ?? 0) > 0 && (
          <section>
            <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Creators
            </h2>
            <div className="space-y-2">
              {data?.creators.map((c) => (
                <Link
                  key={c.id}
                  to="/u/$username"
                  params={{ username: c.username }}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  {c.avatar_url ? (
                    <img src={c.avatar_url} alt={c.username} className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-fire text-base font-bold text-primary-foreground">
                      {c.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.display_name}</p>
                    <p className="truncate text-xs text-muted-foreground">@{c.username}</p>
                  </div>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* videos */}
        {(data?.videos.length ?? 0) > 0 && (
          <section>
            <h2 className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Videos
            </h2>
            <div className="grid grid-cols-3 gap-1">
              {data?.videos.map((v) => (
                <div key={v.id} className="relative aspect-[9/14] overflow-hidden rounded-lg bg-card">
                  {v.cover_url ? (
                    <img src={v.cover_url} alt={v.title} className="h-full w-full object-cover" />
                  ) : (
                    <video src={v.media_url ?? undefined} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-2 text-[10px] text-white/90">
                    <span className="flex items-center gap-0.5">
                      <Play className="h-2.5 w-2.5 fill-white" /> {compact(v.view_count)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Heart className="h-2.5 w-2.5 fill-white" /> {compact(v.like_count)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
