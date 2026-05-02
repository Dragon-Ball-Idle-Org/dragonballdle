declare global {
  interface Window {
    aclib?: {
      runBanner: (options: { zoneId: string; id: string }) => void;
    };
  }
}
