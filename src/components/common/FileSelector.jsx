import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const FileSelector = ({ 
  onFileSelect, 
  onClose, 
  accept = "image/*,video/*,application/pdf,application/msword,.docx",
  multiple = false,
  selectedFiles = []
}) => {
  const [uploads, setUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1
  });
  const [tempSelectedFiles, setTempSelectedFiles] = useState([...selectedFiles]);

  useEffect(() => {
    fetchUploads();
  }, [pagination.page, filter]);

  const fetchUploads = async () => {
    setIsLoading(true);
    try {
      const response = await api.getUploadsWithSummary(pagination.page, pagination.limit);
      
      if (response && response.data && response.data.data) {
        // Handle nested data structure: response.data.data
        setUploads(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination?.total_pages || 1
        }));
      } else if (response && response.data) {
        // Handle direct data structure: response.data
        setUploads(response.data || []);
        setPagination(prev => ({
          ...prev,
          totalPages: response.pagination?.total_pages || 1
        }));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Filter files based on accept types and search term
  const filteredUploads = uploads.filter(upload => {
    // Filter by accept types
    if (accept !== "*/*") {
      const allowedTypes = accept.split(',').map(type => type.trim());
      const isAllowed = allowedTypes.some(type => {
        if (type.includes('*')) {
          return upload.content_type?.startsWith(type.replace('*', ''));
        }
        if (type.startsWith('.')) {
          const fileExt = '.' + upload.original_name?.split('.').pop()?.toLowerCase();
          return fileExt === type;
        }
        return upload.content_type === type;
      });
      if (!isAllowed) return false;
    }

    // Filter by type
    if (filter !== 'all') {
      switch (filter) {
        case 'images':
          if (!upload.content_type?.startsWith('image/')) return false;
          break;
        case 'videos':
          if (!upload.content_type?.startsWith('video/')) return false;
          break;
        case 'documents':
          if (!upload.content_type?.includes('pdf') && 
              !upload.content_type?.includes('word') && 
              !upload.content_type?.includes('document')) return false;
          break;
      }
    }

    // Filter by search term
    if (searchTerm && !upload.original_name?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleFileToggle = (upload) => {
    if (multiple) {
      setTempSelectedFiles(prev => {
        const isSelected = prev.some(f => f.id === upload.id);
        if (isSelected) {
          return prev.filter(f => f.id !== upload.id);
        } else {
          return [...prev, {
            id: upload.id,
            url: upload.url,
            originalName: upload.original_name,
            type: upload.content_type,
            size: upload.file_size
          }];
        }
      });
    } else {
      setTempSelectedFiles([{
        id: upload.id,
        url: upload.url,
        originalName: upload.original_name,
        type: upload.content_type,
        size: upload.file_size
      }]);
    }
  };

  const handleConfirm = () => {
    if (onFileSelect) {
      onFileSelect(tempSelectedFiles);
    }
    onClose();
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return '🖼️';
    if (type?.startsWith('video/')) return '🎥';
    if (type?.startsWith('audio/')) return '🎵';
    if (type?.includes('pdf')) return '📄';
    if (type?.includes('word') || type?.includes('document')) return '📝';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-tertiary rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h3 className="text-white text-xl font-bold">
            Select Files
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-secondary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              {['all', 'images', 'videos', 'documents'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filter === type
                      ? 'bg-secondary text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* File Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(70vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
              <span className="ml-3 text-secondary">Loading files...</span>
            </div>
          ) : filteredUploads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-secondary text-lg">No files found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredUploads.map((upload) => {
                const isSelected = tempSelectedFiles.some(f => f.id === upload.id);
                
                return (
                  <motion.div
                    key={upload.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-secondary bg-secondary/20'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-700'
                    }`}
                    onClick={() => handleFileToggle(upload)}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* File preview */}
                    <div className="aspect-square mb-3 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                      {upload.content_type?.startsWith('image/') ? (
                        <img
                          src={upload.url}
                          alt={upload.original_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="text-4xl">
                          {getFileIcon(upload.content_type)}
                        </div>
                      )}
                      <div className="hidden w-full h-full items-center justify-center text-4xl">
                        {getFileIcon(upload.content_type)}
                      </div>
                    </div>

                    {/* File info */}
                    <div className="text-center">
                      <h4 className="text-white text-sm font-medium truncate mb-1">
                        {upload.original_name}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        {formatFileSize(upload.file_size)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
              >
                ←
              </button>
              <span className="text-white">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-600 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            {tempSelectedFiles.length} file{tempSelectedFiles.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={tempSelectedFiles.length === 0}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Select {tempSelectedFiles.length > 0 && `(${tempSelectedFiles.length})`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FileSelector;
