import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import type { ComponentProps } from "react";

type CustomLinkProps = ComponentProps<typeof Link>;

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
