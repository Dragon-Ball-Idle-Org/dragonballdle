"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChangelogModal = dynamic(
  () => import("./ChangelogModal").then((mod) => mod.ChangelogModal),
  { ssr: false },
);

type ChangelogVersion = {
  id: string;
  date: string;
  title: string;
  items: string[];
};

type ChangelogTriggerProps = {
  latestVersion: string;
  title: string;
  versions: ChangelogVersion[];
};

export function ChangelogTrigger({
  latestVersion,
  title,
  versions,
}: ChangelogTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem("last-seen-version");
    if (lastSeen !== latestVersion) {
      setIsOpen(true);
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-changelog", handleOpen);

    return () => window.removeEventListener("open-changelog", handleOpen);
  }, [latestVersion]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("last-seen-version", latestVersion);
    window.dispatchEvent(new CustomEvent("changelog-seen"));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ChangelogModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      versions={versions}
    />
  );
}
