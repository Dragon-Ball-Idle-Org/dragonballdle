'use client';

import { useEffect, useRef } from 'react';

// Define the aclib interface on the window object for type safety
declare global {
  interface Window {
    aclib?: {
      runBanner: (options: { zoneId: string }) => void;
    };
  }
}

interface AdCashBannerProps {
  zoneId: string;
}

const AD_LIB_URL = 'https://acscdn.com/script/aclib.js';
const SCRIPT_ID = 'aclib';

/**
 * Renders an AdCash banner ad with detailed debugging logs and polling.
 */
export function AdCashBanner({ zoneId }: AdCashBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;
    console.log(`[AdCash] Banner component starting for zoneId: ${zoneId}`);

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    const executeAd = () => {
      console.log(
        '[AdCash] Main script loaded. Starting to poll for window.aclib...',
      );
      const maxRetries = 10;
      let retries = 0;

      // Clear any existing interval before starting a new one
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (window.aclib) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          console.log(
            `[AdCash] window.aclib found after ${retries + 1} attempt(s). Injecting runBanner script...`,
          );
          try {
            if (!adContainerRef.current) {
              console.error('[AdCash] Container ref was lost before script injection.');
              return;
            }
            const runScript = document.createElement('script');
            runScript.type = 'text/javascript';
            // This mimics the inline script from the documentation
            runScript.innerHTML = `
              try {
                aclib.runBanner({ zoneId: '${zoneId}' });
                console.log('[AdCash] Injected runBanner script executed successfully.');
              } catch (e) {
                console.error('[AdCash] Error inside injected runBanner script:', e);
              }
            `;
            // Clear container and append the new script to run it
            adContainerRef.current.innerHTML = '';
            adContainerRef.current.appendChild(runScript);

          } catch (e) {
            console.error("[AdCash] Failed to create or inject runBanner script.", e);
          }
        } else if (retries >= maxRetries) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          console.error(
            `[AdCash] Timed out. window.aclib was not found after ${maxRetries} attempts.`,
          );
        } else {
          console.log(
            `[AdCash] Polling for window.aclib... (attempt ${retries + 1}/${maxRetries})`,
          );
          retries++;
        }
      }, 500); // Poll every 500 milliseconds
    };

    if (!script) {
      console.log(
        "[AdCash] Main library script not found. Creating and loading it.",
      );
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = AD_LIB_URL;
      script.async = true;
      script.setAttribute("data-loaded", "false");

      script.onload = () => {
        console.log(
          "[AdCash] Main library script has loaded via onload event.",
        );
        script?.setAttribute("data-loaded", "true");
        executeAd();
      };
      script.onerror = () => {
        console.error(
          "[AdCash] CRITICAL: Failed to load main ad library directly from CDN.",
        );
        script?.setAttribute("data-loaded", "error");
      };

      document.head.appendChild(script);
    } else {
      const status = script.getAttribute("data-loaded");
      console.log(`[AdCash] Script already exists with status: ${status}`);
      if (status === "true") {
        executeAd();
      } else if (status === "false") {
        const onLoad = () => {
          executeAd();
          script?.removeEventListener("load", onLoad);
        };
        script.addEventListener("load", onLoad);
      }
    }

    return () => {
      // Cleanup polling interval when the component unmounts
      if (intervalRef.current) {
        console.log("[AdCash] Cleaning up polling interval on unmount.");
        clearInterval(intervalRef.current);
      }
    };
  }, [zoneId]);

  return (
    <div
      ref={adContainerRef}
      style={{ minHeight: "90px", border: "1px dashed orange" }}
      data-testid="adcash-container"
    />
  );
}
