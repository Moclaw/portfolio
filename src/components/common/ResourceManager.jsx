import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';

const ResourceManager = ({
  category = 'other',
  type = 'image',
  multiple = true,
  onResourceSelect,
  showUpload = true,
  className = ''
}) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedResources, setSelectedResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(type);
  const [filterCategory, setFilterCategory] = useState(category);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newResourceData, setNewResourceData] = useState({
    name: '',
    description: '',
    alt: '',
    tags: '',
    type: type,
    category: category,
    is_public: true
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5303';

  // Resource types and categories
  const RESOURCE_TYPES = [
    { value: 'image', label: 'Image' },
    { value: 'document', label: 'Document' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'other', label: 'Other' }
  ];

  const RESOURCE_CATEGORIES = [
    { value: 'avatar', label: 'Avatar' },
    { value: 'project', label: 'Project' },
    { value: 'technology', label: 'Technology' },
    { value: 'company', label: 'Company' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'document', label: 'Document' },
    { value: 'other', label: 'Other' }
  ];

  // Fetch resources
  const fetchResources = async (page = 1, search = '', type = '', category = '') => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });

      if (search) params.append('search', search);
      if (type) params.append('type', type);
      if (category) params.append('category', category);

      const response = await fetch(`${API_BASE_URL}/api/v1/resources?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }

      const result = await response.json();
      setResources(result.data || []);
      setTotalPages(result.meta?.total_pages || 1);

    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  // Create resource from upload
  const createResource = async (uploadData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/admin/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newResourceData,
        upload_id: uploadData.id
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create resource');
    }

    return await response.json();
  };

  // Handle upload success
  const handleUploadSuccess = async (uploadData, allUploads) => {
    try {
      if (uploadData) {
        const resourceResult = await createResource(uploadData);
        await fetchResources(currentPage, searchQuery, filterType, filterCategory);
        setShowCreateModal(false);
        setNewResourceData({
          name: '',
          description: '',
          alt: '',
          tags: '',
          type: type,
          category: category,
          is_public: true
        });
      }
    } catch (err) {
      console.error('Error creating resource:', err);
      setError(err.message || 'Failed to create resource');
    }
  };

  // Handle resource selection
  const toggleResourceSelection = (resource) => {
    if (!multiple) {
      setSelectedResources([resource]);
      if (onResourceSelect) {
        onResourceSelect([resource]);
      }
      return;
    }

    const isSelected = selectedResources.find(r => r.id === resource.id);
    let newSelection;

    if (isSelected) {
      newSelection = selectedResources.filter(r => r.id !== resource.id);
    } else {
      newSelection = [...selectedResources, resource];
    }

    setSelectedResources(newSelection);
    if (onResourceSelect) {
      onResourceSelect(newSelection);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchResources(1, query, filterType, filterCategory);
  };

  // Handle filter change
  const handleFilterChange = (newType, newCategory) => {
    setFilterType(newType);
    setFilterCategory(newCategory);
    setCurrentPage(1);
    fetchResources(1, searchQuery, newType, newCategory);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Initial load
  useEffect(() => {
    fetchResources(1, '', filterType, filterCategory);
  }, []);

  return (
    <div className={`resource-manager ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Resource Manager
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage and select resources for your content
            </p>
          </div>

          {showUpload && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload Resource
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value, filterCategory)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => handleFilterChange(filterType, e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            {RESOURCE_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Resources Counter */}
      {selectedResources.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {selectedResources.length} resource{selectedResources.length > 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resources Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No resources found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <AnimatePresence>
            {resources.map((resource) => {
              const isSelected = selectedResources.find(r => r.id === resource.id);
              
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleResourceSelection(resource)}
                  className={`
                    relative cursor-pointer group rounded-lg overflow-hidden transition-all duration-200
                    ${isSelected 
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' 
                      : 'hover:shadow-lg'
                    }
                  `}
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                    {resource.type === 'image' ? (
                      <img
                        src={resource.upload.url}
                        alt={resource.alt || resource.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      {isSelected && (
                        <div className="bg-blue-500 text-white rounded-full p-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Resource Type Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800 bg-opacity-75 text-white">
                        {resource.type}
                      </span>
                    </div>
                  </div>

                  {/* Resource Info */}
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate" title={resource.name}>
                      {resource.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(resource.upload.file_size)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentPage(currentPage - 1);
                fetchResources(currentPage - 1, searchQuery, filterType, filterCategory);
              }}
              disabled={currentPage <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Previous
            </button>

            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
              {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => {
                setCurrentPage(currentPage + 1);
                fetchResources(currentPage + 1, searchQuery, filterType, filterCategory);
              }}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Resource Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Upload New Resource
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Resource Form */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newResourceData.name}
                      onChange={(e) => setNewResourceData({ ...newResourceData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter resource name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={newResourceData.alt}
                      onChange={(e) => setNewResourceData({ ...newResourceData, alt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter alt text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newResourceData.description}
                    onChange={(e) => setNewResourceData({ ...newResourceData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter description"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type *
                    </label>
                    <select
                      value={newResourceData.type}
                      onChange={(e) => setNewResourceData({ ...newResourceData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {RESOURCE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={newResourceData.category}
                      onChange={(e) => setNewResourceData({ ...newResourceData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {RESOURCE_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>{category.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newResourceData.is_public}
                        onChange={(e) => setNewResourceData({ ...newResourceData, is_public: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Public
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={newResourceData.tags}
                    onChange={(e) => setNewResourceData({ ...newResourceData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>

              {/* Upload Component */}
              <ImageUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(error) => setError(error.message)}
                multiple={false}
                label="Upload File"
                description="Upload the file for this resource"
                acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']}
                showPreview={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourceManager;
