import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8 bg-red-100 border border-red-400 dark:bg-red-900/50 dark:border-red-700 rounded-lg">
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-300">Something went wrong.</h2>
          <p className="mt-2 text-red-700 dark:text-red-400">Please refresh the page and try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;