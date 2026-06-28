import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, PlusCircle, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const items = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/upload", label: "Create", icon: PlusCircle, accent: true },
  { to: "/wallet", label: "Wallet", icon: Wallet },
];

export function BottomNav() {
  const { profile, user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const profileTo = profile ? `/u/${profile.username}` : "/welcome";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-1 flex-col items-center gap-0.5"
            >
              {item.accent ? (
                <span className="flex h-9 w-12 items-center justify-center rounded-xl bg-gradient-fire shadow-glow">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </span>
              ) : (
                <Icon
                  className={cn(
                    "h-6 w-6 transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                />
              )}
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        <Link to={profileTo} className="flex flex-1 flex-col items-center gap-0.5">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className={cn(
                "h-6 w-6 rounded-full object-cover",
                pathname.startsWith("/u/") && "ring-2 ring-primary",
              )}
            />
          ) : (
            <User
              className={cn(
                "h-6 w-6",
                pathname.startsWith("/u/") || (pathname === "/welcome" && !user)
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            />
          )}
          <span
            className={cn(
              "text-[10px] font-medium",
              pathname.startsWith("/u/") ? "text-primary" : "text-muted-foreground",
            )}
          >
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
