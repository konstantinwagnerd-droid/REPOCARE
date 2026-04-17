"use client";

import React from "react";
import { logger } from "./logger";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message };
  }
  componentDidCatch(err: Error, info: React.ErrorInfo) {
    logger.error("react_error_boundary", { message: err.message, stack: err.stack, componentStack: info.componentStack });
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;
    return (
      <div role="alert" className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-xl font-semibold">Ein Fehler ist aufgetreten.</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Bitte laden Sie die Seite neu. Wenn das Problem weiter besteht, informieren Sie bitte Ihre Pflegedienstleitung.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Seite neu laden
        </button>
      </div>
    );
  }
}
