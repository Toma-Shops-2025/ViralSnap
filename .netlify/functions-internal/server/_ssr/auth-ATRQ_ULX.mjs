import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Button } from "./button-DJnjoRwr.mjs";
import { I as Input } from "./input-Dvr-lYPf.mjs";
import { L as Label, C as Checkbox } from "./checkbox-B4QQ4Tul.mjs";
import { s as supabase } from "./client-jZBAtL8Q.mjs";
import { c as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
import { u as useAuth } from "./router-DDjFEyQJ.mjs";
import { a as assertContentAllowed } from "./content-policy-BiVAVm1B.mjs";
import "../_libs/seroval.mjs";
import "../_libs/stripe.mjs";
import { u as Flame, s as EyeOff, r as Eye } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-BB9uwBYF.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-CauiqJuS.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./client.server-U_pH-Evd.mjs";
import "./stripe.server-DSl7M_sI.mjs";
import "node:process";
import "events";
import "http";
import "https";
import "os";
const lovable = {
  auth: createLovableAuth({
    // Placeholder for Lovable Cloud Auth config
  })
};
function AuthPage() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [mode, setMode] = reactExports.useState("signup");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [username, setUsername] = reactExports.useState("");
  const [ageOk, setAgeOk] = reactExports.useState(false);
  const [terms, setTerms] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user) navigate({
      to: "/",
      replace: true
    });
  }, [user, navigate]);
  const handleEmail = async (e) => {
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
        const chosenUsername = (username || email.split("@")[0]).trim();
        try {
          assertContentAllowed({
            username: chosenUsername,
            displayName: chosenUsername
          });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Username not allowed");
          return;
        }
        const {
          data: authData,
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              username: username || email.split("@")[0],
              display_name: username || email.split("@")[0],
              age_verified: true
            }
          }
        });
        if (!error && authData.user) {
          await supabase.from("profiles").insert({
            id: authData.user.id,
            username: username || email.split("@")[0],
            email
          }).catch((err) => console.warn("Profile sync error", err));
        }
        if (error) throw error;
        const {
          error: signInError
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) {
          toast.success("Account created!", {
            description: "Please sign in with your new credentials."
          });
          setMode("signin");
        } else {
          toast.success("Welcome to ViralSnap! 🔥");
          navigate({
            to: "/",
            replace: true
          });
        }
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        navigate({
          to: "/",
          replace: true
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin
    });
    if (result?.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-fire opacity-30 blur-3xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mb-8 flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-7 w-7 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-2xl font-bold", children: [
          "Viral",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-fire", children: "Snap" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-center font-display text-2xl font-bold", children: mode === "signup" ? "Create your account" : "Welcome back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-center text-sm text-muted-foreground", children: mode === "signup" ? "Creators deserve more. Start earning today." : "Sign in to your ViralSnap account." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleGoogle, variant: "outline", className: "mt-6 w-full rounded-full border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleIcon, {}),
        " Continue with Google"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-5 flex items-center gap-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
        "or",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmail, className: "space-y-3", children: [
        mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "username", children: "Username" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "username", value: username, onChange: (e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")), placeholder: "yourhandle", className: "mt-1 rounded-xl bg-card" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", className: "mt-1 rounded-xl bg-card" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: showPassword ? "text" : "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", className: "rounded-xl bg-card pr-10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword((v) => !v), "aria-label": showPassword ? "Hide password" : "Show password", "aria-pressed": showPassword, className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
          ] })
        ] }),
        mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: ageOk, onCheckedChange: (v) => setAgeOk(v === true), className: "mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "I confirm I am 18 years or older." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: terms, onCheckedChange: (v) => setTerms(v === true), className: "mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "I agree to the Terms of Service and Creator Agreement." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "w-full rounded-full bg-gradient-fire text-primary-foreground shadow-glow hover:opacity-90", children: loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-5 text-center text-sm text-muted-foreground", children: [
        mode === "signup" ? "Already have an account?" : "New to ViralSnap?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(mode === "signup" ? "signin" : "signup"), className: "font-semibold text-primary", children: mode === "signup" ? "Sign in" : "Create one" })
      ] })
    ] })
  ] });
}
function GoogleIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", className: "h-4 w-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FFC107", d: "M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 4.1 29.3 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22 22-9.8 22-22c0-1.5-.2-2.6-.4-3.5z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FF3D00", d: "M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 4.1 29.3 2 24 2 16.3 2 9.7 6.3 6.3 14.7z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4CAF50", d: "M24 46c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.9 26.7 38 24 38c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 41.6 16.2 46 24 46z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#1976D2", d: "M43.6 20.5H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.4l6.2 5.2C40.9 36.4 44 30.8 44 24c0-1.5-.2-2.6-.4-3.5z" })
  ] });
}
export {
  AuthPage as component
};
