export function dayInTz(tz: string, d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(d);
}

export function localDay(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // "2026-10-24"
}

export const localTz = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
