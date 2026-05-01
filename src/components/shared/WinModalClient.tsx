"use client";

import dynamic from "next/dynamic";
import type { WinModalProps } from "./WinModal";

const WinModal = dynamic(
  () => import("./WinModal").then((mod) => mod.WinModal),
  { ssr: false },
);

export function WinModalClient(props: WinModalProps) {
  return <WinModal {...props} />;
}
