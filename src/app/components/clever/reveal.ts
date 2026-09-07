import type { CSSProperties } from "react";

/** Style pour `.cc-reveal` : délai d'apparition = index × 90 ms (variable `--i` du kit). */
export function reveal(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}
