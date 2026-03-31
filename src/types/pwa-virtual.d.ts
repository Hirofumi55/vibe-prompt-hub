declare module 'virtual:pwa-info' {
  export interface PwaInfo {
    webManifest: {
      href: string;
      useCredentials: boolean;
      linkTag: string;
    };
    registerSW?: {
      scriptTag?: string;
    };
  }

  export const pwaInfo: PwaInfo | undefined;
}

declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    onOfflineReady?: () => void;
    onNeedRefresh?: () => void;
  }

  export function registerSW(options?: RegisterSWOptions): () => Promise<void>;
}
