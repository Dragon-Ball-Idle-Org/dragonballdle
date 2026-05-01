export function getMillisecondsUntilTomorrowSaoPaulo(): number {
  const now = new Date();

  // Create a formatter for the Sao Paulo time zone
  const saoPauloFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  // Get the current time in Sao Paulo as parts
  const nowParts = saoPauloFormatter.formatToParts(now);
  const hour = parseInt(nowParts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = parseInt(
    nowParts.find((p) => p.type === "minute")?.value ?? "0",
  );
  const second = parseInt(
    nowParts.find((p) => p.type === "second")?.value ?? "0",
  );

  // Calculate the total seconds from the start of the day in Sao Paulo
  const secondsFromMidnight = hour * 3600 + minute * 60 + second;

  // Total seconds in a day
  const totalSecondsInADay = 24 * 3600;

  // Seconds remaining until the next midnight
  const remainingSeconds = totalSecondsInADay - secondsFromMidnight;

  return remainingSeconds * 1000;
}
