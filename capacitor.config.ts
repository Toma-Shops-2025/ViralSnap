/// <reference types="@capawesome/capacitor-android-edge-to-edge-support" />

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
    SystemBars: {
      // Let @capawesome/...-edge-to-edge-support own WebView insets (Play edge-to-edge guidance).
      insetsHandling: "disable",
    },
    EdgeToEdge: {
      backgroundColor: "#000000",
      statusBarColor: "#000000",
      navigationBarColor: "#000000",
    },
    Keyboard: {
      resize: "native",
      // Must stay false when using the EdgeToEdge plugin (Capawesome).
      resizeOnFullScreen: false,
    },
  },
};

export default config;
