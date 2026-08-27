'use client';

import { useEffect, useState } from 'react';
import { useReducedMotionSafe } from './useReducedMotionSafe';

/** Eases a number from 0 to `target` once `active` flips true. */
export function useCountUp(target: number, active: boolean, duration = 1600): number {
  const reduced = useReducedMotionSafe();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // expo-out — fast commitment, long settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(eased * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration, reduced]);

  return value;
}
