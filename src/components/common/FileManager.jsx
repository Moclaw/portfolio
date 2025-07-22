import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import FileUpload from './FileUpload';

const FileManager = ({ 
  onFileSelect, 
  onFileDeleted,
  multiple = false, 
  fileTypes = [], 
  category = '',
  showUpload = true,
  className = "" 
}) => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Fetch files from API
  const fetchFiles = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const result = await api.getUploads(page, 12);
      if (result) {
        // Handle the new response structure with pagination
        if (result.pagination) {
          setFiles(result.data || []);
          setTotalPages(result.pagination.total_pages || 1);
        } else {
          // Fallback for direct array response
          setFiles(Array.isArray(result) ? result : result.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentPage, searchTerm);
  }, [currentPage, searchTerm, filterType]);

  // Handle file deletion
  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }

    setDeletingFileId(fileId);
    try {
      await api.deleteUpload(fileId);
      // Remove the deleted file from the local state
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      // Remove from selected files if it was selected
      setSelectedFiles(prevSelected => prevSelected.filter(file => file.id !== fileId));
      // Notify parent component about the deletion
      if (onFileDeleted) {
        onFileDeleted(fileId);
      }
      // Refresh the files to get updated pagination
      await fetchFiles(currentPage, searchTerm);
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    } finally {
      setDeletingFileId(null);
    }
  };

  // Handle bulk file deletion
  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to delete.');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedFiles.length} file(s)? This action cannot be undone.`;
    if (!confirm(confirmMessage)) {
      return;
    }

    setBulkDeleting(true);
    const deletedFileIds = [];
    
    try {
      // Delete files one by one
      for (const file of selectedFiles) {
        try {
          await api.deleteUpload(file.id);
          deletedFileIds.push(file.id);
        } catch (error) {
          console.error(`Error deleting file ${file.original_name}:`, error);
        }
      }

      // Remove deleted files from local state
      setFiles(prevFiles => prevFiles.filter(file => !deletedFileIds.includes(file.id)));
      // Clear selection
      setSelectedFiles([]);
      
      // Notify parent component about deletions
      if (onFileDeleted) {
        deletedFileIds.forEach(fileId => onFileDeleted(fileId));
      }

      // Show result message
      if (deletedFileIds.length === selectedFiles.length) {
        alert(`Successfully deleted ${deletedFileIds.length} file(s).`);
      } else {
        alert(`Deleted ${deletedFileIds.length} out of ${selectedFiles.length} file(s). Some files could not be deleted.`);
      }

      // Refresh the files to get updated pagination
      await fetchFiles(currentPage, searchTerm);
    } catch (error) {
      console.error('Error during bulk deletion:', error);
      alert('An error occurred during bulk deletion. Please try again.');
    } finally {
      setBulkDeleting(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (multiple) {
      setSelectedFiles(prev => {
        const isSelected = prev.some(f => f.id === file.id);
        let newSelection;
        
        if (isSelected) {
          newSelection = prev.filter(f => f.id !== file.id);
        } else {
          newSelection = [...prev, file];
        }
        
        if (onFileSelect) {
          onFileSelect(newSelection);
        }
        return newSelection;
      });
    } else {
      setSelectedFiles([file]);
      if (onFileSelect) {
        onFileSelect([file]);
      }
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      // Deselect all
      setSelectedFiles([]);
      if (onFileSelect) {
        onFileSelect([]);
      }
    } else {
      // Select all filtered files
      setSelectedFiles(filteredFiles);
      if (onFileSelect) {
        onFileSelect(filteredFiles);
      }
    }
  };

  // Handle upload success
  const handleUploadSuccess = (file, allFiles) => {
    // Refresh the file list
    fetchFiles(currentPage, searchTerm);
    if (file && onFileSelect) {
      if (multiple) {
        setSelectedFiles(prev => [...prev, file]);
        onFileSelect([...selectedFiles, file]);
      } else {
        setSelectedFiles([file]);
        onFileSelect([file]);
      }
    }
  };

  // Get file icon
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📎';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter files based on type
  const filteredFiles = files.filter(file => {
    const matchesSearch = !searchTerm || 
      file.original_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.file_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || 
      (filterType === 'images' && file.content_type?.startsWith('image/')) ||
      (filterType === 'videos' && file.content_type?.startsWith('video/')) ||
      (filterType === 'documents' && !file.content_type?.startsWith('image/') && !file.content_type?.startsWith('video/'));

    return matchesSearch && matchesType;
  });

  return (
    <div className={`file-manager ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-xl font-semibold">File Manager</h3>
        <div className="flex items-center gap-3">
          {showUpload && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload Files
            </button>
          )}
          
          {selectedFiles.length > 0 && (
            <>
              <div className="text-blue-400 text-sm">
                {selectedFiles.length} selected
              </div>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {bulkDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                {bulkDeleting ? 'Deleting...' : 'Delete Selected'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Files</option>
          <option value="images">Images</option>
          <option value="videos">Videos</option>
          <option value="documents">Documents</option>
        </select>

        {multiple && filteredFiles.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={selectedFiles.length === filteredFiles.length 
                  ? "M6 18L18 6M6 6l12 12" // X icon for deselect all
                  : "M9 12l2 2 4-4" // Check icon for select all
                } 
              />
            </svg>
            {selectedFiles.length === filteredFiles.length ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>

      {/* File Grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-400">Loading files...</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No files found</div>
            {showUpload && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Upload your first file
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => {
              const isSelected = selectedFiles.some(f => f.id === file.id);
              
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`
                    relative bg-gray-700 rounded-lg p-3 cursor-pointer transition-all duration-200 group
                    hover:bg-gray-600 hover:scale-105
                    ${isSelected ? 'ring-2 ring-blue-500 bg-blue-600/20' : ''}
                  `}
                  onClick={() => handleFileSelect(file)}
                >
                  {/* Action buttons */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id);
                      }}
                      disabled={deletingFileId === file.id}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Delete file"
                    >
                      {deletingFileId === file.id ? (
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Selection indicator */}
                  {multiple && (
                    <div className={`
                      absolute top-2 right-2 w-5 h-5 rounded-full border-2 
                      ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}
                      flex items-center justify-center
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}

                  {/* File preview */}
                  <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-600 flex items-center justify-center">
                    {file.content_type?.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.original_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-3xl">
                        {getFileIcon(file.content_type)}
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <div className="space-y-1">
                    <p className="text-white text-sm font-medium truncate" title={file.original_name}>
                      {file.original_name || file.file_name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatFileSize(file.file_size)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-white bg-gray-600 rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="text-gray-400 px-4">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-white bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl font-semibold">Upload Files</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <FileUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(error) => console.error('Upload error:', error)}
                multiple={true}
                category={category}
              />

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileManager;
