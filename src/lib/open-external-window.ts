export function openPendingExternalWindow(title = "Opening…") {
  if (typeof window === "undefined") return null;

  const opened = window.open("", "_blank");
  if (!opened) return null;

  try {
    opened.opener = null;
    opened.document.title = title;
    opened.document.body.innerHTML = `
      <main style="min-height:100vh;display:grid;place-items:center;margin:0;background:#090a14;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;text-align:center;">
        <div>
          <p style="font-size:16px;font-weight:700;margin:0 0 8px;">${title}</p>
          <p style="font-size:13px;opacity:.72;margin:0;">This tab will continue in a moment.</p>
        </div>
      </main>
    `;
  } catch {
    // The window still opened; continue even if the browser blocks document writes.
  }

  return opened;
}

export function sendPendingExternalWindow(opened: Window | null, url: string) {
  if (!opened || opened.closed) return false;
  try {
    opened.location.replace(url);
    return true;
  } catch {
    return false;
  }
}
