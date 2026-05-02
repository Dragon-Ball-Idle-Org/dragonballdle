declare global {
  interface Window {
    aclib?: {
      runBanner: (options: { zoneId: string }) => void;
    };
  }
}
