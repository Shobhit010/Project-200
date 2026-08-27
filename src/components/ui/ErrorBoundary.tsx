'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Rendered instead of the crashed subtree. Canvases fall back to DOM. */
  fallback: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Wraps every canvas / WebGL surface. A machine without WebGL, or a driver that
 * loses its context, gets the static equivalent rather than a blank page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[archive:${this.props.label ?? 'surface'}]`, error, info.componentStack);
    }
  }

  render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
