import { cn } from "@/src/utils/cn";
import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";

type CustomLinkProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export function TextLink(props: CustomLinkProps) {
  return (
    <Link
      className={cn(
        "font-semibold transition-colors hover:text-primary",
        props.className,
      )}
      {...props}
    />
  );
}

export function IconLink(props: CustomLinkProps) {
  return (
    <Link
      className={cn("transition-transform hover:scale-110", props.className)}
      {...props}
    />
  );
}
