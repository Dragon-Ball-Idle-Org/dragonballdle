export function msUntilMidnightBrasilia(): number {
  const now = new Date();

  // Obter componentes da data/hora em Brasília (America/Sao_Paulo)
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const values: Record<string, string> = {};

  parts.forEach((part) => {
    values[part.type] = part.value;
  });

  // Extrair componentes
  const year = parseInt(values.year);
  const month = parseInt(values.month) - 1; // Array de meses usa 0-11
  const day = parseInt(values.day);
  const hour = parseInt(values.hour);
  const minute = parseInt(values.minute);
  const second = parseInt(values.second);

  // Calcular offset entre hora de Brasília e UTC
  const brasiliaDateTime = new Date(year, month, day, hour, minute, second);
  const offset = brasiliaDateTime.getTime() - now.getTime();

  // Próxima meia-noite em Brasília
  const nextMidnightBrasilia = new Date(year, month, day + 1, 0, 0, 0, 0);

  // Converter para UTC subtraindo o offset
  const nextMidnightUTC = new Date(nextMidnightBrasilia.getTime() - offset);

  return nextMidnightUTC.getTime() - now.getTime();
}
