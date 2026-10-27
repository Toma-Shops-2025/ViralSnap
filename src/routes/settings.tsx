import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Trash2,
  ChevronRight,
  LogOut,
  Mail,
  Camera,
  Loader2,
  HelpCircle,
  Gem,
  ArrowUpFromLine,
  Maximize2,
  Wifi,
  Volume2,
  Moon,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { deleteAccount } from "@/lib/account.functions";
import { createSubscriptionPortalSession } from "@/lib/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { useProSubscription } from "@/hooks/use-pro";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import {
  type PlaybackSpeed,
  usePlaybackPreferences,
} from "@/hooks/use-playback-preferences";
import { useTheme, type Theme } from "@/hooks/use-theme";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — ViralSnap" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const { isPro } = useProSubscription();
  const { theme, setTheme } = useTheme();
  const playback = usePlaybackPreferences();
  const speedOptions: PlaybackSpeed[] = [0.5, 1, 1.25, 1.5, 2];
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [editName, setEditName] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const portalFn = createSubscriptionPortalSession;
  const deleteFn = deleteAccount;

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/welcome", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name);
      setBio(profile.bio || "");
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/welcome", replace: true });
    toast.success("Signed out");
  };

  const handleManageSubscription = async () => {
    setBusy(true);
    try {
      const res = await portalFn({
        data: {
          environment: getStripeEnvironment(),
          returnUrl: window.location.href,
        },
        context: { supabase, userId: user?.id }
      });
      if ("error" in res) throw new Error(res.error);
      window.open(res.url, "_blank");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open portal");
    } finally {
      setBusy(false);
    }
  };

  const updateProfile = async () => {
    setBusy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          bio: bio.trim(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      await refreshProfile();
      setEditName(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setBusy(false);
    }
  };

  const onAvatar = async (file: File) => {
    if (!user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      contentType: file.type,
    });
    if (error) return toast.error(error.message);
    const url = supabase.storage.from("avatars").getPublicUrl(path).data
      .publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", user.id);

    if (updateError) return toast.error(updateError.message);
    await refreshProfile();
    toast.success("Avatar updated");
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      "Are you sure? This will permanently delete your account and all data. This cannot be undone.",
    );
    if (!ok) return;

    const confirmText = window.prompt("Type 'DELETE' to confirm:");
    if (confirmText !== "DELETE") return;

    setBusy(true);
    try {
      await deleteFn({ data: {}, context: { supabase, userId: user?.id } });
      await signOut();
      navigate({ to: "/welcome", replace: true });
      toast.success("Account deleted");
    } catch (err) {
      toast.error("Failed to delete account");
      setBusy(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="grid h-dvh place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-12">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <button
          onClick={() => navigate({ to: "/me" })}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-foreground">Settings</h1>
      </header>

      <div className="mx-auto max-w-md space-y-8 px-4 py-6">
        {/* profile section */}
        <section>
          <h2 className="mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Account Profile
          </h2>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-4">
              <label className="relative cursor-pointer group">
                <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-primary/20">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-secondary">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 grid place-items-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && onAvatar(e.target.files[0])
                  }
                />
              </label>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{profile.display_name}</p>
                <p className="text-sm text-muted-foreground">@{profile.handle}</p>
              </div>
              <button
                onClick={() => setEditName(true)}
                className="text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80"
              >
                Edit
              </button>
            </div>

            {editName && (
              <div className="mt-4 space-y-3 pt-4 border-t border-border">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Display Name</label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={busy}
                    onClick={updateProfile}
                    className="flex-1 rounded-full bg-primary py-2 text-sm font-bold text-primary-foreground"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditName(false)}
                    className="flex-1 rounded-full border border-border py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* subscription */}
        <section>
          <h2 className="mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Subscription
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${isPro ? 'bg-gold/10' : 'bg-secondary'}`}>
                  <Gem className={`h-5 w-5 ${isPro ? 'text-gold' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">ViralSnap Pro</p>
                  <p className="text-xs text-muted-foreground">{isPro ? 'Premium active' : 'Basic Plan'}</p>
                </div>
              </div>
              {isPro ? (
                <button
                  onClick={handleManageSubscription}
                  disabled={busy}
                  className="rounded-full bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold hover:bg-gold/20"
                >
                  Manage
                </button>
              ) : (
                <Link
                  to="/pricing"
                  className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* playback */}
        <section>
          <h2 className="mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Playback
          </h2>
          <div className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
            <SettingToggleRow
              icon={ArrowUpFromLine}
              label="Auto scroll"
              description="Advance to the next video when one ends"
              highlight
              checked={playback.autoScroll}
              onCheckedChange={playback.setAutoScroll}
            />
          </div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">Playback speed</span>
            </div>
            <div className="mt-3 flex gap-1 rounded-xl bg-secondary/60 p-1">
              {speedOptions.map((speed) => {
                const label = speed === 1 ? "1.0×" : `${speed}×`;
                const active = playback.playbackSpeed === speed;
                return (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => playback.setPlaybackSpeed(speed)}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                      active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            <SettingToggleRow
              icon={Maximize2}
              label="Clear display"
              description="Hide feed buttons and captions"
              checked={playback.clearDisplay}
              onCheckedChange={playback.setClearDisplay}
            />
            <SettingToggleRow
              icon={Wifi}
              label="Data saver"
              description="Only buffer the video you're watching"
              checked={playback.dataSaver}
              onCheckedChange={playback.setDataSaver}
            />
            <SettingToggleRow
              icon={Volume2}
              label="Start muted"
              description="Keep sound off until you tap unmute"
              checked={playback.startMuted}
              onCheckedChange={playback.setStartMuted}
            />
          </div>
        </section>

        {/* appearance */}
        <section>
          <h2 className="mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Appearance
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">Theme</span>
            </div>
            <div className="mt-3 flex gap-1 rounded-xl bg-secondary/60 p-1">
              {(["system", "light", "dark"] as Theme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold capitalize transition-colors ${
                    theme === t
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* notifications placeholder */}
        <section>
          <h2 className="mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Notifications
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            <SettingToggleRow
              icon={Mail}
              label="Email updates"
              description="Product news and payout summaries"
              checked={true}
              onCheckedChange={() =>
                toast.message("Email preferences are coming soon")
              }
            />
          </div>
        </section>

        {/* support */}
        <section>
          <h2 className="mb-4 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Support
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            <Link to="/welcome" className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/20">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Help Center</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </section>

        {/* danger zone */}
        <section className="pt-4">
          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-foreground transition-colors hover:bg-secondary/20"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold">Sign Out</span>
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={busy}
              className="flex w-full items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-5 w-5" />
              <span className="text-sm font-semibold">Delete Account</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 ${highlight ? "bg-primary/5" : ""}`}
    >
      <div
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          highlight ? "bg-primary/15" : "bg-secondary"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${highlight ? "text-primary" : "text-muted-foreground"}`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="h-7 w-12 shrink-0 data-[state=checked]:bg-primary [&>span]:h-6 [&>span]:w-6 [&>span]:data-[state=checked]:translate-x-5"
      />
    </div>
  );
}
