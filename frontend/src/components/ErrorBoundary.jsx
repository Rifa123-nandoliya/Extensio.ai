import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("UI error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-zinc-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              An unexpected error occurred. You can try again or return to the
              dashboard.
            </p>
            {import.meta.env.DEV && this.state.error?.message && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-left text-xs text-red-700">
                {this.state.error.message}
              </p>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Try again
              </button>
              <Link
                to="/dashboard"
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
