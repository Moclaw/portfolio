import React, { useState } from 'react';
import { ImageUpload, ResourceManager } from '../components';

const ResourceDemo = () => {
  const [selectedResources, setSelectedResources] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUploadSuccess = (file, allFiles) => {
    console.log('Upload successful:', file);
    setUploadedFiles(allFiles);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  const handleResourceSelect = (resources) => {
    console.log('Selected resources:', resources);
    setSelectedResources(resources);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Resource Management Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Demonstration of the ImageUpload and ResourceManager components with integrated API calls.
        </p>
      </div>

      {/* ImageUpload Demo */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Image Upload Component
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Single Image Upload
            </h3>
            <ImageUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              multiple={false}
              label="Upload Single Image"
              description="Drag and drop an image here, or click to select"
              className="mb-4"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Multiple Images Upload
            </h3>
            <ImageUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              multiple={true}
              label="Upload Multiple Images"
              description="Drag and drop images here, or click to select multiple files"
              maxSize={5 * 1024 * 1024} // 5MB limit
              className="mb-4"
            />
          </div>
        </div>

        {/* Upload Results */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h4 className="text-md font-medium text-green-800 dark:text-green-200 mb-2">
              Upload Results ({uploadedFiles.length} files)
            </h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="text-sm text-green-700 dark:text-green-300">
                  <span className="font-medium">{file.original_name}</span>
                  <span className="text-green-600 dark:text-green-400 ml-2">
                    ({(file.file_size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ResourceManager Demo */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Resource Manager Component
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Configuration Examples
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Project Images
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Filter for project-related images only
                </p>
                <ResourceManager
                  category="project"
                  type="image"
                  multiple={true}
                  onResourceSelect={handleResourceSelect}
                  showUpload={true}
                  className="h-64"
                />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Company Logos
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Single selection for company logos
                </p>
                <ResourceManager
                  category="company"
                  type="image"
                  multiple={false}
                  onResourceSelect={handleResourceSelect}
                  showUpload={true}
                  className="h-64"
                />
              </div>
            </div>
          </div>

          {/* Main Resource Manager */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Full Resource Manager
            </h3>
            <ResourceManager
              category=""
              type=""
              multiple={true}
              onResourceSelect={handleResourceSelect}
              showUpload={true}
              className="min-h-[600px]"
            />
          </div>
        </div>

        {/* Selection Results */}
        {selectedResources.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-md font-medium text-blue-800 dark:text-blue-200 mb-2">
              Selected Resources ({selectedResources.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedResources.map((resource) => (
                <div key={resource.id} className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                  {resource.type === 'image' && (
                    <img
                      src={resource.upload.url}
                      alt={resource.alt || resource.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {resource.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {resource.type} • {resource.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* API Integration Info */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          API Integration Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Upload Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>✅ Drag & Drop file upload</li>
              <li>✅ Multiple file support</li>
              <li>✅ File type validation</li>
              <li>✅ File size limits</li>
              <li>✅ Progress tracking</li>
              <li>✅ Error handling</li>
              <li>✅ Preview functionality</li>
              <li>✅ Integration with LocalStack S3</li>
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Resource Management
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>✅ Resource browsing with pagination</li>
              <li>✅ Search functionality</li>
              <li>✅ Type and category filtering</li>
              <li>✅ Single/multiple selection modes</li>
              <li>✅ Resource metadata display</li>
              <li>✅ Automatic URL refresh for expired links</li>
              <li>✅ Download tracking</li>
              <li>✅ Cron job for link maintenance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Technical Implementation
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Backend Features</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Resource Model:</strong> Enhanced file metadata with categories, tags, and expiry tracking</li>
              <li><strong>Upload API:</strong> Secure file upload to LocalStack S3 with validation</li>
              <li><strong>Expiry Management:</strong> Automatic URL refresh with configurable expiry times</li>
              <li><strong>Cron Jobs:</strong> Daily background tasks to refresh expiring URLs</li>
              <li><strong>Search & Filter:</strong> Advanced querying by type, category, and content</li>
              <li><strong>Access Control:</strong> Admin-only resource management with public read access</li>
            </ul>

            <h3 className="text-lg font-semibold mb-4 mt-6">Frontend Features</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>React Components:</strong> Reusable ImageUpload and ResourceManager components</li>
              <li><strong>State Management:</strong> Local state with real-time updates</li>
              <li><strong>User Experience:</strong> Drag & drop, progress indicators, error handling</li>
              <li><strong>Responsive Design:</strong> Mobile-friendly layouts with Tailwind CSS</li>
              <li><strong>Animation:</strong> Smooth transitions using Framer Motion</li>
              <li><strong>API Integration:</strong> RESTful API calls with proper error handling</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourceDemo;
