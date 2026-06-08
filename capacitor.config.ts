import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "online.viralsnap.app",
  appName: "ViralSnap",
  webDir: "dist/client",
  server: {
    // Load the live SSR'd site so TanStack Start hydrates correctly inside the
    // native WebView (a static index.html alone cannot hydrate SSR routes).
    url: "https://viralsnap.online",
    cleartext: false,
  },
  android: {
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    Keyboard: {
      resize: "native",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
