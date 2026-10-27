import {
  ArrowUpFromLine,
  Clock,
  Gauge,
  Maximize2,
  SlidersHorizontal,
  Volume2,
  Wifi,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  type PlaybackSpeed,
  usePlaybackPreferences,
} from "@/hooks/use-playback-preferences";

const SPEED_OPTIONS: PlaybackSpeed[] = [0.5, 1, 1.25, 1.5, 2];

type Props = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function PlaybackSettingsSheet({ trigger, open, onOpenChange }: Props) {
  const {
    autoScroll,
    playbackSpeed,
    clearDisplay,
    dataSaver,
    startMuted,
    setAutoScroll,
    setPlaybackSpeed,
    setClearDisplay,
    setDataSaver,
    setStartMuted,
  } = usePlaybackPreferences();

  const content = (
    <SheetContent
      side="bottom"
      className="rounded-t-3xl border-border bg-card px-0 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2"
    >
      <SheetHeader className="border-b border-border px-4 pb-3 text-left">
        <SheetTitle className="font-display text-lg">Playback</SheetTitle>
      </SheetHeader>

      <div className="divide-y divide-border">
        <PreferenceRow
          icon={ArrowUpFromLine}
          label="Auto scroll"
          description="Jump to the next video when one finishes"
          highlight
        >
          <Switch
            checked={autoScroll}
            onCheckedChange={setAutoScroll}
            className="h-7 w-12 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted [&>span]:h-6 [&>span]:w-6 [&>span]:data-[state=checked]:translate-x-5"
          />
        </PreferenceRow>

        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Speed</p>
              <p className="text-xs text-muted-foreground">Applies to the current feed</p>
            </div>
          </div>
          <div className="mt-3 flex gap-1 rounded-xl bg-secondary/60 p-1">
            {SPEED_OPTIONS.map((speed) => {
              const label = speed === 1 ? "1.0×" : `${speed}×`;
              const active = playbackSpeed === speed;
              return (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={cn(
                    "flex-1 rounded-lg py-2 text-xs font-bold transition-colors",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <PreferenceRow
          icon={Maximize2}
          label="Clear display"
          description="Hide buttons and captions for a cleaner view"
        >
          <Switch
            checked={clearDisplay}
            onCheckedChange={setClearDisplay}
            className="h-7 w-12 data-[state=checked]:bg-primary [&>span]:h-6 [&>span]:w-6 [&>span]:data-[state=checked]:translate-x-5"
          />
        </PreferenceRow>

        <PreferenceRow
          icon={Wifi}
          label="Data saver"
          description="Only load the video you're watching"
        >
          <Switch
            checked={dataSaver}
            onCheckedChange={setDataSaver}
            className="h-7 w-12 data-[state=checked]:bg-primary [&>span]:h-6 [&>span]:w-6 [&>span]:data-[state=checked]:translate-x-5"
          />
        </PreferenceRow>

        <PreferenceRow
          icon={Volume2}
          label="Start muted"
          description="Open the feed with sound off until you unmute"
        >
          <Switch
            checked={startMuted}
            onCheckedChange={setStartMuted}
            className="h-7 w-12 data-[state=checked]:bg-primary [&>span]:h-6 [&>span]:w-6 [&>span]:data-[state=checked]:translate-x-5"
          />
        </PreferenceRow>
      </div>
    </SheetContent>
  );

  if (open !== undefined && onOpenChange) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {trigger}
        {content}
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            aria-label="Playback settings"
            className="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        )}
      </SheetTrigger>
      {content}
    </Sheet>
  );
}

function PreferenceRow({
  icon: Icon,
  label,
  description,
  highlight,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-4",
        highlight && "bg-primary/5",
      )}
    >
      <div
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
          highlight ? "bg-primary/15" : "bg-secondary",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            highlight ? "text-primary" : "text-muted-foreground",
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function PlaybackSettingsTriggerButton({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Playback settings"
      onClick={onClick}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur",
        className,
      )}
    >
      <Gauge className="h-4 w-4" />
    </button>
  );
}
