import sharp from "sharp";
import { unstable_cache } from "next/cache";
import type { SilhouetteZone } from "@/types/silhouette";

const FALLBACK_ZONES: SilhouetteZone[] = [
  { xMin: 0.3, xMax: 0.55, yMin: -0.2, yMax: 0.1 },
  { xMin: -0.55, xMax: -0.3, yMin: -0.2, yMax: 0.1 },
  { xMin: 0.2, xMax: 0.4, yMin: -0.6, yMax: -0.3 },
  { xMin: -0.4, xMax: -0.2, yMin: -0.6, yMax: -0.3 },
  { xMin: -0.15, xMax: 0.15, yMin: -0.3, yMax: 0.1 },
];

const GRID_COLS = 20;
const GRID_ROWS = 24;
const MIN_PIXEL_RATIO = 0.05;
const HEAD_CUTOFF_ROW = 2;

async function analyzePixels(
  imageUrl: string,
): Promise<SilhouetteZone[] | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, info } = await sharp(buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;

    const cellW = Math.floor(width / GRID_COLS);
    const cellH = Math.floor(height / GRID_ROWS);

    const zones: SilhouetteZone[] = [];

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (row < HEAD_CUTOFF_ROW) continue;

        const startX = col * cellW;
        const startY = row * cellH;
        let opaquePixels = 0;
        const totalPixels = cellW * cellH;

        for (let y = startY; y < startY + cellH && y < height; y++) {
          for (let x = startX; x < startX + cellW && x < width; x++) {
            const idx = (y * width + x) * channels;
            const alpha = data[idx + 3];
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            const isDark = r < 80 && g < 80 && b < 80;
            if (alpha > 128 && isDark) {
              opaquePixels++;
            }
          }
        }

        if (opaquePixels / totalPixels >= MIN_PIXEL_RATIO) {
          const centerXNorm = (startX + cellW / 2) / width;
          const centerYNorm = (startY + cellH / 2) / height;

          const panX = -(centerXNorm - 0.5) * 2;
          const panY = -(centerYNorm - 0.5) * 2;

          const halfW = (cellW / width) * 0.8;
          const halfH = (cellH / height) * 0.8;

          zones.push({
            xMin: Math.max(-0.7, panX - halfW),
            xMax: Math.min(0.7, panX + halfW),
            yMin: Math.max(-0.7, panY - halfH),
            yMax: Math.min(0.7, panY + halfH),
          });
        }
      }
    }

    return zones.length > 0 ? zones : null;
  } catch (e) {
    console.error("[silhouette-zones] Pixel analysis failed:", e);
    return null;
  }
}

const getCachedZones = unstable_cache(
  async (imageUrl: string): Promise<SilhouetteZone[]> => {
    const zones = await analyzePixels(imageUrl);
    return zones ?? FALLBACK_ZONES;
  },
  ["silhouette-zones-v4"],
  { revalidate: 86400 * 7 },
);

export async function getSilhouetteZones(
  silhouettePath: string | null,
): Promise<SilhouetteZone[]> {
  if (!silhouettePath) return FALLBACK_ZONES;

  const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE_URL ?? "";
  const imageUrl = `${cdnBase}${silhouettePath}`;

  try {
    return await getCachedZones(imageUrl);
  } catch (e) {
    console.error("[silhouette-zones] Failed to get zones:", e);
    return FALLBACK_ZONES;
  }
}
