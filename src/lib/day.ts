export function getDayIndex(): number {
  const start = new Date("2024-01-01T00:00:00Z");
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
