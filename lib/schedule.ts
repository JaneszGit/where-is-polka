// A hét váltás mindig vasárnap este történik.
// Egy "periódus" vasárnaptól (a váltás napja) a következő szombatig tart.
// Azt kell tudni, hogy egy adott vasárnapi periódusban ki tartja Polkát,
// ehhez egy referencia-vasárnapot és a hozzá tartozó gazdát tároljuk.

export type Owner = "me" | "rita";

export interface ScheduleSettings {
  referenceSunday: string; // "YYYY-MM-DD", egy vasárnap, amikor ownerAtReference-nél volt/van Polka
  ownerAtReference: Owner;
  ownerNames: { me: string; rita: string };
}

export interface Override {
  date: string; // "YYYY-MM-DD"
  owner: Owner;
  note?: string;
}

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** A hét eleji (vasárnapi) dátum, amelybe az adott nap esik. */
function periodStart(date: Date): Date {
  const d = toDateOnly(date);
  const dow = d.getDay(); // 0 = vasárnap
  d.setDate(d.getDate() - dow);
  return d;
}

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/** Kié Polka egy adott napon, a felülírásokat is figyelembe véve. */
export function getOwnerForDate(
  dateInput: Date | string,
  settings: ScheduleSettings,
  overrides: Override[] = []
): { owner: Owner; overridden: boolean; note?: string } {
  const date = typeof dateInput === "string" ? parseISODate(dateInput) : dateInput;
  const iso = formatISODate(toDateOnly(date));

  const override = overrides.find((o) => o.date === iso);
  if (override) {
    return { owner: override.owner, overridden: true, note: override.note };
  }

  const thisPeriodStart = periodStart(date);
  const referencePeriodStart = periodStart(parseISODate(settings.referenceSunday));

  const weeksDiff = Math.round(
    (thisPeriodStart.getTime() - referencePeriodStart.getTime()) / MS_PER_WEEK
  );

  const isReferenceOwnerWeek = ((weeksDiff % 2) + 2) % 2 === 0;
  const owner: Owner = isReferenceOwnerWeek
    ? settings.ownerAtReference
    : settings.ownerAtReference === "me"
    ? "rita"
    : "me";

  return { owner, overridden: false };
}

/** Egy teljes év minden napjára visszaadja, kinél volt/van Polka. Dashboardhoz. */
export function getYearSchedule(
  year: number,
  settings: ScheduleSettings,
  overrides: Override[] = []
): { date: string; owner: Owner; overridden: boolean }[] {
  const result: { date: string; owner: Owner; overridden: boolean }[] = [];
  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    const { owner, overridden } = getOwnerForDate(d, settings, overrides);
    result.push({ date: formatISODate(d), owner, overridden });
    d.setDate(d.getDate() + 1);
  }
  return result;
}

export { formatISODate, parseISODate };
