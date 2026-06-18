import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Share2, Download, Flame, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";
import qrAsset from "@/assets/viralsnap-qr.png.asset.json";
import { toast } from "sonner";

const SHARE_URL = "https://viralsnap.online";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "Share ViralSnap" },
      {
        name: "description",
        content:
          "Share ViralSnap with friends — scan the QR code or copy the link to viralsnap.online.",
      },
      { property: "og:title", content: "Share ViralSnap" },
      {
        property: "og:description",
        content: "Scan the QR code or copy the link to join ViralSnap.",
      },
    ],
  }),
  component: SharePage,
});

function SharePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ViralSnap",
          text: "Check out ViralSnap — short videos that pay creators.",
          url: SHARE_URL,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await handleCopy();
    }
  };

  const handleDownload = () => {
    if (!qr) return;
    const a = document.createElement("a");
    a.href = qr;
    a.download = "viralsnap-qr.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-[100dvh] pb-28">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link
          to="/settings"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl font-bold">Share ViralSnap</h1>
      </header>

      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-6">
        <div className="mb-2 flex items-center gap-2 text-gradient-fire">
          <Flame className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-bold">Spread the fire</span>
        </div>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Scan the code or copy the link to invite friends to ViralSnap.
        </p>

        {/* White rounded QR card */}
        <div className="w-full max-w-xs rounded-3xl bg-white p-6 shadow-glow">
          <div className="aspect-square w-full overflow-hidden rounded-2xl">
            {qr ? (
              <img
                src={qr}
                alt="QR code to viralsnap.online"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="h-full w-full animate-pulse rounded-2xl bg-black/10" />
            )}
          </div>
          <p className="mt-4 text-center font-display text-base font-bold text-[#1a1326]">
            viralsnap.online
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 grid w-full max-w-xs grid-cols-1 gap-3">
          <Button onClick={handleShare} className="h-12 rounded-full bg-gradient-fire text-base font-semibold shadow-glow">
            <Share2 className="mr-2 h-5 w-5" /> Share
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCopy}
              variant="secondary"
              className="h-12 rounded-full text-sm font-semibold"
            >
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy link"}
            </Button>
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="h-12 rounded-full text-sm font-semibold"
            >
              <Download className="mr-2 h-4 w-4" /> Download QR
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
