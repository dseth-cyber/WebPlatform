import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI component:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleGoBack = () => {
    window.history.back();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md rounded-2xl border border-red-500/30 bg-theme-surface-elevated p-8 shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mb-4">
              <AlertOctagon className="h-7 w-7 animate-pulse" />
            </div>

            <h2 className="text-lg font-bold text-theme-text mb-2">
              Something went wrong
            </h2>
            <p className="text-xs text-theme-text-muted mb-4 leading-relaxed">
              An unexpected error occurred while rendering this view. Our engineering team has been notified.
            </p>

            {this.state.error && (
              <div className="mb-6 max-h-24 overflow-y-auto rounded-lg bg-black/40 p-2.5 text-left font-mono text-[11px] text-red-400 border border-red-500/10">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="flex items-center gap-1.5 rounded-lg bg-theme-primary px-3.5 py-2 text-xs font-semibold text-black shadow-lg shadow-theme-primary/20 hover:bg-theme-primary-hover transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry
              </button>
              <button
                type="button"
                onClick={this.handleGoBack}
                className="flex items-center gap-1.5 rounded-lg border border-theme-border bg-theme-surface px-3.5 py-2 text-xs font-medium text-theme-text hover:bg-theme-surface-hover transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Go Back
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex items-center gap-1.5 rounded-lg border border-theme-border bg-theme-surface px-3.5 py-2 text-xs font-medium text-theme-text hover:bg-theme-surface-hover transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
