"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { PropsWithChildren, Suspense, useEffect, useState } from "react";

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
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [count]);

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
          animate={animate ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
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
