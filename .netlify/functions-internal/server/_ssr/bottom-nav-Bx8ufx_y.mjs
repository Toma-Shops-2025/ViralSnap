import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { u as useAuth } from "./router-QVK_Sz8y.mjs";
import { x as House, m as Compass, j as CirclePlus, ac as Wallet, a7 as User } from "../_libs/lucide-react.mjs";
const items = [
  { to: "/", label: "Feed", icon: House },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/upload", label: "Create", icon: CirclePlus, accent: true },
  { to: "/wallet", label: "Wallet", icon: Wallet }
];
function BottomNav() {
  const { profile, user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const profileTo = profile ? `/u/${profile.username}` : "/welcome";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/80 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]", children: [
    items.map((item) => {
      const active = pathname === item.to;
      const Icon = item.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: item.to,
          className: "flex flex-1 flex-col items-center gap-0.5",
          children: [
            item.accent ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-9 w-12 items-center justify-center rounded-xl bg-gradient-fire shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6 text-primary-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Icon,
              {
                className: cn(
                  "h-6 w-6 transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                ),
                children: item.label
              }
            )
          ]
        },
        item.to
      );
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: profileTo, className: "flex flex-1 flex-col items-center gap-0.5", children: [
      profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: profile.avatar_url,
          alt: profile.username,
          className: cn(
            "h-6 w-6 rounded-full object-cover",
            pathname.startsWith("/u/") && "ring-2 ring-primary"
          )
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        User,
        {
          className: cn(
            "h-6 w-6",
            pathname.startsWith("/u/") || pathname === "/welcome" && !user ? "text-primary" : "text-muted-foreground"
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: cn(
            "text-[10px] font-medium",
            pathname.startsWith("/u/") ? "text-primary" : "text-muted-foreground"
          ),
          children: "Profile"
        }
      )
    ] })
  ] }) });
}
export {
  BottomNav as B
};
