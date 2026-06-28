import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Heart, MessageCircle, UserPlus, Gift, Bell, ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth } from "@/hooks/use-auth";
import { fetchActivity, type ActivityItem } from "@/lib/activity";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/activity")({
  head: () => ({ meta: [{ title: "Activity — ViralSnap" }] }),
  component: ActivityPage,
});

function ActivityPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/welcome", replace: true });
  }, [loading, user, navigate]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["activity", user?.id],
    enabled: !!user,
    queryFn: fetchActivity,
  });

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full bg-card">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl font-bold">Activity</h1>
      </header>

      <div className="mx-auto max-w-md px-4 py-3">
        {isLoading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Bell className="h-10 w-10 text-muted-foreground" />
            <p className="font-display text-lg font-bold">No activity yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Likes, comments, new followers, and gifts will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

const ICONS = {
  follow: { Icon: UserPlus, cls: "bg-accent text-primary" },
  like: { Icon: Heart, cls: "bg-accent text-primary" },
  comment: { Icon: MessageCircle, cls: "bg-secondary text-foreground" },
  gift: { Icon: Gift, cls: "bg-accent text-gold" },
} as const;

function ActivityRow({ item }: { item: ActivityItem }) {
  const { Icon, cls } = ICONS[item.kind];
  const name = item.actor?.username ?? "someone";

  const message =
    item.kind === "follow"
      ? "started following you"
      : item.kind === "like"
        ? "liked your video"
        : item.kind === "comment"
          ? `commented: ${item.text ?? ""}`
          : `sent you a gift — ${item.coinAmount ?? 0} coins`;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <div className="relative">
        {item.actor?.avatar_url ? (
          <img
            src={item.actor.avatar_url}
            alt={name}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-fire text-base font-bold text-primary-foreground">
            {(item.actor?.display_name ?? "U").charAt(0).toUpperCase()}
          </div>
        )}
        <span
          className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-card ${cls}`}
        >
          <Icon className="h-3 w-3" />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">
          {item.actor ? (
            <Link to="/u/$username" params={{ username: name }} className="font-semibold">
              @{name}
            </Link>
          ) : (
            <span className="font-semibold">@{name}</span>
          )}{" "}
          <span className="text-muted-foreground">{message}</span>
        </p>
        <p className="text-xs text-muted-foreground">{timeAgo(item.created_at)}</p>
      </div>

      {item.coverUrl && (
        <img
          src={item.coverUrl}
          alt="video"
          className="h-12 w-9 flex-shrink-0 rounded-md object-cover"
        />
      )}
    </div>
  );
}
