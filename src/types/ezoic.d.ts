// Ezoic global type declarations for TypeScript support

declare global {
  interface Window {
    // Ezoic standalone ad management
    ezstandalone?: {
      cmd?: Array<() => void>;
      [key: string]: unknown;
    };

    // Ezoic analytics and tracking
    ezoic?: {
      [key: string]: unknown;
    };

    // Ezoic consent management
    __cmp?: (
      command: string,
      parameter: number,
      callback: (data: unknown, success: boolean) => void,
    ) => void;

    // Ezoic template variables
    ez_template?: {
      [key: string]: unknown;
    };
  }
}

export {};
