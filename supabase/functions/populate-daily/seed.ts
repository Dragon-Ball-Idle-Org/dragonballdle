export const DAILY_SECRET = process.env.DAILY_SECRET!;

export function cyrb128(str: string): [number, number, number, number] {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k: number; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ];
}

export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function deterministicCandidate(
  ymd: string,
  attempt: number,
  N: number,
  gameMode: string = "classic",
): number {
  const seedStr = `${ymd}|${gameMode}|${attempt}|${DAILY_SECRET}|soft-norepeat-v2`;
  const [s0] = cyrb128(seedStr);
  const rnd = mulberry32(s0); // XOR dos dois primeiros seeds — mais entropia inicial

  // Descarta as primeiras iterações para desacoplar correlação entre dias próximos
  const WARMUP = 12;
  for (let i = 0; i < WARMUP; i++) rnd();

  return Math.floor(rnd() * N);
}

export function buildDeterministicPermutation(
  n: number,
  salt: string,
): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  const [s0] = cyrb128(String(salt || ""));
  const rand = mulberry32(s0);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
