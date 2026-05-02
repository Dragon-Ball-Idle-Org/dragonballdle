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
  testId?: string;
}

const AD_LIB_URL_BASE = 'https://www.highperformanceformat.com/';

export function AdsTerraBanner({
  adKey,
  format = 'iframe',
  height = 90,
  width = 728,
  params = {},
  testId = 'adsterra-container',
}: AdsTerraBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Do not run any ad logic in test environments
    if (process.env.NEXT_PUBLIC_PLAYWRIGHT === 'true') {
      console.log('[AdsTerra] Playwright test environment detected, skipping ad load.');
      return;
    }

    if (!adContainerRef.current) {
      console.error('[AdsTerra] Ad container ref is null.');
      return;
    }

    // Set the options object just before loading the script for this specific ad
    window.atOptions = { key: adKey, format, height, width, params };
    console.log(`[AdsTerra] Set window.atOptions for key ${adKey}:`, window.atOptions);

    // Create a new script element for each ad instance to ensure
    // it runs with the correct, just-set atOptions.
    const script = document.createElement('script');
    script.src = `${AD_LIB_URL_BASE}${adKey}/invoke.js`; // Construct URL
    // script.async = true; // Removed to ensure synchronous loading for each instance

    script.onload = () => {
      console.log(`[AdsTerra] Script for key ${adKey} has loaded.`);
      // AdsTerra might render the ad automatically after this script runs
    };
    script.onerror = () => {
      console.error(`[AdsTerra] CRITICAL: Failed to load script for key ${adKey}.`);
    };

    // Clear the container and append the new script
    adContainerRef.current.innerHTML = ''; // Clear previous content, important for re-renders
    adContainerRef.current.appendChild(script);

    // Cleanup: Remove the script element when the component unmounts
    return () => {
      console.log(`[AdsTerra] Cleaning up script for key ${adKey}.`);
      if (adContainerRef.current && script.parentNode === adContainerRef.current) {
        adContainerRef.current.removeChild(script);
      }
      // Also clear window.atOptions to avoid interference
      if (window.atOptions && window.atOptions.key === adKey) {
        delete window.atOptions;
      }
    };
  }, [adKey, format, height, width, params]); // Re-run effect if key or options change

  return (
    <div
      ref={adContainerRef}
      style={{ minHeight: `${height}px`, width: `${width}px`, border: '1px dashed blue' }}
      data-testid={testId}
    />
  );
}
