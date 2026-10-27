import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PlaybackSpeed = 0.5 | 1 | 1.25 | 1.5 | 2;

export type PlaybackPreferences = {
  autoScroll: boolean;
  playbackSpeed: PlaybackSpeed;
  clearDisplay: boolean;
  dataSaver: boolean;
  /** When true, the feed opens muted until the viewer unmutes. */
  startMuted: boolean;
};

const STORAGE_KEY = "viralsnap-playback-preferences";

const DEFAULTS: PlaybackPreferences = {
  autoScroll: true,
  playbackSpeed: 1,
  clearDisplay: false,
  dataSaver: false,
  startMuted: true,
};

type PlaybackPreferencesContextValue = PlaybackPreferences & {
  setAutoScroll: (value: boolean) => void;
  setPlaybackSpeed: (value: PlaybackSpeed) => void;
  setClearDisplay: (value: boolean) => void;
  setDataSaver: (value: boolean) => void;
  setStartMuted: (value: boolean) => void;
  updatePreferences: (patch: Partial<PlaybackPreferences>) => void;
};

const PlaybackPreferencesContext =
  createContext<PlaybackPreferencesContextValue | undefined>(undefined);

function parseStored(raw: string | null): PlaybackPreferences {
  if (!raw) return DEFAULTS;
  try {
    const parsed = JSON.parse(raw) as Partial<PlaybackPreferences>;
    const speed = parsed.playbackSpeed;
    const validSpeed =
      speed === 0.5 || speed === 1 || speed === 1.25 || speed === 1.5 || speed === 2
        ? speed
        : DEFAULTS.playbackSpeed;
    return {
      autoScroll: parsed.autoScroll ?? DEFAULTS.autoScroll,
      playbackSpeed: validSpeed,
      clearDisplay: parsed.clearDisplay ?? DEFAULTS.clearDisplay,
      dataSaver: parsed.dataSaver ?? DEFAULTS.dataSaver,
      startMuted: parsed.startMuted ?? DEFAULTS.startMuted,
    };
  } catch {
    return DEFAULTS;
  }
}

export function PlaybackPreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<PlaybackPreferences>(DEFAULTS);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    setPrefs(parseStored(localStorage.getItem(STORAGE_KEY)));
  }, []);

  const updatePreferences = useCallback((patch: Partial<PlaybackPreferences>) => {
    setPrefs((current) => {
      const next = { ...current, ...patch };
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const setAutoScroll = useCallback(
    (value: boolean) => updatePreferences({ autoScroll: value }),
    [updatePreferences],
  );
  const setPlaybackSpeed = useCallback(
    (value: PlaybackSpeed) => updatePreferences({ playbackSpeed: value }),
    [updatePreferences],
  );
  const setClearDisplay = useCallback(
    (value: boolean) => updatePreferences({ clearDisplay: value }),
    [updatePreferences],
  );
  const setDataSaver = useCallback(
    (value: boolean) => updatePreferences({ dataSaver: value }),
    [updatePreferences],
  );
  const setStartMuted = useCallback(
    (value: boolean) => updatePreferences({ startMuted: value }),
    [updatePreferences],
  );

  const value = useMemo(
    () => ({
      ...prefs,
      setAutoScroll,
      setPlaybackSpeed,
      setClearDisplay,
      setDataSaver,
      setStartMuted,
      updatePreferences,
    }),
    [
      prefs,
      setAutoScroll,
      setPlaybackSpeed,
      setClearDisplay,
      setDataSaver,
      setStartMuted,
      updatePreferences,
    ],
  );

  return (
    <PlaybackPreferencesContext.Provider value={value}>
      {children}
    </PlaybackPreferencesContext.Provider>
  );
}

export function usePlaybackPreferences() {
  const ctx = useContext(PlaybackPreferencesContext);
  if (!ctx) {
    throw new Error("usePlaybackPreferences must be used within PlaybackPreferencesProvider");
  }
  return ctx;
}
