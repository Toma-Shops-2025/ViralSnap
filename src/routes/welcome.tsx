import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Sparkles, Zap, TrendingUp, Coins, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome to ViralSnap — Go Viral in Seconds" },
      { name: "description", content: "ViralSnap is the short-video platform built for creators to earn real money and grow their audience." },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <div className="relative min-h-[100dvh] bg-black text-white overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-fire opacity-20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 max-w-5xl mx-auto pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <Link to="/" className="flex items-center gap-2">
          <Flame className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl font-bold">
            Viral<span className="text-gradient-fire">Snap</span>
          </span>
        </Link>
        <Link
          to="/auth"
          className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
        >
          Sign in
        </Link>
      </header>

      <main className="relative z-10 px-6 pt-12 pb-24 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="h-3.5 w-3.5" /> Creators Deserve More
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Go Viral <br />
          <span className="text-gradient-fire">in Seconds.</span>
        </h1>

        <p className="max-w-xl mx-auto text-lg text-white/70 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          The first feed that prioritizes creator monetization. Post videos, earn ViralCoins, and build a real business from your content.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button
            asChild
            className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-fire text-lg font-bold text-white shadow-glow hover:opacity-90 transition-all active:scale-95"
          >
            <Link to="/auth">Create Account</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-14 px-8 rounded-full border-white/20 bg-white/5 text-lg font-bold text-white backdrop-blur hover:bg-white/10 transition-all active:scale-95"
          >
            <Link to="/">Watch the Feed</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-white/40 animate-in fade-in delay-500">
          No account needed to browse.
        </p>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6 text-orange-500" />}
            title="Discovery First"
            description="Our algorithm finds great content from new creators, not just the famous ones."
          />
          <FeatureCard
            icon={<Coins className="h-6 w-6 text-yellow-500" />}
            title="Real Earnings"
            description="Earn ViralCoins from your fans and cash them out for real money instantly."
          />
          <FeatureCard
            icon={<Rocket className="h-6 w-6 text-red-500" />}
            title="Creator Tools"
            description="Link in bio, in-feed product sales, and deeper audience analytics built-in."
          />
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold">ViralSnap</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/50">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/guidelines" className="hover:text-white transition-colors">Guidelines</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="text-sm text-white/30">
            © {new Date().getFullYear()} ViralSnap
            <p className="text-[8px] opacity-30 mt-2 uppercase font-black tracking-tighter">Build v2.1.8-master</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{description}</p>
    </div>
  );
}
