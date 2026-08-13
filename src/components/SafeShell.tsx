/**
 * SafeShell — universal full-page fallback that renders Header, hero, and
 * Footer even when the inner page fails (chunk load error, runtime exception,
 * 404/500). Prevents the dreaded "blank screen" experience and keeps the
 * site navigable + crawlable.
 *
 * Used by:
 *   - <RouteErrorBoundary> as its `fallback`
 *   - <NotFound> page already uses Header/Footer directly; this is the
 *     emergency net for cases where even NotFound fails to mount.
 */
import { Link } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home, MapPin, MessageCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export interface SafeShellProps {
  /** 404 | 500 | 'error' — controls heading + status meta */
  variant?: 404 | 500 | 'error';
  title?: string;
  message?: string;
  /** Show the "Try Again" button that calls onRetry */
  onRetry?: () => void;
  /** Hide the hero CTA card (e.g., for very narrow contexts). */
  compact?: boolean;
}

const COPY = {
  404: {
    badge: '404',
    title: "We couldn't find that page",
    message: "The page you're looking for doesn't exist or has moved. Use the links below to get back on track.",
  },
  500: {
    badge: '500',
    title: 'Something went wrong on our side',
    message: "We hit an unexpected error. Our team has been notified — please try again or browse our most popular pages.",
  },
  error: {
    badge: '!',
    title: 'This page failed to load',
    message: "It might be a network hiccup or a stale browser cache. Try again, or jump to one of our popular pages.",
  },
} as const;

const SafeShell = ({ variant = 'error', title, message, onRetry, compact = false }: SafeShellProps) => {
  const copy = COPY[variant];
  const heading = title ?? copy.title;
  const body = message ?? copy.message;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header is wrapped in its own boundary so a header crash doesn't blank the page */}
      <SafeBoundary>
        <Header />
      </SafeBoundary>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            {variant === 'error' ? (
              <AlertTriangle className="w-8 h-8 text-primary" aria-hidden="true" />
            ) : (
              <span className="text-3xl font-bold text-primary">{copy.badge}</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">{heading}</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">{body}</p>

          {!compact && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              {onRetry && (
                <Button onClick={onRetry} size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
              )}
              <Button asChild size="lg" variant={onRetry ? 'outline' : 'default'}>
                <Link to="/" aria-label="Go to homepage">
                  <Home className="mr-2 h-4 w-4" /> Homepage
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/tours" aria-label="Browse tours">
                  <MapPin className="mr-2 h-4 w-4" /> Browse Tours
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href="https://wa.me/918837317070" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          )}

          <nav aria-label="Popular pages" className="text-sm">
            <p className="text-muted-foreground mb-2">Popular pages:</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
              <li><Link to="/best-hostel-in-shillong" className="text-primary hover:underline">Best Hostel Shillong</Link></li>
              <li><Link to="/meghalaya-tour-packages" className="text-primary hover:underline">Meghalaya Tours</Link></li>
              <li><Link to="/things-to-do-in-meghalaya" className="text-primary hover:underline">Things to Do</Link></li>
              <li><Link to="/gallery" className="text-primary hover:underline">Gallery</Link></li>
            </ul>
          </nav>
        </div>
      </main>

      <SafeBoundary>
        <Footer />
      </SafeBoundary>
    </div>
  );
};

/** Tiny inline boundary so a Header/Footer crash degrades silently. */
import { Component, ReactNode } from 'react';
class SafeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: Error) { console.warn('[SafeShell] sub-region failed:', e?.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default SafeShell;
