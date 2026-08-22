function compact(n) {
  const v = n ?? 0;
  if (v < 1e3) return String(v);
  if (v < 1e6) return (v / 1e3).toFixed(v % 1e3 === 0 ? 0 : 1).replace(/\.0$/, "") + "K";
  return (v / 1e6).toFixed(v % 1e6 === 0 ? 0 : 1).replace(/\.0$/, "") + "M";
}
function timeAgo(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1e3);
  if (seconds < 60) return "now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;
  return d.toLocaleDateString();
}
export {
  compact as c,
  timeAgo as t
};
