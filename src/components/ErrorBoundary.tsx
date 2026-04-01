import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
    
    // Log to error tracking service in production
    if (!import.meta.env.DEV) {
      // TODO: Send to error tracking service (e.g., Sentry)
      console.error("Production error:", {
        error: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <div className="max-w-md text-center">
            <span className="font-chomsky text-6xl text-foreground block mb-4">
              X
            </span>
            <h1 className="text-2xl font-serif font-medium mb-3 text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              We encountered an unexpected error. This has been logged and we'll
              look into it. Please try refreshing the page.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                Refresh Page
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-secondary transition-colors"
              >
                Go Home
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-6 p-4 bg-destructive/10 text-destructive text-xs text-left rounded-lg overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
