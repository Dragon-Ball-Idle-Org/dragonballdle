"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, Target } from "framer-motion";
import { cn } from "@/utils/cn";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  className?: string;
};

const motionVariants: Record<
  TooltipPosition,
  { initial: Target; animate: Target }
> = {
  top: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
  bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: 4 }, animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 } },
};

const arrowClasses: Record<TooltipPosition, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-black/80",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-black/80",
  left: "left-full top-1/2 -translate-y-1/2 border-l-black/80",
  right: "right-full top-1/2 -translate-y-1/2 border-r-black/80",
};

export function Tooltip({
  content,
  children,
  position = "bottom",
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const clickedRef = useRef(false);

  const calculateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 8;

  const positions = {
    top: { top: rect.top - gap, left: rect.left + rect.width / 2 },
    bottom: { top: rect.bottom + gap, left: rect.left + rect.width / 2 },
    left: { top: rect.top + rect.height / 2, left: rect.left - gap },
    right: { top: rect.top + rect.height / 2, left: rect.right + gap },
  };

    setCoords(positions[position]);
  };

  const show = () => {
    calculateCoords();
    setVisible(true);
  };
  const hide = () => {
    if (clickedRef.current) return;
    setVisible(false);
  };
  const toggle = () => {
    clickedRef.current = !clickedRef.current;
    if (clickedRef.current) calculateCoords();
    setVisible(clickedRef.current);
  };

  useEffect(() => {
    if (!visible) return;
    window.addEventListener("scroll", calculateCoords, true);
    window.addEventListener("resize", calculateCoords);
    return () => {
      window.removeEventListener("scroll", calculateCoords, true);
      window.removeEventListener("resize", calculateCoords);
    };
  }, [visible]);

  const transform = {
    top: "translateX(-50%) translateY(-100%)",
    bottom: "translateX(-50%) translateY(0%)",
    left: "translateX(-100%) translateY(-50%)",
    right: "translateX(0%) translateY(-50%)",
  }[position];

  return (
    <div
      ref={triggerRef}
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <div onClick={toggle}>{children}</div>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {visible && (
              <motion.div
                initial={motionVariants[position].initial}
                animate={motionVariants[position].animate}
                exit={motionVariants[position].initial}
                transition={{ duration: 0.15, ease: "easeOut" }}
                transformTemplate={(_, generated) =>
                  `${transform} ${generated}`
                }
                style={{
                  position: "fixed",
                  top: coords.top,
                  left: coords.left,
                  zIndex: 9999,
                }}
                className="px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap bg-black/80 text-white pointer-events-none"
              >
                {content}
                <div
                  className={cn(
                    "absolute border-4 border-transparent",
                    arrowClasses[position],
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
