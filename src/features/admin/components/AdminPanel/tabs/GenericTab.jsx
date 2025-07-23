import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getImagePath } from '../utils/tabConfigs';

const GenericTab = ({ 
  tabId,
  tabName,
  data, 
  isLoading, 
  error, 
  onFetchData, 
  onEdit, 
  onDelete, 
  onItemClick 
}) => {
  const items = data[tabId] || [];

  useEffect(() => {
    if (!items.length && !isLoading[tabId]) {
      onFetchData(tabId);
    }
  }, [items.length, isLoading, tabId, onFetchData]);

  if (isLoading[tabId]) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-2">Error loading {tabName.toLowerCase()}</div>
        <div className="text-secondary text-sm">{error}</div>
        <button
          onClick={() => onFetchData(tabId)}
          className="mt-4 bg-secondary hover:bg-secondary/80 text-white px-6 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-secondary text-lg mb-4">No {tabName.toLowerCase()} found</div>
      </div>
    );
  }

  const renderItemPreview = (item) => {
    switch (tabId) {
      case 'technologies':
        return (
          <div className="flex gap-3">
            {item.icon && (
              <div className="flex-shrink-0">
                <img 
                  src={getImagePath(item.icon, 'tech')} 
                  alt={item.name} 
                  className="w-16 h-16 object-contain rounded-lg bg-white p-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
              <div className="flex gap-2 mb-2">
                {item.category && (
                  <span className="bg-secondary/20 text-secondary px-2 py-1 rounded text-xs capitalize">
                    {item.category.replace('-', ' ')}
                  </span>
                )}
                <span className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-secondary text-sm">Order: {item.order}</p>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="flex gap-3">
            {item.icon && (
              <div className="flex-shrink-0">
                <img 
                  src={getImagePath(item.icon, 'general')} 
                  alt={item.title} 
                  className="w-16 h-16 object-contain rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 p-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              <div className="flex gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="bg-secondary/20 text-secondary px-2 py-1 rounded text-xs">
                  Order: {item.order}
                </span>
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="flex gap-3">
            {item.image && (
              <div className="flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMzNzQxNTEiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIyNCIgcj0iOCIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJNMTYgNTZjMC0xMCA3LTE2IDE2LTE2czE2IDYgMTYgMTYiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+';
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
              <p className="text-secondary font-medium text-sm mb-2">{item.designation} {item.company && `at ${item.company}`}</p>
              <p className="text-secondary text-sm line-clamp-2 mb-2">"{item.testimonial}"</p>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="bg-secondary/20 text-secondary px-2 py-1 rounded text-xs">
                  Order: {item.order}
                </span>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
            <p className="text-secondary text-sm mb-1">{item.email}</p>
            <p className="text-secondary text-sm mb-2">{item.subject}</p>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                item.status === 'read' ? 'bg-blue-500/20 text-blue-400' :
                item.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {item.status}
              </span>
              <span className="text-xs text-secondary">
                {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
              </span>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h3 className="text-white font-semibold text-lg mb-2">
              {item.name || item.title || 'Unknown Item'}
            </h3>
          </div>
        );
    }
  };

  return (
    <div className="grid gap-4">
      {items.map(item => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-lg p-4 cursor-pointer hover:bg-primary/80 transition-colors border border-gray-700 hover:border-secondary/50"
          onClick={() => onItemClick(item)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {renderItemPreview(item)}
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400/10 transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(tabId, item.id);
                }}
                className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GenericTab;
