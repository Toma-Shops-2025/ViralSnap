import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flame, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Join ViralSnap — Sign in" },
      { name: "description", content: "Create your ViralSnap creator account and start earning." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [ageOk, setAgeOk] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/", replace: true });
  }, [user, navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!ageOk) {
          toast.error("You must be 18 or older to join.");
          return;
        }
        if (!terms) {
          toast.error("Please accept the Terms and Creator Agreement.");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              username: username || email.split("@")[0],
              display_name: username || email.split("@")[0],
              age_verified: true,
            },
          },
        });
        if (error) throw error;
        toast.success("Welcome to ViralSnap! 🔥", {
          description: "Check your email to confirm, then sign in.",
        });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result?.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-10">
      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-fire opacity-30 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <Flame className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl font-bold">
            Viral<span className="text-gradient-fire">Snap</span>
          </span>
        </Link>

        <h1 className="text-center font-display text-2xl font-bold">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {mode === "signup"
            ? "Creators deserve more. Start earning today."
            : "Sign in to your ViralSnap account."}
        </p>

        <Button
          onClick={handleGoogle}
          variant="outline"
          className="mt-6 w-full rounded-full border-border bg-card"
        >
          <GoogleIcon /> Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          {mode === "signup" && (
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="yourhandle"
                className="mt-1 rounded-xl bg-card"
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 rounded-xl bg-card"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 rounded-xl bg-card"
            />
          </div>

          {mode === "signup" && (
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <Checkbox
                  checked={ageOk}
                  onCheckedChange={(v) => setAgeOk(v === true)}
                  className="mt-0.5"
                />
                <span>I confirm I am 18 years or older.</span>
              </label>
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <Checkbox
                  checked={terms}
                  onCheckedChange={(v) => setTerms(v === true)}
                  className="mt-0.5"
                />
                <span>I agree to the Terms of Service and Creator Agreement.</span>
              </label>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90"
          >
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New to ViralSnap?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="font-semibold text-primary"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#FFC107"
        d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 4.1 29.3 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22 22-9.8 22-22c0-1.5-.2-2.6-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 4.1 29.3 2 24 2 16.3 2 9.7 6.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 46c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.9 26.7 38 24 38c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 41.6 16.2 46 24 46z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.2 5.2C40.9 36.4 44 30.8 44 24c0-1.5-.2-2.6-.4-3.5z"
      />
    </svg>
  );
}
