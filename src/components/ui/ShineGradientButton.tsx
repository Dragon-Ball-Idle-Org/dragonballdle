"use client";

import { cn } from "@/utils/cn";
import { PropsWithChildren, useState } from "react";

type ShineGradientButtonProps = PropsWithChildren<{
  className?: string;
  contentClassName?: string;
  shineColor?: string;
  onClick?: () => void;
}>;

export function ShineGradientButton({
  children,
  className,
  contentClassName,
  shineColor = "rgba(74, 222, 128, 0.4)",
  onClick,
}: ShineGradientButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 50, y: 50 });
  };

  return (
    <button
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl",
        "cursor-default",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <span className={cn("relative z-10", contentClassName)}>{children}</span>
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(400px at ${mousePosition.x}% ${mousePosition.y}%, ${shineColor} 0%, transparent 70%)`,
            mixBlendMode: "screen",
            transition: "background 0.05s ease-out",
          }}
        />
      )}
    </button>
  );
}
