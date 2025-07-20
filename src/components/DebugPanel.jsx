import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const DebugPanel = () => {
  const { portfolioData, loading, error, refreshData } = usePortfolio();

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs z-50 max-w-sm">
      <div className="mb-2 font-bold text-green-400">🐛 Debug Panel</div>
      
      <div className="mb-2">
        <strong>Status:</strong> {loading ? '🔄 Loading...' : '✅ Ready'}
      </div>
      
      {error && (
        <div className="mb-2 text-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="mb-2">
        <strong>Data Source:</strong> {
          portfolioData ? 
            (error ? '📂 Fallback' : '🌐 API') : 
            '❌ None'
        }
      </div>
      
      {portfolioData && (
        <div className="mb-2">
          <strong>Data Count:</strong>
          <div className="ml-2">
            • Services: {portfolioData.services?.length || 0}
            <br />
            • Technologies: {portfolioData.technologies?.length || 0}
            <br />
            • Experiences: {portfolioData.experiences?.length || 0}
            <br />
            • Projects: {portfolioData.projects?.length || 0}
            <br />
            • Testimonials: {portfolioData.testimonials?.length || 0}
          </div>
        </div>
      )}
      
      <button
        onClick={refreshData}
        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Refresh Data'}
      </button>
      
      <div className="mt-2 text-xs text-gray-400">
        Press F12 → Console for detailed logs
      </div>
    </div>
  );
};

export default DebugPanel;
