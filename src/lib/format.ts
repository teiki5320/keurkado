const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function formatPrice(cents: number): string {
  return euro.format(cents / 100);
}

const longDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** « 2026-09-28 » → « 28 septembre 2026 ». */
export function formatDate(iso: string): string {
  return longDate.format(new Date(`${iso}T12:00:00Z`));
}
