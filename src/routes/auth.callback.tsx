import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Finishing sign-in…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const oauthError = params.get("error_description") || params.get("error");

      if (oauthError) {
        if (!cancelled) {
          toast.error(oauthError);
          navigate({ to: "/auth", replace: true });
        }
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!cancelled) {
            toast.error(error.message ?? "Google sign-in failed");
            navigate({ to: "/auth", replace: true });
          }
          return;
        }
        window.history.replaceState({}, document.title, "/auth/callback");
      }

      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;

      if (error || !data.session) {
        setMessage("Sign-in incomplete");
        toast.error("Could not finish Google sign-in. Try again.");
        navigate({ to: "/auth", replace: true });
        return;
      }

      toast.success("Welcome to ViralSnap!");
      navigate({ to: "/", replace: true });
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 px-6 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </main>
  );
}
