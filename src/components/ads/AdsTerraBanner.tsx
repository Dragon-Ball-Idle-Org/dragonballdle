'use client';

import { useEffect, useRef } from 'react';

// Define the global atOptions interface for TypeScript
declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, unknown>;
    };
  }
}

interface AdsTerraBannerProps {
  adKey: string;
  format?: string;
  height?: number;
  width?: number;
  params?: Record<string, unknown>;
}

const AD_LIB_URL_BASE = 'https://www.highperformanceformat.com/';
const SCRIPT_ID = 'adsterra-script-loader';

export function AdsTerraBanner({
  adKey,
  format = 'iframe',
  height = 90,
  width = 728,
  params = {},
}: AdsTerraBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Do not run any ad logic in test environments
    if (process.env.NODE_ENV === 'test') {
      console.log('[AdsTerra] Test environment detected, skipping ad load.');
      return;
    }

    if (!adContainerRef.current) return;
    console.log(`[AdsTerra] Banner component starting for key: ${adKey}`);

    // Set the global atOptions object
    window.atOptions = { key: adKey, format, height, width, params };
    console.log(`[AdsTerra] window.atOptions set:`, window.atOptions);

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      console.log('[AdsTerra] Main library script not found. Creating and loading it.');
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = `${AD_LIB_URL_BASE}${adKey}/invoke.js`; // Construct URL
      script.async = true;

      script.onload = () => {
        console.log('[AdsTerra] Main library script has loaded.');
        // AdsTerra might render the ad automatically after this script runs
        // There's no explicit function call like AdCash's runBanner
      };
      script.onerror = () => {
        console.error('[AdsTerra] CRITICAL: Failed to load main ad library directly from CDN.');
      };

      document.head.appendChild(script);
    } else {
      console.log('[AdsTerra] Script already exists. Re-setting atOptions.');
      // If script already exists, it might have already rendered,
      // but re-setting atOptions might trigger it again or update.
      // Ad networks vary; this might be sufficient.
    }

    // Cleanup: not strictly necessary for ad scripts that inject content
    // but good practice to clear the global variable if component unmounts
    return () => {
      console.log('[AdsTerra] Cleaning up AdsTerra component.');
      // It's generally not recommended to delete global script tags or variables
      // from third-party scripts as they might be shared or crucial globally.
      // For now, we'll just log.
    };
  }, [adKey, format, height, width, params]); // Re-run effect if key or options change

  return (
    <div
      ref={adContainerRef}
      style={{ minHeight: `${height}px`, width: `${width}px`, border: '1px dashed blue' }}
      data-testid="adsterra-container"
    />
  );
}
