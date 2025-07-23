import React from 'react';
import { motion } from 'framer-motion';
import { getImagePath } from './utils/tabConfigs';

const ItemDetail = ({ 
  tabId, 
  tabName, 
  item, 
  onEdit, 
  onDelete, 
  onClose 
}) => {
  if (!item) return null;

  const renderItemDetailContent = () => {
    switch (tabId) {
      case 'projects':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Project Name</h4>
              <p className="text-secondary">{item.name}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Description</h4>
              <p className="text-secondary whitespace-pre-wrap">{item.description}</p>
            </div>
            {item.tags && Array.isArray(item.tags) && (
              <div>
                <h4 className="text-white font-semibold mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span key={index} className={`px-3 py-1 rounded-lg text-sm ${tag.color || 'bg-secondary/20 text-secondary'}`}>
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {item.source_code_link && (
              <div>
                <h4 className="text-white font-semibold mb-2">Source Code Link</h4>
                <a href={item.source_code_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  {item.source_code_link}
                </a>
              </div>
            )}
            {item.live_demo_link && (
              <div>
                <h4 className="text-white font-semibold mb-2">Live Demo Link</h4>
                <a href={item.live_demo_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                  {item.live_demo_link}
                </a>
              </div>
            )}
            {item.image && (
              <div>
                <h4 className="text-white font-semibold mb-2">Project Image</h4>
                <div className="relative">
                  <img 
                    src={getImagePath(item.image, 'project')} 
                    alt={item.name} 
                    className="w-full max-w-md rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className="hidden w-full max-w-md h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400"
                  >
                    Image not found: {item.image}
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Order</h4>
                <p className="text-secondary">{item.order}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Status</h4>
                <span className={`px-2 py-1 rounded text-sm ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Created At</h4>
                <p className="text-secondary">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Updated At</h4>
                <p className="text-secondary">{new Date(item.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );

      case 'experiences':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {item.icon && (
                <div 
                  className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: item.icon_bg || '#ffffff' }}
                >
                  <img 
                    src={getImagePath(item.icon, 'company')} 
                    alt={item.company_name} 
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-16 h-16 bg-gray-700 rounded-lg items-center justify-center text-gray-400 text-xs">
                    No icon
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2 text-xl">{item.title}</h4>
                <p className="text-secondary font-medium text-lg">{item.company_name}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">Date Range</h4>
              <p className="text-secondary">{item.date}</p>
            </div>

            {item.points && item.points.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">Key Responsibilities & Achievements</h4>
                <ul className="space-y-2">
                  {item.points.map((point, index) => (
                    <li key={index} className="text-secondary flex items-start gap-2">
                      <span className="text-secondary/60 mt-2">•</span>
                      <span className="flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Order</h4>
                <p className="text-secondary">{item.order}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Status</h4>
                <span className={`px-3 py-1 rounded text-sm ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Created At</h4>
                <p className="text-secondary">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Updated At</h4>
                <p className="text-secondary">{new Date(item.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );

      case 'technologies':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {item.icon && (
                <div className="flex-shrink-0">
                  <img 
                    src={getImagePath(item.icon, 'tech')} 
                    alt={item.name} 
                    className="w-20 h-20 object-contain rounded-lg bg-white p-3"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-20 h-20 bg-gray-700 rounded-lg items-center justify-center text-gray-400 text-xs">
                    No icon
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2 text-xl">{item.name}</h4>
                {item.category && (
                  <p className="text-secondary text-lg capitalize mb-2">{item.category.replace('-', ' ')}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Category</h4>
                <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-lg text-sm capitalize">
                  {item.category ? item.category.replace('-', ' ') : 'Uncategorized'}
                </span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Order</h4>
                <p className="text-secondary">{item.order}</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Status</h4>
              <span className={`px-3 py-1 rounded text-sm ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {item.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Created At</h4>
                <p className="text-secondary">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Updated At</h4>
                <p className="text-secondary">{new Date(item.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {item.icon && (
                <div className="flex-shrink-0">
                  <img 
                    src={getImagePath(item.icon, 'general')} 
                    alt={item.title} 
                    className="w-20 h-20 object-contain rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 p-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-20 h-20 bg-gray-700 rounded-lg items-center justify-center text-gray-400 text-xs">
                    No icon
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2 text-xl">{item.title}</h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Order</h4>
                <p className="text-secondary">{item.order}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Status</h4>
                <span className={`px-3 py-1 rounded text-sm ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Created At</h4>
                <p className="text-secondary">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Updated At</h4>
                <p className="text-secondary">{new Date(item.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {item.image && (
                <div className="flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 rounded-full object-cover border-2 border-secondary/20"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNDgiIGZpbGw9IiMzNzQxNTEiLz4KPGNpcmNsZSBjeD0iNDgiIGN5PSIzNiIgcj0iMTIiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTI0IDg0YzAtMTUgMTEtMjQgMjQtMjRzMjQgOSAyNCAyNCIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2 text-xl">{item.name}</h4>
                <p className="text-secondary font-medium text-lg mb-1">{item.designation}</p>
                {item.company && (
                  <p className="text-secondary/80 mb-3">{item.company}</p>
                )}
              </div>
            </div>

            <div className="bg-tertiary/50 p-4 rounded-lg border-l-4 border-secondary">
              <h4 className="text-white font-semibold mb-3">Testimonial</h4>
              <p className="text-secondary text-lg leading-relaxed italic">"{item.testimonial}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Order</h4>
                <p className="text-secondary">{item.order}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Status</h4>
                <span className={`px-3 py-1 rounded text-sm ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Created At</h4>
                <p className="text-secondary">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Updated At</h4>
                <p className="text-secondary">{new Date(item.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Name</h4>
              <p className="text-secondary">{item.name}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Email</h4>
              <p className="text-secondary">{item.email}</p>
            </div>
            {item.subject && (
              <div>
                <h4 className="text-white font-semibold mb-2">Subject</h4>
                <p className="text-secondary">{item.subject}</p>
              </div>
            )}
            <div>
              <h4 className="text-white font-semibold mb-2">Message</h4>
              <p className="text-secondary whitespace-pre-wrap">{item.message}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Status</h4>
              <span className={`px-3 py-1 rounded-lg font-medium ${
                item.status === 'read' ? 'bg-blue-500/20 text-blue-400' :
                item.status === 'replied' ? 'bg-green-500/20 text-green-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {item.status}
              </span>
            </div>
            {item.created_at && (
              <div>
                <h4 className="text-white font-semibold mb-2">Received Date</h4>
                <p className="text-secondary">{new Date(item.created_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div>
            <h4 className="text-white font-semibold mb-2">Item Details</h4>
            <p className="text-secondary">No detailed view available for this item type.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-tertiary rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h3 className="text-white text-xl font-bold">
            {tabName.slice(0, -1)} Details
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(tabId, item.id);
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Remove
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-secondary transition-colors ml-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {renderItemDetailContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default ItemDetail;
