/**
 * RouteErrorBoundary — wraps every route in App.tsx so a crashing page
 * never produces a blank screen. Falls back to <SafeShell> with header,
 * hero message, and footer intact.
 *
 * Distinct from the global <ErrorBoundary> (which is a last-resort,
 * branding-free fallback). This one keeps the site navigable.
 */
import { Component, ReactNode } from 'react';
import SafeShell from './SafeShell';

interface State { hasError: boolean; error: Error | null; retries: number; }
interface Props { children: ReactNode; routeKey?: string; }

const MAX_RETRIES = 2;

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, retries: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Forward to GA4/dataLayer for visibility
    try {
      (window as any).dataLayer?.push({
        event: 'route_error',
        route: window.location.pathname,
        error_message: error.message?.slice(0, 200),
        retry_count: this.state.retries,
      });
    } catch {/* noop */}
    console.error('[RouteErrorBoundary]', this.props.routeKey, error.message);

    // Auto-retry chunk-load / network errors once
    const transient = /chunk|dynamically imported|Failed to fetch|NetworkError|Load failed/i.test(error.message);
    if (transient && this.state.retries < MAX_RETRIES) {
      setTimeout(() => this.setState(s => ({ hasError: false, error: null, retries: s.retries + 1 })),
        500 * Math.pow(2, this.state.retries));
    }
  }

  componentDidUpdate(prev: Props) {
    // Reset on route change so a stale error doesn't persist after the user navigates.
    if (prev.routeKey !== this.props.routeKey && this.state.hasError) {
      this.setState({ hasError: false, error: null, retries: 0 });
    }
  }

  handleRetry = () => this.setState({ hasError: false, error: null, retries: 0 });

  render() {
    if (this.state.hasError) {
      return (
        <SafeShell
          variant="error"
          title="This page failed to load"
          message={this.state.error?.message?.slice(0, 160) || 'An unexpected error occurred.'}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}

export default RouteErrorBoundary;
