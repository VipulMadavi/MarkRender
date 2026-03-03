// ErrorBoundary.jsx — React error boundary for preview crashes (Phase 5)
import React from "react";

/**
 * Class-based error boundary that catches render errors in its children
 * (primarily the <Preview> component) and shows a friendly fallback
 * instead of crashing the entire app to a white screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Caught render error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <div className="error-fallback-inner">
            <span className="error-fallback-icon">⚠️</span>
            <p className="error-fallback-title">
              Something went wrong rendering the preview.
            </p>
            <p className="error-fallback-detail">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button className="btn" onClick={this.handleReset}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
