export function msUntilMidnightUTC(): number {
  const midnight = new Date();
  midnight.setUTCHours(24, 0, 0, 0);
  return midnight.getTime() - Date.now();
}
