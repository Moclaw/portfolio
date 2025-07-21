import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({
  onUploadSuccess,
  onUploadError,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  multiple = false,
  className = '',
  label = 'Upload Images',
  description = 'Drag and drop images here, or click to select files',
  showPreview = true,
  disabled = false,
  existingImages = []
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(existingImages || []);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5303';

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [disabled]);

  // Validate file
  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Supported types: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxSize) {
      return `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size (${(maxSize / (1024 * 1024)).toFixed(2)}MB)`;
    }
    
    return null;
  };

  // Handle file selection
  const handleFiles = async (files) => {
    setError('');
    
    if (!multiple && files.length > 1) {
      setError('Only one file can be uploaded at a time');
      return;
    }

    const validFiles = [];
    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    await uploadFiles(validFiles);
  };

  // Upload files to server
  const uploadFiles = async (files) => {
    setUploading(true);
    setProgress(0);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/api/v1/uploads`, {
          method: 'POST',
          body: formData,
          // Add progress tracking if needed
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(progress);
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        return result.data;
      });

      const uploadResults = await Promise.all(uploadPromises);
      
      const newUploadedFiles = multiple 
        ? [...uploadedFiles, ...uploadResults]
        : uploadResults;

      setUploadedFiles(newUploadedFiles);
      
      if (onUploadSuccess) {
        onUploadSuccess(multiple ? uploadResults : uploadResults[0], newUploadedFiles);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed');
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // Handle file input change
  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  // Remove uploaded file
  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    if (onUploadSuccess) {
      onUploadSuccess(null, newFiles);
    }
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
    <div className={`image-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || uploading}
        />

        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="flex justify-center">
            {uploading ? (
              <div className="relative">
                <svg className="animate-spin h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">{progress}%</span>
                </div>
              </div>
            ) : (
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
          </div>

          {/* Upload Text */}
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {uploading ? 'Uploading...' : label}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {uploading ? `Progress: ${progress}%` : description}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Max size: {formatFileSize(maxSize)} | Formats: {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Section */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <AnimatePresence>
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={file.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={file.url || file.public_url}
                      alt={file.original_name || file.alt || 'Uploaded image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png'; // Add a placeholder image
                      }}
                    />
                    
                    {/* Remove button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  {/* File info */}
                  <div className="mt-2 text-xs">
                    <p className="text-gray-900 dark:text-gray-100 truncate" title={file.original_name}>
                      {file.original_name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.file_size)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
