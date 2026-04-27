import { useImageFallback } from "@/hooks/useImageFallback";
import { cn } from "@/utils/cn";
import { type ImageProps } from "next/image";

export function ImageWithFallback(props: ImageProps) {
  const { src, onLoad, onError, isLoading } = useImageFallback({
    src: props.src as string,
    fallbackSrc: "/assets/image-placeholder.svg",
  });

  return (
    <Image
      {...props}
      src={src}
      alt={props.alt || ""}
      onLoad={onLoad}
      onError={onError}
      className={cn(isLoading && "animate-pulse", props.className)}
    />
  );
}
