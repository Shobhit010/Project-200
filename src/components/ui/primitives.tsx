'use client';

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { ACCENTS, type AccentFamily } from '@/data/categories';
import { cn } from '@/lib/cn';
import { useIntersect } from '@/hooks/useIntersect';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

/* ── Mono metadata label ──────────────────────────────────────────────────── */

export function Mono({
  children,
  className,
  style,
  as: Tag = 'span',
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: 'span' | 'div' | 'p' | 'dt' | 'dd' | 'li';
}) {
  return (
    <Tag className={cn('u-mono text-ink-3', className)} style={style}>
      {children}
    </Tag>
  );
}

/* ── The signature day readout: 147 / 200 ─────────────────────────────────── */

export function DayNumber({
  day,
  total = 200,
  className,
  size = 'sm',
}: {
  day: number;
  total?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: 'text-[0.68rem]',
    md: 'text-sm',
    lg: 'text-lg',
  } as const;
  return (
    <span
      className={cn('u-mono u-tnum text-ink-2', sizes[size], className)}
      aria-label={`Day ${day} of ${total}`}
    >
      {day}
      <span className="text-ink-4"> / {total}</span>
    </span>
  );
}

/* ── Accent dot ───────────────────────────────────────────────────────────── */

export function AccentDot({ family, className }: { family: AccentFamily; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full', className)}
      style={{ background: ACCENTS[family].hex, boxShadow: `0 0 10px ${ACCENTS[family].hex}` }}
    />
  );
}

/* ── Buttons ──────────────────────────────────────────────────────────────── */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline' | 'ghost';
  cursorLabel?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'outline', className, children, cursorLabel, ...rest },
  ref,
) {
  const base =
    'u-mono relative inline-flex items-center justify-center gap-2 px-5 py-3 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40';
  const variants = {
    solid: 'bg-ink text-void hover:bg-white',
    outline:
      'border border-hairline text-ink-2 hover:border-hairline-strong hover:text-ink hover:bg-white/[0.03]',
    ghost: 'text-ink-3 hover:text-ink',
  } as const;

  return (
    <button
      ref={ref}
      data-cursor={cursorLabel ? 'label' : 'link'}
      data-cursor-label={cursorLabel}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
});

/** External link styled as a button. Always opens in a new tab, safely. */
export function ExternalButton({
  href,
  children,
  className,
  variant = 'solid',
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'solid' | 'outline';
}) {
  const variants = {
    solid: 'bg-ink text-void hover:bg-white',
    outline: 'border border-hairline text-ink-2 hover:border-hairline-strong hover:text-ink',
  } as const;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="external"
      className={cn(
        'u-mono inline-flex items-center justify-center gap-2 px-5 py-3 transition-colors duration-300',
        variants[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}

/**
 * A link whose destination may not be configured. Rather than inventing a URL,
 * an unconfigured link renders as a disabled control that says so.
 */
export function ConfigurableLink({
  href,
  label,
  hint,
  className,
}: {
  href: string | null;
  label: string;
  hint: string;
  className?: string;
}) {
  if (!href) {
    return (
      <span
        className={cn(
          'u-mono inline-flex cursor-not-allowed flex-col items-start gap-1 border border-dashed border-hairline px-5 py-3 text-ink-4',
          className,
        )}
        title={hint}
      >
        <span>{label}</span>
        <span className="text-[0.58rem] tracking-[0.14em] text-ink-4">NOT CONFIGURED</span>
      </span>
    );
  }
  return (
    <ExternalButton href={href} variant="outline" className={className}>
      {label} <span aria-hidden>↗</span>
    </ExternalButton>
  );
}

/* ── Rules and section headers ────────────────────────────────────────────── */

export function Rule({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-hairline', className)} aria-hidden />;
}

export function SectionMarker({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-baseline gap-4', className)}>
      <Mono className="text-ink-4">{index}</Mono>
      <Rule className="flex-1" />
      <Mono>{label}</Mono>
    </div>
  );
}

/* ── Scroll reveal ────────────────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  className,
  y = 20,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotionSafe();
  const { ref, inView } = useIntersect<HTMLDivElement>();
  const active = inView || reduced;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'none' : `translateY(${y}px)`,
        transition: reduced
          ? 'none'
          : `opacity 900ms var(--ease-out-expo) ${delay}ms, transform 900ms var(--ease-out-expo) ${delay}ms`,
        willChange: active ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
