'use client';

import React, { useEffect, useState } from 'react';

interface AdBannerProps {
  zoneId: string;
  containerId: string;
  width: number;
  height: number;
}

const AdBanner: React.FC<AdBannerProps> = ({ zoneId, containerId, width, height }) => {
  const [adHtml, setAdHtml] = useState('');

  useEffect(() => {
    const fetchAdHtml = async () => {
      try {
        const adScriptSrc = `https://aclib.com/aclib.js?zoneid=${zoneId}`;
        const response = await fetch(`/api/ad-proxy?src=${encodeURIComponent(adScriptSrc)}`);
        if (response.ok) {
          const html = await response.text();
          setAdHtml(html);
        } else {
          console.error('Failed to fetch ad HTML from proxy.');
        }
      } catch (error) {
        console.error('Error fetching ad HTML:', error);
      }
    };

    fetchAdHtml();
  }, [zoneId]);

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-gray-800/50 dark:bg-gray-900/50 rounded-lg">
      <div className="text-xs text-gray-400 mb-1">Advertisement</div>
      <div
        id={containerId}
        className="flex items-center justify-center bg-orange-400/20 rounded-lg shadow-inner"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {adHtml && (
          <iframe
            srcDoc={adHtml}
            width={width}
            height={height}
            sandbox="allow-scripts allow-same-origin"
            scrolling="no"
            frameBorder="0"
            title="Ad"
          />
        )}
      </div>
       <div className="text-xs text-gray-400 mt-1">Zone: {zoneId}</div>
    </div>
  );
};

export default AdBanner;
