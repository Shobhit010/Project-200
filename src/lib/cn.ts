type ClassValue = string | number | null | undefined | false | ClassValue[];

export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const v of values) {
    if (!v && v !== 0) continue;
    if (Array.isArray(v)) {
      const nested = cn(...v);
      if (nested) out.push(nested);
    } else {
      out.push(String(v));
    }
  }
  return out.join(' ');
}

/** `147` -> `"147"`, `7` -> `"007"` — the archive always pads day numbers. */
export function pad(day: number, width = 3): string {
  return String(day).padStart(width, '0');
}
