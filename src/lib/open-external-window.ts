function applyShellStyles(document: Document) {
  document.body.style.minHeight = "100vh";
  document.body.style.display = "grid";
  document.body.style.placeItems = "center";
  document.body.style.margin = "0";
  document.body.style.background = "#090a14";
  document.body.style.color = "#fff";
  document.body.style.fontFamily =
    "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  document.body.style.textAlign = "center";
}

export function openPendingExternalWindow(title = "Opening…") {
  if (typeof window === "undefined") return null;

  const opened = window.open("", "_blank");
  if (!opened) return null;

  try {
    opened.document.title = title;
    opened.document.body.replaceChildren();
    applyShellStyles(opened.document);

    const wrap = opened.document.createElement("main");
    const heading = opened.document.createElement("p");
    heading.textContent = title;
    heading.style.fontSize = "16px";
    heading.style.fontWeight = "700";
    heading.style.margin = "0 0 8px";

    const message = opened.document.createElement("p");
    message.textContent = "This tab will continue in a moment.";
    message.style.fontSize = "13px";
    message.style.opacity = ".72";
    message.style.margin = "0";

    wrap.append(heading, message);
    opened.document.body.append(wrap);
    opened.focus();
  } catch {
    // The window still opened; continue even if the browser blocks document writes.
  }

  return opened;
}

export function sendPendingExternalWindow(opened: Window | null, url: string) {
  if (!opened || opened.closed) return false;
  try {
    opened.document.title = "Continue payout setup";
    opened.document.body.replaceChildren();
    applyShellStyles(opened.document);

    const wrap = opened.document.createElement("main");
    const heading = opened.document.createElement("p");
    heading.textContent = "Continue payout setup";
    heading.style.fontSize = "18px";
    heading.style.fontWeight = "800";
    heading.style.margin = "0 0 8px";

    const message = opened.document.createElement("p");
    message.textContent = "Your secure payout setup link is ready.";
    message.style.fontSize = "13px";
    message.style.opacity = ".72";
    message.style.margin = "0 0 20px";

    const link = opened.document.createElement("a");
    link.href = url;
    link.textContent = "Open payout setup";
    link.style.display = "inline-flex";
    link.style.alignItems = "center";
    link.style.justifyContent = "center";
    link.style.minHeight = "44px";
    link.style.padding = "0 22px";
    link.style.borderRadius = "999px";
    link.style.background = "linear-gradient(135deg,#ff2e75,#ffc629)";
    link.style.color = "#fff";
    link.style.fontSize = "14px";
    link.style.fontWeight = "800";
    link.style.textDecoration = "none";

    wrap.append(heading, message, link);
    opened.document.body.append(wrap);
    opened.focus();
    return true;
  } catch {
    return false;
  }
}
