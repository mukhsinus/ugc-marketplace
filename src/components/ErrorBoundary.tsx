// src/components/ErrorBoundary.tsx
import React, { ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error("Error caught by boundary:", error);
    console.error("Error info:", errorInfo);

    // Update state with error info
    this.setState({
      errorInfo: errorInfo.componentStack
    });

    // You can also log to external error tracking service here
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  handleReload = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/5 via-background to-background p-4">
          {/* Background orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-md w-full">
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-destructive/20 rounded-full blur-lg" />
                  <AlertCircle className="w-16 h-16 text-destructive relative" />
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">
                  Something Went Wrong
                </h1>
                <p className="text-lg text-muted-foreground">
                  We encountered an unexpected error
                </p>
              </div>

              {/* Error message (if available and in development) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 max-h-48 overflow-auto">
                  <p className="text-sm font-mono text-muted-foreground break-words text-left">
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-muted-foreground mt-3 text-left whitespace-pre-wrap">
                      {this.state.errorInfo}
                    </pre>
                  )}
                </div>
              )}

              {/* Message */}
              <p className="text-sm text-muted-foreground">
                Please try reloading the page. If the problem persists, contact support.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={this.handleReset}
                  className="w-full gap-2"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>

                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Reload Page
                </Button>

                <Button
                  onClick={() => window.location.href = "/"}
                  variant="ghost"
                  className="w-full"
                  size="lg"
                >
                  Go to Home
                </Button>
              </div>

              {/* Support info */}
              <p className="text-xs text-muted-foreground">
                Need help? Contact support@ugc-marketplace.com
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
