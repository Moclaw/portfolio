import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import FileSelector from './FileSelector';

const FileUpload = ({ 
  onUploadSuccess, 
  onUploadError,
  accept = "image/*,video/*,application/pdf,application/msword,.docx",
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  label = "Choose File",
  description = "Drag and drop files here or click to select",
  className = "",
  disabled = false,
  showPreview = true,
  category = "general",
  existingFiles = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(existingFiles);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showFileSelector, setShowFileSelector] = useState(false);
  const fileInputRef = useRef(null);

  // File type validation
  const validateFile = (file) => {
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`);
    }

    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    const isAllowed = allowedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      if (type.startsWith('.')) {
        return fileExtension === type;
      }
      return file.type === type;
    });

    if (!isAllowed) {
      throw new Error(`File type not supported. Allowed types: ${accept}`);
    }
  };

  // Handle file upload
  const uploadFile = async (file) => {
    try {
      validateFile(file);
      
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      const result = await api.uploadFile(file);
      
      if (result) {
        const newFile = {
          id: result.id,
          name: result.file_name,
          originalName: result.original_name,
          url: result.url,
          type: result.content_type,
          size: result.file_size,
          uploadedAt: result.created_at
        };

        setUploadedFiles(prev => multiple ? [...prev, newFile] : [newFile]);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        
        if (onUploadSuccess) {
          onUploadSuccess(newFile, multiple ? [...uploadedFiles, newFile] : [newFile]);
        }

        // Clear progress after delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 2000);

        return newFile;
      }
    } catch (error) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
      
      if (onUploadError) {
        onUploadError(error);
      }
      throw error;
    }
  };

  // Handle selecting existing files
  const handleExistingFileSelect = (selectedFiles) => {
    if (multiple) {
      // Add to existing uploaded files
      const newFiles = selectedFiles.filter(newFile => 
        !uploadedFiles.some(existing => existing.id === newFile.id)
      );
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      
      if (onUploadSuccess) {
        onUploadSuccess(null, updatedFiles);
      }
    } else {
      // Replace with single selected file
      setUploadedFiles(selectedFiles);
      
      if (onUploadSuccess && selectedFiles.length > 0) {
        onUploadSuccess(selectedFiles[0], selectedFiles);
      }
    }
  };

  // Handle multiple files
  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    setUploading(true);

    try {
      if (multiple) {
        await Promise.all(fileArray.map(uploadFile));
      } else {
        await uploadFile(fileArray[0]);
      }
    } catch (error) {
      // Handle file processing error silently
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled]);

  // File input change
  const handleInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Remove uploaded file
  const removeFile = async (fileId) => {
    try {
      await api.deleteUpload(fileId);
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      
      if (onUploadSuccess) {
        const remaining = uploadedFiles.filter(file => file.id !== fileId);
        onUploadSuccess(null, remaining);
      }
    } catch (error) {
      if (onUploadError) {
        onUploadError(error);
      }
    }
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📋';
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

  return (
    <div className={`file-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300
          ${isDragging 
            ? 'border-blue-400 bg-blue-400/10' 
            : 'border-gray-600 hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700/30'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-4">
          <div className="text-4xl">
            {uploading ? '⏳' : isDragging ? '📂' : '📁'}
          </div>
          
          <div>
            <p className="text-white font-medium">{label}</p>
            <p className="text-gray-400 text-sm mt-1">{description}</p>
            <p className="text-gray-500 text-xs mt-2">
              Max size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>

          {uploading && (
            <div className="text-blue-400 text-sm">
              Uploading...
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) fileInputRef.current?.click();
              }}
              disabled={disabled}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              Upload New
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) setShowFileSelector(true);
              }}
              disabled={disabled}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              Select Existing
            </button>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {Object.entries(uploadProgress).map(([fileName, progress]) => (
          <motion.div
            key={fileName}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-gray-700 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm truncate">{fileName}</span>
              <span className="text-gray-400 text-xs">{progress}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Uploaded Files Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-white font-medium mb-3">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
              >
                <div className="text-2xl">
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={file.url} 
                      alt={file.originalName}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <span>{getFileIcon(file.type)}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {file.originalName}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(file.url, '_blank');
                    }}
                    className="text-blue-400 hover:text-blue-300 p-1"
                    title="View file"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Remove file"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* File Selector Modal */}
      {showFileSelector && (
        <FileSelector
          accept={accept}
          multiple={multiple}
          selectedFiles={uploadedFiles}
          onFileSelect={handleExistingFileSelect}
          onClose={() => setShowFileSelector(false)}
        />
      )}
    </div>
  );
};

export default FileUpload;
