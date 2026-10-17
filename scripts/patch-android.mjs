/**
 * Applies ViralSnap Android customizations after `npx cap sync android`.
 * The `android/` folder is generated locally and gitignored; this script keeps fixes reproducible.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const androidDir = path.join(root, "android");
const nativeDir = path.join(root, "native-android");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function ensureAndroidProject() {
  if (!fs.existsSync(androidDir)) {
    console.error(
      "android/ not found. Run: npm run build && npx cap add android && npm run cap:sync:android",
    );
    process.exit(1);
  }
}

function copyMainActivity() {
  const src = path.join(nativeDir, "MainActivity.java");
  const dest = path.join(
    androidDir,
    "app/src/main/java/online/viralsnap/app/MainActivity.java",
  );
  write(dest, read(src));
  console.log("patched MainActivity.java (enableEdgeToEdge)");
}

function patchAppBuildGradle() {
  const file = path.join(androidDir, "app/build.gradle");
  let content = read(file);

  const releaseBlock = `    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
`;

  if (!content.includes("buildTypes")) {
    throw new Error("Unexpected app/build.gradle shape (no buildTypes)");
  }

  content = content.replace(
    /buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?\}[\s\S]*?\}/m,
    releaseBlock,
  );

  write(file, content);
  console.log("patched app/build.gradle (R8 minify + shrinkResources)");
}

function patchGradleProperties() {
  const file = path.join(androidDir, "gradle.properties");
  let content = fs.existsSync(file) ? read(file) : "";

  const lines = [
    "android.enableR8.fullMode=true",
    "android.r8.optimizedResourceShrinking=true",
  ];

  for (const line of lines) {
    const key = line.split("=")[0];
    if (content.includes(`${key}=`)) {
      content = content.replace(new RegExp(`^${key}=.*$`, "m"), line);
    } else {
      content = content.trimEnd() + (content.endsWith("\n") ? "" : "\n") + line + "\n";
    }
  }

  write(file, content);
  console.log("patched gradle.properties (R8 full mode)");
}

function patchProguardRules() {
  const file = path.join(androidDir, "app/proguard-rules.pro");
  const marker = "# --- ViralSnap / Capacitor ---";
  let content = fs.existsSync(file) ? read(file) : "";

  if (content.includes(marker)) {
    return;
  }

  content += `
${marker}
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes *Annotation*
-dontwarn com.getcapacitor.**
`;

  write(file, content.trimEnd() + "\n");
  console.log("patched proguard-rules.pro");
}

function patchStylesXml() {
  const file = path.join(androidDir, "app/src/main/res/values/styles.xml");
  if (!fs.existsSync(file)) {
    return;
  }

  let content = read(file);
  const cutoutItem =
    '        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>';

  if (content.includes("windowLayoutInDisplayCutoutMode")) {
    return;
  }

  content = content.replace(
    /(<style name="AppTheme\.NoActionBar"[^>]*>)/,
    `$1\n${cutoutItem}`,
  );

  write(file, content);
  console.log("patched styles.xml (display cutout)");
}

ensureAndroidProject();
copyMainActivity();
patchAppBuildGradle();
patchGradleProperties();
patchProguardRules();
patchStylesXml();
console.log("Android patch complete.");
