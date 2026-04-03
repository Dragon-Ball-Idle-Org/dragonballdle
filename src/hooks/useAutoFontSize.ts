import { useEffect, useRef } from "react";
import { fitTextToBox } from "../lib/fitText";

export function useAutoFontSize(minPx = 8, step = 1) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      fitTextToBox(ref.current, minPx, step);
    }
  }, [minPx, step]);

  return ref;
}
