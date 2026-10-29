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

// A @db.Date value arrives as UTC midnight. Turn it back into that calendar day, in local time.
export function fromDbDay(value: Date | string) {
  const d = new Date(value);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
