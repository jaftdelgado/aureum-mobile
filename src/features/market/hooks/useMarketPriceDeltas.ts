import { useEffect, useMemo, useRef, useState } from "react";
import type { MarketSnapshot } from "@domain/entities/MarketSnapshot";

export type PriceDirection = "up" | "down" | "flat";

export type PriceDeltaMap = Record<
  string,
  { direction: PriceDirection; prev?: number; current?: number }
>;

export function useMarketPriceDeltas(
  snapshot: MarketSnapshot | null,
  keySelector: (a: { id: any; symbol?: string }) => string = (a) => String(a.id)
) {
  const prevMapRef = useRef<Record<string, number>>({});
  const [deltaMap, setDeltaMap] = useState<PriceDeltaMap>({});

  useEffect(() => {
    if (!snapshot) return;

    const nextPrev = { ...prevMapRef.current };
    const nextDelta: PriceDeltaMap = { ...deltaMap };

    for (const a of snapshot.assets) {
      const key = keySelector(a as any);
      if (!key) continue;

      const prev = prevMapRef.current[key];
      const current = a.price;

      let direction: PriceDirection = "flat";
      if (typeof prev === "number") {
        if (current > prev) direction = "up";
        else if (current < prev) direction = "down";
      }

      nextDelta[key] = { direction, prev, current };
      nextPrev[key] = current;
    }

    prevMapRef.current = nextPrev;
    setDeltaMap(nextDelta);

  }, [snapshot?.timestamp?.getTime()]);

  return deltaMap;
}
