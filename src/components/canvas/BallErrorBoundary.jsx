import React from 'react';

class BallErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Ball component error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI - simple colored sphere without texture
      return (
        <div className="w-28 h-28 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {this.props.fallbackText || 'Tech'}
            </span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BallErrorBoundary;
