import { useImageFallback } from "@/hooks/useImageFallback";
import { cn } from "@/utils/cn";
import Image, { type ImageProps } from "next/image";

export function ImageWithFallback(props: ImageProps) {
  const { src, onLoad, onError, isLoading } = useImageFallback({
    src: props.src as string,
    fallbackSrc: "/assets/image-placeholder.svg",
  });

  return (
    <div className="relative contain-paint">
      <Image
        {...props}
        src={src}
        alt={props.alt || ""}
        onLoad={onLoad}
        onError={onError}
        className={cn(isLoading && "animate-pulse", props.className)}
        sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        style={{
          ...props.style,
          contain: 'layout'
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200/20 animate-pulse contain-layout" />
      )}
    </div>
  );
}
