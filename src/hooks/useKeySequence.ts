'use client';

import { useEffect, useRef } from 'react';

type Handlers = Record<string, () => void>;

/**
 * Watches a rolling buffer of typed characters for secret sequences.
 * Ignores keystrokes while a field is focused, so typing "day1" into search
 * never teleports anyone.
 */
export function useKeySequence(handlers: Handlers, maxLength = 12): void {
  const bufferRef = useRef('');
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-maxLength);

      for (const [seq, fn] of Object.entries(handlersRef.current)) {
        if (bufferRef.current.endsWith(seq)) {
          bufferRef.current = '';
          fn();
          break;
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [maxLength]);
}
