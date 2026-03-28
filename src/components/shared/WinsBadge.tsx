"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

type WinsBadgeProps = PropsWithChildren<{
  count: number;
  className?: string;
}>;

export function WinsBadge({ count, className }: WinsBadgeProps) {
  return (
    <motion.span
      className={cn(
        "inline-block px-2 rounded-full",
        "bg-linear-135 from-green-500 to-green-700",
        "shadow-wins-badge text-shadow-wins-badge",
        className,
      )}
    >
      {count}
    </motion.span>
  );
}
