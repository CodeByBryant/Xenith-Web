import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Home, RefreshCw } from "lucide-react";

export function RouteError() {
  const error = useRouteError();
  
  let title = "Unexpected Error";
  let message = "An unexpected error occurred.";
  let statusCode: number | null = null;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    
    switch (error.status) {
      case 404:
        title = "Page Not Found";
        message = "The page you're looking for doesn't exist.";
        break;
      case 401:
        title = "Unauthorized";
        message = "You need to sign in to access this page.";
        break;
      case 403:
        title = "Forbidden";
        message = "You don't have permission to access this page.";
        break;
      case 500:
        title = "Server Error";
        message = "Something went wrong on our end. Please try again.";
        break;
      default:
        title = `Error ${error.status}`;
        message = error.statusText || "An error occurred.";
    }
  } else if (error instanceof Error) {
    title = "Application Error";
    message = import.meta.env.DEV 
      ? error.message 
      : "Something went wrong. Please try again.";
  }

  console.error("Route error:", error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <span className="font-chomsky text-6xl text-foreground/40 block mb-4">
          X
        </span>
        
        {statusCode && (
          <div className="text-5xl font-bold text-foreground/20 mb-2">
            {statusCode}
          </div>
        )}
        
        <h1 className="text-2xl font-serif font-medium mb-3 text-foreground">
          {title}
        </h1>
        
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground text-sm font-medium rounded-xl hover:bg-secondary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
        
        {import.meta.env.DEV && error instanceof Error && (
          <details className="mt-8 text-left">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground mb-2">
              Error Details (Dev Mode)
            </summary>
            <pre className="p-4 bg-destructive/10 text-destructive text-xs rounded-lg overflow-auto max-h-60 text-left">
              {error.stack || error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
