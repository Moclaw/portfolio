import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FileUpload from './common/FileUpload';
import FileManager from './common/FileManager';

const UploadManager = () => {
  const [activeView, setActiveView] = useState('browse'); // 'browse' or 'upload'
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    totalSizeFormatted: '0 B',
    images: 0,
    videos: 0,
    documents: 0,
    others: 0
  });
  const [recentUploads, setRecentUploads] = useState([]);

  const { user } = useAuth();

  // Fetch upload statistics
  const fetchStats = async () => {
    try {
      const response = await api.getUploadsWithSummary(1, 1); // Get first page with minimal data for summary
      
      if (response && response.summary) {
        const summary = response.summary;
        setStats({
          totalFiles: summary.total_files,
          totalSize: summary.total_size,
          totalSizeFormatted: summary.total_size_formatted,
          images: summary.images,
          videos: summary.videos,
          documents: summary.documents,
          others: summary.others
        });
      } else if (response && response.data && response.data.summary) {
        // Handle nested response structure
        const summary = response.data.summary;
        setStats({
          totalFiles: summary.total_files,
          totalSize: summary.total_size,
          totalSizeFormatted: summary.total_size_formatted,
          images: summary.images,
          videos: summary.videos,
          documents: summary.documents,
          others: summary.others
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep existing stats on error
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadSuccess = (file, allFiles) => {
    // Refresh stats after successful upload
    fetchStats();
    setRecentUploads(prev => [file, ...prev.slice(0, 4)]);
  };

  const handleFileDeleted = (fileId) => {
    // Refresh stats after file deletion
    fetchStats();
  };

  return (
    <div className="upload-manager">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">File Manager</h2>
          <p className="text-gray-400 mt-1">Manage your uploaded files and resources</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setActiveView('browse')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'browse'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Browse Files
          </button>
          
          <button
            onClick={() => setActiveView('upload')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Upload Files
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Files</p>
              <p className="text-2xl font-bold">{stats.totalFiles}</p>
            </div>
            <div className="text-3xl opacity-80">📁</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Size</p>
              <p className="text-2xl font-bold">{stats.totalSizeFormatted}</p>
            </div>
            <div className="text-3xl opacity-80">💾</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Images</p>
              <p className="text-2xl font-bold">{stats.images}</p>
            </div>
            <div className="text-3xl opacity-80">🖼️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Documents</p>
              <p className="text-2xl font-bold">{stats.documents}</p>
            </div>
            <div className="text-3xl opacity-80">📄</div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Videos</p>
              <p className="text-2xl font-bold">{stats.videos}</p>
            </div>
            <div className="text-3xl opacity-80">🎥</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Others</p>
              <p className="text-2xl font-bold">{stats.others}</p>
            </div>
            <div className="text-3xl opacity-80">📁</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 rounded-xl p-6">
        <AnimatePresence mode="wait">
          {activeView === 'browse' ? (
            <motion.div
              key="browse"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FileManager
                onFileSelect={(files) => console.log('Selected files:', files)}
                onFileDeleted={handleFileDeleted}
                multiple={true}
                showUpload={false}
              />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Upload New Files</h3>
                  
                  <FileUpload
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={(error) => {
                      console.error('Upload error:', error);
                      alert('Upload failed: ' + error.message);
                    }}
                    multiple={true}
                    maxSize={50 * 1024 * 1024} // 50MB
                    accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
                    label="Manage Files"
                    description="Upload new files, select from existing files, or drag and drop files here. Supports images, videos, and documents up to 50MB each."
                    showPreview={true}
                    className="bg-gray-700 border-2 border-dashed border-gray-600"
                  />
                </div>

                {/* Recent Uploads */}
                {recentUploads.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Recent Uploads</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recentUploads.map((file) => (
                        <div key={file.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {file.type.startsWith('image/') ? '🖼️' : 
                               file.type.startsWith('video/') ? '🎥' : '📄'}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {file.originalName}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadManager;
