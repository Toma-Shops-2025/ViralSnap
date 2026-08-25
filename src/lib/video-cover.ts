/**
 * Capture a JPEG cover frame from a local video File (upload flow).
 */
export async function captureCoverFromVideoFile(file: File): Promise<Blob | null> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const el = document.createElement("video");
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.preload = "auto";
    el.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      const onReady = () => resolve();
      el.addEventListener("loadeddata", onReady, { once: true });
      el.addEventListener("error", () => reject(new Error("Could not read video for cover")), {
        once: true,
      });
    });

    const seekTo =
      Number.isFinite(el.duration) && el.duration > 0
        ? Math.min(0.5, el.duration * 0.08)
        : 0.1;

    await new Promise<void>((resolve) => {
      el.addEventListener("seeked", () => resolve(), { once: true });
      try {
        el.currentTime = seekTo;
      } catch {
        resolve();
      }
    });

    if (!el.videoWidth || !el.videoHeight) return null;

    const maxW = 720;
    const scale = Math.min(1, maxW / el.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(el.videoWidth * scale);
    canvas.height = Math.round(el.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(el, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.85);
    });
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
