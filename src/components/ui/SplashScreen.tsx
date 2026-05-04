"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => setLoaded(true);

    if (document.readyState === "complete") {
      const timeoutId = setTimeout(handleLoad, 100);
      return () => clearTimeout(timeoutId);
    }

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <div
      id="app-loading"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-primary transition-opacity duration-300 ease-out ${loaded ? "pointer-events-none opacity-0" : "opacity-100"} gpu-accelerated`}
    >
      <div className="contain-layout">
        <img
          src="/assets/baba-icon.svg"
          alt="Loading..."
          width={180}
          height={180}
          fetchPriority="high"
          className="w-45 animate-[pulse_1.2s_ease-in-out_infinite]"
          loading="eager"
        />
      </div>
    </div>
  );
}
