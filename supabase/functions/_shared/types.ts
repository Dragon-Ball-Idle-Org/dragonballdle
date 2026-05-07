export const VALID_GAME_MODES = ["classic", "silhouette"] as const;
export type GameMode = (typeof VALID_GAME_MODES)[number];

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}
