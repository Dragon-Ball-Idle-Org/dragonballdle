"use client";

import { useEffect } from "react";
import Script from "next/script";

export function EzoicScripts() {
  useEffect(() => {
    // Initialize Ezoic standalone command queue
    if (typeof window !== "undefined") {
      window.ezstandalone = window.ezstandalone || {};
      window.ezstandalone.cmd = window.ezstandalone.cmd || [];
    }
  }, []);

  return (
    <>
      {/* Consent Management Scripts */}
      <Script
        src="https://cmp.gatekeeperconsent.com/min.js"
        data-cfasync="false"
        strategy="worker"
      />
      <Script
        src="https://the.gatekeeperconsent.com/cmp.min.js"
        data-cfasync="false"
        strategy="worker"
      />

      {/* Ezoic Standalone Ad Script */}
      <Script
        src="//www.ezojs.com/ezoic/sa.min.js"
        strategy="afterInteractive"
      />

      {/* Ezoic Analytics */}
      <Script
        src="//ezoicanalytics.com/analytics.js"
        strategy="afterInteractive"
      />
    </>
  );
}
