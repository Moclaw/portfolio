import React from 'react';
import { motion } from 'framer-motion';
import { FileUpload } from '../../../../shared/components/Common';
import { getFormFields } from './utils/tabConfigs';

const AdminForm = ({ 
  tabId, 
  tabName, 
  editingItem, 
  formData, 
  setFormData, 
  onSubmit, 
  onClose, 
  setError 
}) => {
  const fields = getFormFields(tabId);

  // Don't show create form for contacts, only edit
  if (tabId === 'contacts' && (!editingItem || !editingItem.id)) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-tertiary rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h3 className="text-white text-xl font-bold">
            {editingItem && editingItem.id ? 'Edit' : 'Create'} {tabName.slice(0, -1)}
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(field => (
                <div key={field.name} className={field.type === 'textarea' || field.type === 'file' ? 'md:col-span-2' : ''}>
                  <label className="block text-white text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  
                  {field.type === 'file' ? (
                    <FileUpload
                      onUploadSuccess={(file, allFiles) => {
                        if (field.multiple) {
                          const urls = allFiles.map(f => f.url).filter(url => url);
                          setFormData(prev => ({ 
                            ...prev, 
                            [field.name]: urls.join(',') 
                          }));
                        } else {
                          if (file.url) {
                            setFormData(prev => ({ 
                              ...prev, 
                              [field.name]: file.url 
                            }));
                          } else {
                            setError('Upload successful but URL not received. Please try again.');
                          }
                        }
                      }}
                      onUploadError={(error) => setError(error.message)}
                      multiple={field.multiple || false}
                      accept={field.accept || "image/*"}
                      maxSize={field.maxSize || 10 * 1024 * 1024}
                      label={field.placeholder || `Choose ${field.label}`}
                      description={field.description || "Drag and drop files here, click to upload new files, or select from existing files"}
                      showPreview={true}
                      existingFiles={field.existingFiles || []}
                      className="bg-gray-700"
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary"
                      placeholder={field.placeholder}
                      rows={4}
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-secondary"
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-600">
              <button
                type="submit"
                className="bg-secondary hover:bg-secondary/80 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {editingItem && editingItem.id ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminForm;
