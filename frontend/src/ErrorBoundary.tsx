import React from 'react';

export class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    // Write to a file or local storage so we can read it
    if (typeof window !== 'undefined') {
      fetch('/log-error', { method: 'POST', body: error.stack });
    }
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', padding: '20px', background: 'black' }}>
        <h1>Something went wrong.</h1>
        <pre>{this.state.error?.toString()}</pre>
        <pre>{this.state.error?.stack}</pre>
      </div>;
    }

    return this.props.children; 
  }
}
