import { useState, useCallback } from "react";

interface UseImageFallbackProps {
  src: string;
  fallbackSrc?: string;
}

export function useImageFallback({
  src,
  fallbackSrc = "/assets/image-placeholder.svg",
}: UseImageFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    setImageSrc(fallbackSrc);
  }, [fallbackSrc]);

  return {
    src: imageSrc,
    onLoad: handleLoad,
    onError: handleError,
    isLoading,
    hasError,
  };
}
