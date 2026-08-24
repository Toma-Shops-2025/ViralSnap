import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "online.viralsnap.app",
  appName: "ViralSnap",
  webDir: "dist",
  server: {
    // Live SSR site — required for TanStack Start hydration in the WebView.
    url: "https://viralsnap.online",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    Keyboard: {
      resize: "native",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
