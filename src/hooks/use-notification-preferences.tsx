import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type NotificationPreferences = {
  pushComments: boolean;
  pushLikes: boolean;
  pushGifts: boolean;
  pushLive: boolean;
  emailUpdates: boolean;
};

const STORAGE_KEY = "viralsnap-notification-preferences";

const DEFAULTS: NotificationPreferences = {
  pushComments: true,
  pushLikes: true,
  pushGifts: true,
  pushLive: true,
  emailUpdates: false,
};

type ContextValue = NotificationPreferences & {
  setPushComments: (value: boolean) => void;
  setPushLikes: (value: boolean) => void;
  setPushGifts: (value: boolean) => void;
  setPushLive: (value: boolean) => void;
  setEmailUpdates: (value: boolean) => void;
  updatePreferences: (patch: Partial<NotificationPreferences>) => void;
};

const NotificationPreferencesContext =
  createContext<ContextValue | undefined>(undefined);

function parseStored(raw: string | null): NotificationPreferences {
  if (!raw) return DEFAULTS;
  try {
    const parsed = JSON.parse(raw) as Partial<NotificationPreferences>;
    return {
      pushComments: parsed.pushComments ?? DEFAULTS.pushComments,
      pushLikes: parsed.pushLikes ?? DEFAULTS.pushLikes,
      pushGifts: parsed.pushGifts ?? DEFAULTS.pushGifts,
      pushLive: parsed.pushLive ?? DEFAULTS.pushLive,
      emailUpdates: parsed.emailUpdates ?? DEFAULTS.emailUpdates,
    };
  } catch {
    return DEFAULTS;
  }
}

export function NotificationPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULTS);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    setPrefs(parseStored(localStorage.getItem(STORAGE_KEY)));
  }, []);

  const updatePreferences = useCallback(
    (patch: Partial<NotificationPreferences>) => {
      setPrefs((current) => {
        const next = { ...current, ...patch };
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
    },
    [],
  );

  const setPushComments = useCallback(
    (value: boolean) => updatePreferences({ pushComments: value }),
    [updatePreferences],
  );
  const setPushLikes = useCallback(
    (value: boolean) => updatePreferences({ pushLikes: value }),
    [updatePreferences],
  );
  const setPushGifts = useCallback(
    (value: boolean) => updatePreferences({ pushGifts: value }),
    [updatePreferences],
  );
  const setPushLive = useCallback(
    (value: boolean) => updatePreferences({ pushLive: value }),
    [updatePreferences],
  );
  const setEmailUpdates = useCallback(
    (value: boolean) => updatePreferences({ emailUpdates: value }),
    [updatePreferences],
  );

  const value = useMemo(
    () => ({
      ...prefs,
      setPushComments,
      setPushLikes,
      setPushGifts,
      setPushLive,
      setEmailUpdates,
      updatePreferences,
    }),
    [
      prefs,
      setPushComments,
      setPushLikes,
      setPushGifts,
      setPushLive,
      setEmailUpdates,
      updatePreferences,
    ],
  );

  return (
    <NotificationPreferencesContext.Provider value={value}>
      {children}
    </NotificationPreferencesContext.Provider>
  );
}

export function useNotificationPreferences() {
  const ctx = useContext(NotificationPreferencesContext);
  if (!ctx) {
    throw new Error(
      "useNotificationPreferences must be used within NotificationPreferencesProvider",
    );
  }
  return ctx;
}
