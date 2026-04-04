export interface HydrationMeta {
  id: "hydration_status"; // keyPath fixo
  locale: string;
  status: "pending" | "complete" | "error";
  totalCount: number;
  loadedCount: number;
  cachedAt: number;
}
