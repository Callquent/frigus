export const stepFor = (unit: string) => (unit === "kg" || unit === "L" ? 0.5 : 1);
export const round = (n: number) => Math.round(n * 100) / 100;

export function daysLeft(expiresAt: string | null) {
  return expiresAt ? Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000) : null;
}

export function expiryText(days: number | null) {
  if (days === null) return "";
  if (days < 0) return "périmé";
  if (days === 0) return "à consommer aujourd'hui";
  return `à consommer dans ${days} j`;
}
