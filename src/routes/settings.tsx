import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Pencil,
  CreditCard,
  LogOut,
  Trash2,
  Loader2,
  Heart,
  Share2,
  Sun,
  Moon,
  Monitor,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BottomNav } from "@/components/bottom-nav";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { getStripeEnvironment } from "@/lib/stripe";
import {
  createSubscriptionPortalSession,
} from "@/lib/payments.functions";
import { deleteAccount } from "@/lib/account.functions";
import { GooglePlayButton } from "@/components/google-play-button";
import { PLAY_STORE_URL, RATE_REWARD_COINS } from "@/lib/app-links";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — ViralSnap" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rating, setRating] = useState(false);

  const handleRate = async () => {
    // Open the Play Store listing so the user can leave a review.
    window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");
    if (!user || profile?.rate_rewarded) return;
    setRating(true);
    try {
      const { data, error } = await supabase.rpc("claim_rate_reward");
      if (error) throw error;
      const res = data as { already_claimed: boolean; reward?: number };
      if (!res.already_claimed) {
        toast.success(`+${res.reward ?? RATE_REWARD_COINS} ViralCoins! 🎉`, {
          description: "Thanks for rating ViralSnap.",
        });
        await refreshProfile();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not claim reward");
    } finally {
      setRating(false);
    }
  };



  const portalFn = createSubscriptionPortalSession;
  const deleteFn = deleteAccount;

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/welcome", replace: true });
  }, [loading, user, navigate]);

  // Subscriptions this user pays for (supporting creators).
  const { data: mySubs = [] } = useQuery({
    queryKey: ["my-subscriptions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("creator_subscriptions")
        .select("id, creator_id, status, current_period_end, cancel_at_period_end")
        .eq("subscriber_id", user!.id)
        .eq("environment", getStripeEnvironment())
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const hasSub = mySubs.some(
    (s) => s.status === "active" || s.status === "trialing",
  );

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await portalFn({
        data: {
          returnUrl: `${window.location.origin}/settings`,
          environment: getStripeEnvironment(),
        },
      });
      if ("error" in res) throw new Error(res.error);
      window.open(res.url, "_blank");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteFn({ data: undefined });
      if ("error" in res) throw new Error(res.error);
      await signOut();
      toast.success("Your account has been deleted.");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete account");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link
          to={profile ? "/u/$username" : "/"}
          params={profile ? { username: profile.username } : undefined}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
      </header>

      <div className="mx-auto max-w-md space-y-6 px-4 py-4">
        {/* Account */}
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Account</h2>
          <div className="space-y-2">
            <Row
              icon={Pencil}
              label="Edit profile"
              hint="Name, bio & photo"
              onClick={() => setEditOpen(true)}
            />
            <Row
              icon={CreditCard}
              label="Manage subscriptions"
              hint={hasSub ? "Update or cancel support" : "No active subscriptions"}
              loading={portalLoading}
              disabled={!hasSub}
              onClick={handlePortal}
            />
            <Row
              icon={Share2}
              label="Share ViralSnap"
              hint="QR code & invite link"
              onClick={() => navigate({ to: "/share" })}
            />
          </div>
        </section>

        {/* Supporting */}
        {mySubs.length > 0 && (
          <section>
            <h2 className="mb-3 font-display text-lg font-bold">Creators you support</h2>
            <div className="space-y-2">
              {mySubs.map((s) => (
                <SubRow key={s.id} sub={s} />
              ))}
            </div>
          </section>
        )}

        {/* Appearance */}
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Appearance</h2>
          <ThemeToggle />
        </section>

        {/* Get the app */}
        <section>
          <h2 className="mb-3 font-display text-lg font-bold">Get the app</h2>
          <div className="space-y-2">
            <button
              onClick={handleRate}
              disabled={rating}
              className="flex w-full items-center gap-3 rounded-2xl border border-gold/40 bg-card p-4 text-left transition-colors hover:border-gold/70 disabled:opacity-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
                {rating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">Rate ViralSnap</span>
                <span className="block text-xs text-muted-foreground">
                  {profile?.rate_rewarded
                    ? "Thanks for rating! Reward claimed."
                    : `Leave a review and earn ${RATE_REWARD_COINS} ViralCoins`}
                </span>
              </span>
              {!profile?.rate_rewarded && (
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-bold text-gold">
                  +{RATE_REWARD_COINS}
                </span>
              )}
            </button>
            <div className="flex justify-center pt-1">
              <GooglePlayButton />
            </div>
          </div>
        </section>





        {/* Danger zone */}
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-muted-foreground">
            More
          </h2>
          <div className="space-y-2">
            <Row
              icon={LogOut}
              label="Sign out"
              onClick={async () => {
                await signOut();
                toast.success("Signed out");
                navigate({ to: "/" });
              }}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-2xl border border-destructive/30 bg-card p-4 text-left transition-colors hover:border-destructive/60">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-destructive">
                      Delete account
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Permanently remove your data
                    </span>
                  </span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-border bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently deletes your profile, videos, and coin balance.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting…" : "Delete forever"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        {/* Legal & support */}
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-muted-foreground">
            Legal &amp; support
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <LegalLink to="/privacy" label="Privacy Policy" />
            <LegalLink to="/terms" label="Terms of Service" />
            <LegalLink to="/guidelines" label="Community Guidelines" />
            <LegalLink to="/dmca" label="DMCA & Content" />
            <LegalLink to="/refunds" label="Refund Policy" />
            <LegalLink to="/account-deletion" label="Delete account" />
            <LegalLink to="/contact" label="Contact & Support" />
          </div>
        </section>
      </div>


      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
      <BottomNav />
    </div>
  );
}

type LegalRoute =
  | "/privacy"
  | "/terms"
  | "/guidelines"
  | "/dmca"
  | "/refunds"
  | "/account-deletion"
  | "/contact";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-2">
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-pressed={active}
            className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-xs font-semibold transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function LegalLink({ to, label }: { to: LegalRoute; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-border bg-card px-3 py-3 text-xs font-medium text-foreground/90 transition-colors hover:border-primary/50"
    >
      {label}
    </Link>
  );
}

function Row({
  icon: Icon,
  label,
  hint,
  onClick,
  loading,
  disabled,
}: {
  icon: typeof Pencil;
  label: string;
  hint?: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 disabled:opacity-50"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
    </button>
  );
}

function SubRow({
  sub,
}: {
  sub: {
    creator_id: string;
    status: string;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  };
}) {
  const { data: creator } = useQuery({
    queryKey: ["creator-mini", sub.creator_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url")
        .eq("id", sub.creator_id)
        .maybeSingle();
      return data;
    },
  });

  const renews = sub.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString()
    : null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      {creator?.avatar_url ? (
        <img src={creator.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-fire text-primary-foreground">
          <Heart className="h-4 w-4" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {creator?.display_name ?? "Creator"}
        </p>
        <p className="text-xs text-muted-foreground">
          {sub.status === "canceled"
            ? "Canceled"
            : sub.cancel_at_period_end
              ? `Ends ${renews}`
              : renews
                ? `Renews ${renews}`
                : sub.status}
        </p>
      </div>
      {creator?.username && (
        <Link
          to="/u/$username"
          params={{ username: creator.username }}
          className="text-xs font-semibold text-primary"
        >
          View
        </Link>
      )}
    </div>
  );
}
