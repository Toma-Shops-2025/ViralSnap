import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";

/** Sync status/navigation bar icon style and scrim colors with the app theme (Android WebView only). */
export async function syncAndroidSystemUi(theme: "light" | "dark"): Promise<void> {
  if (Capacitor.getPlatform() !== "android") {
    return;
  }

  const isDark = theme === "dark";
  const background = isDark ? "#000000" : "#ffffff";

  try {
    await SystemBars.setStyle({
      style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
    });
    await EdgeToEdge.setBackgroundColor({ color: background });
  } catch (error) {
    console.warn("[android-system-ui] Failed to sync system UI", error);
  }
}
