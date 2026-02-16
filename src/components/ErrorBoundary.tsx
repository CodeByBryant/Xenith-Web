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
            <h1 className="text-2xl font-serif font-medium mb-3">
              Something went wrong
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              An unexpected error occurred. Please refresh the page to try
              again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
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
