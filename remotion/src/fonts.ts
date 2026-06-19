import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/PlusJakartaSans";

export const serif = loadSerif("normal", { weights: ["700", "900"] }).fontFamily;
export const sans = loadSans("normal", { weights: ["400", "500", "600", "700", "800"] }).fontFamily;
