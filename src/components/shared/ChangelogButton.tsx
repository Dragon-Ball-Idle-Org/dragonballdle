"use client";

import { ScrollIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type ChangelogButtonProps = {
  title: string;
  latestVersion: string;
};

export function ChangelogButton({
  title,
  latestVersion,
}: ChangelogButtonProps) {
  const [hasNewUpdate, setHasNewUpdate] = useState(false);

  useEffect(() => {
    const checkUpdate = () => {
      const lastSeen = localStorage.getItem("last-seen-version");
      setHasNewUpdate(lastSeen !== latestVersion);
    };

    checkUpdate();
    window.addEventListener("changelog-seen", checkUpdate);
    return () => window.removeEventListener("changelog-seen", checkUpdate);
  }, [latestVersion]);

  const handleOpen = () => {
    window.dispatchEvent(new CustomEvent("open-changelog"));
  };

  return (
    <button
      onClick={handleOpen}
      aria-label={title}
      title={title}
      className="relative flex items-center justify-center w-14 h-14 font-display text-2xl text-primary bg-black rounded-full border-2 border-primary cursor-pointer transition-transform hover:scale-110 shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_20px_rgba(234,88,12,0.4)]"
    >
      <ScrollIcon weight="fill" size={28} />

      {hasNewUpdate && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border border-black shadow-[0_0_5px_rgba(249,115,22,0.5)]"></span>
        </span>
      )}
    </button>
  );
}
