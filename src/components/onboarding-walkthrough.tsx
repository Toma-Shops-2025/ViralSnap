import { useEffect, useState } from "react";
import { Flame, Coins, Heart, Upload, ChevronRight, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const STORAGE_KEY = "viralsnap-onboarded";

const slides = [
  {
    icon: Flame,
    title: "Welcome to ViralSnap",
    body: "An endless feed of short videos from creators who actually get paid. Swipe up to keep watching — it never runs out.",
  },
  {
    icon: Coins,
    title: "Earn & spend ViralCoins",
    body: "You start with 500 ViralCoins. Send gifts to creators you love, and earn coins when people support you.",
  },
  {
    icon: Heart,
    title: "Follow & support creators",
    body: "Like, comment, follow, and gift. Your support puts real money in creators' pockets.",
  },
  {
    icon: Upload,
    title: "Become a creator",
    body: "Post your own videos, add a link in bio, sell products in-feed, and cash out your earnings.",
  },
];

export function OnboardingWalkthrough() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // If user logs out, hide the walkthrough immediately
    if (!user) {
      setOpen(false);
      return;
    }

    try {
      // Logic: ONLY show if user is logged in AND has not finished onboarding on this device yet
      if (!localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, [user]);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-sm rounded-t-3xl border border-border bg-card p-6 pb-8 shadow-glow sm:rounded-3xl">
        <button
          onClick={finish}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
          aria-label="Skip"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-fire shadow-glow">
          <Icon className="h-8 w-8 text-primary-foreground" />
        </div>

        <h2 className="mt-5 font-display text-2xl font-bold">{slide.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{slide.body}</p>

        <div className="mt-6 flex items-center justify-center gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button onClick={finish} className="text-sm font-medium text-muted-foreground">
            Skip
          </button>
          {isLast ? (
            <button
              onClick={finish}
              className="flex items-center gap-1 rounded-full bg-gradient-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Get started
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1 rounded-full bg-gradient-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
