"use client";

import { useState, useEffect } from "react";
import { AdsTerraBanner } from "./AdsTerraBanner";

interface ResponsiveAdsTerraBannerFooterProps {
  testId?: string;
}

export function ResponsiveAdsTerraBannerHorizontal({ testId }: ResponsiveAdsTerraBannerFooterProps) {
  const [currentAdConfig, setCurrentAdConfig] = useState({
    width: 728,
    height: 90,
    adKey: "824bce06404cf683d53e7ac1dcc2a191", // Default to desktop size and its adKey
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) { // Small mobile
        setCurrentAdConfig({ width: 320, height: 50, adKey: 'fd6cd6a282c5c1d7d949d7d00e6c9f8c' });
      } else if (window.innerWidth < 768) { // Larger mobile/tablet
        setCurrentAdConfig({ width: 468, height: 60, adKey: '4147594a952ec4a6b8d72da641e52cc5' });
      } else { // Desktop or larger
        setCurrentAdConfig({ width: 728, height: 90, adKey: "824bce06404cf683d53e7ac1dcc2a191" });
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); 

  return (
    <AdsTerraBanner
      adKey={currentAdConfig.adKey}
      width={currentAdConfig.width}
      height={currentAdConfig.height}
      testId={testId}
    />
  );
}

