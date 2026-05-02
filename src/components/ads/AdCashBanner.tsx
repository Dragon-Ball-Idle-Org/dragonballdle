'use client';

import { useEffect, useRef } from 'react';

interface AdCashBannerProps {
  zoneId: string;
}

const AD_LIB_URL = 'https://acscdn.com/script/aclib.js';
const SCRIPT_ID = 'aclib-script-loader';

export function AdCashBanner({ zoneId }: AdCashBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    const container = adContainerRef.current;
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    const executeAd = () => {
      if (window.aclib && container) {
        try {
          const runBannerScript = document.createElement('script');
          runBannerScript.type = 'text/javascript';
          runBannerScript.innerHTML = `aclib.runBanner({ zoneId: '${zoneId}' });`;

          container.innerHTML = ''; // Clear previous ad attempts
          container.appendChild(runBannerScript);
        } catch (e) {
          console.error('AdCash: Failed to execute runBanner.', e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = `/api/ad-proxy?src=${encodeURIComponent(AD_LIB_URL)}`;
      script.async = true;
      script.setAttribute('data-loaded', 'false');

      script.onload = () => {
        script?.setAttribute('data-loaded', 'true');
        executeAd();
      };
      script.onerror = () => {
        console.error('AdCash: Failed to load main ad library.');
        script?.setAttribute('data-loaded', 'error');
      };

      document.head.appendChild(script);
    } else {
      const status = script.getAttribute('data-loaded');
      if (status === 'true') {
        executeAd();
      } else if (status === 'false') {
        script.addEventListener('load', executeAd);
      }
    }

    return () => {
      script?.removeEventListener('load', executeAd);
    };
  }, [zoneId]);

  return <div ref={adContainerRef} style={{ minHeight: '90px' }} />;
}
