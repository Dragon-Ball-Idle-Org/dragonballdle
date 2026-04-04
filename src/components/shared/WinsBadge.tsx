"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { PropsWithChildren, Suspense } from "react";

type WinsBadgeProps = PropsWithChildren<{
  count: number;
  isLoading: boolean;
  className?: string;
}>;

export function WinsBadge({
  count,
  isLoading = false,
  className,
}: WinsBadgeProps) {
  return (
    <Suspense
      fallback={
        <span
          className={cn(
            "inline-block py-1 px-2 rounded-full",
            "bg-linear-135 from-green-500 to-green-700",
            "font-ui shadow-wins-badge text-shadow-wins-badge",
            "animate-pulse",
          )}
        >
          ...
        </span>
      }
    >
      {isLoading ? (
        <span
          className={cn(
            "inline-block py-1 px-2 rounded-full",
            "bg-linear-135 from-green-500 to-green-700",
            "font-ui shadow-wins-badge text-shadow-wins-badge",
            "animate-pulse",
          )}
        >
          ...
        </span>
      ) : (
        <motion.span
          className={cn(
            "inline-block py-1 px-2 rounded-full",
            "bg-linear-135 from-green-500 to-green-700",
            "font-ui shadow-wins-badge text-shadow-wins-badge",
            className,
          )}
        >
          {count}
        </motion.span>
      )}
    </Suspense>
  );
}
