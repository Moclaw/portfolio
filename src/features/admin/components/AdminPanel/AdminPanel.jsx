import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { slideIn } from '../../../../shared/utils/motion';
import CountsDashboard from '../CountsDashboard';
import DragDropList from '../DragDropList/DragDropList';
import UploadManager from '../UploadManager/UploadManager';
import api from '../../../../shared/services/api';
import FileUpload from '../../../../shared/components/Common/FileUpload';
import { useAuth } from '../../../../shared/context/AuthContext';

const AdminPanel = ({ onClose, isPage = false }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isOrderMode, setIsOrderMode] = useState(false);
  
  // User management state
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showUserCreateForm, setShowUserCreateForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const { token, API_BASE_URL, user } = useAuth();

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className={isPage 
        ? "min-h-screen pt-20 bg-primary flex items-center justify-center" 
        : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      }>
        <div className="bg-tertiary rounded-2xl p-8 text-center">
          <h2 className="text-white text-xl mb-4">Access Denied</h2>
          <p className="text-secondary mb-4">You need admin privileges to access this panel.</p>
          {!isPage && (
            <button
              onClick={onClose}
              className="bg-secondary hover:bg-secondary/80 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          )}
          {isPage && (
            <a
              href="/"
              className="bg-secondary hover:bg-secondary/80 text-white px-6 py-2 rounded-lg inline-block"
            >
              Go to Homepage
            </a>
          )}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', endpoint: null },
    { id: 'projects', name: 'Projects', endpoint: 'projects' },
    { id: 'experiences', name: 'Experiences', endpoint: 'experiences' },
    { id: 'technologies', name: 'Technologies', endpoint: 'technologies' },
    { id: 'services', name: 'Services', endpoint: 'services' },
    { id: 'testimonials', name: 'Testimonials', endpoint: 'testimonials' },
    { id: 'contacts', name: 'Contacts', endpoint: 'contacts' },
    { id: 'users', name: 'Users', endpoint: 'users' },
    { id: 'uploads', name: 'File Manager', endpoint: null },
  ];

  const fetchData = async (endpoint) => {
    setIsLoading(true);
    setError('');

    try {
      let url;
      if (endpoint === 'contacts' || endpoint === 'users') {
        url = `${API_BASE_URL}/admin/${endpoint}`;
      } else {
        url = `${API_BASE_URL}/api/${endpoint}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (endpoint === 'contacts') {
          setData(prev => ({ ...prev, [endpoint]: result.data || [] }));
        } else if (endpoint === 'users') {
          setData(prev => ({ ...prev, [endpoint]: result.users || [] }));
        } else if (endpoint === 'projects') {
          // Handle the new projects response structure
          setData(prev => ({ ...prev, [endpoint]: result.data || [] }));
        } else if (endpoint === 'experiences') {
          // Handle the new experiences response structure
          setData(prev => ({ ...prev, [endpoint]: result.data || [] }));
        } else if (endpoint === 'technologies') {
          // Handle the new technologies response structure
          setData(prev => ({ ...prev, [endpoint]: result.data || [] }));
        } else if (endpoint === 'services') {
          // Handle the new services response structure
          setData(prev => ({ ...prev, [endpoint]: result.data || [] }));
        } else if (endpoint === 'testimonials') {
          // Handle the new testimonials response structure
          setData(prev => ({ ...prev, [endpoint]: result.data || [] }));
        } else {
          setData(prev => ({ ...prev, [endpoint]: Array.isArray(result) ? result : result[endpoint] || [] }));
        }
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      setError('Network error occurred');
    }

    setIsLoading(false);
  };

  const handleCreate = async (endpoint, itemData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        await fetchData(endpoint);
        setEditingItem(null);
        setFormData({});
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create item');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleUpdate = async (endpoint, id, itemData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        await fetchData(endpoint);
        setEditingItem(null);
        setFormData({});
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update item');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const handleDelete = async (endpoint, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchData(endpoint);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete item');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  // Order management functions
  const handleReorderItems = async (items, tabId) => {
    try {
      switch (tabId) {
        case 'projects':
          await api.updateProjectsOrder(items);
          break;
        case 'experiences':
          await api.updateExperiencesOrder(items);
          break;
        case 'technologies':
          await api.updateTechnologiesOrder(items);
          break;
        case 'services':
          await api.updateServicesOrder(items);
          break;
        case 'testimonials':
          await api.updateTestimonialsOrder(items);
          break;
        default:
          throw new Error(`Unsupported tab for reordering: ${tabId}`);
      }
      
      // Refresh the data after reordering
      const currentTab = tabs.find(tab => tab.id === tabId);
      if (currentTab && currentTab.endpoint) {
        await fetchData(currentTab.endpoint);
      }
    } catch (error) {
      setError('Failed to update order');
      throw error;
    }
  };

  // Load all necessary data when component mounts
  useEffect(() => {
    // Load data for all tabs with endpoints to populate dashboard
    const tabsWithEndpoints = tabs.filter(tab => tab.endpoint);
    tabsWithEndpoints.forEach(tab => {
      fetchData(tab.endpoint);
    });
  }, []); // Only run once on mount

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (currentTab && currentTab.endpoint) {
      // Only fetch if data doesn't exist yet
      if (!data[currentTab.endpoint]) {
        fetchData(currentTab.endpoint);
      }
    }
  }, [activeTab]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const currentTab = tabs.find(tab => tab.id === activeTab);
    
    // Don't allow creating contacts from admin panel
    if (activeTab === 'contacts') {
      setError('Contacts can only be created through the contact form');
      return;
    }
    
    if (editingItem && editingItem.id) {
      handleUpdate(currentTab.endpoint, editingItem.id, formData);
    } else {
      handleCreate(currentTab.endpoint, formData);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setSelectedItem(null);
  };

  const startCreate = () => {
    setEditingItem(null);
    setFormData({});
    setShowCreateForm(true);
    setSelectedItem(null);
  };

  const renderItemsList = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    const items = data[currentTab.endpoint] || [];

    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-secondary text-lg mb-4">
            No {currentTab.name.toLowerCase()} found
          </div>
          {activeTab !== 'contacts' && (
            <button
              onClick={startCreate}
              className="bg-secondary hover:bg-secondary/80 text-white px-6 py-3 rounded-lg font-medium"
            >
              Create First {currentTab.name.slice(0, -1)}
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary rounded-lg p-4 cursor-pointer hover:bg-primary/80 transition-colors border border-gray-700 hover:border-secondary/50"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {renderItemPreview(activeTab, item)}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(item);
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
                    handleDelete(currentTab.endpoint, item.id);
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

  const renderItemPreview = (tabId, item) => {
    switch (tabId) {
      case 'projects':
        return (
          <div className="flex gap-3">
            {item.image && (
              <div className="flex-shrink-0">
                <img 
                  src={getImagePath(item.image, 'project')} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-secondary text-sm mb-2 line-clamp-2">{item.description}</p>
              {item.tags && Array.isArray(item.tags) && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className={`px-2 py-1 rounded text-xs ${tag.color || 'bg-secondary/20 text-secondary'}`}>
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'experiences':
        return (
          <div className="flex gap-3">
            {item.icon && (
              <div className="flex-shrink-0">
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: item.icon_bg || '#ffffff' }}
                >
                  <img 
                    src={getImagePath(item.icon, 'company')} 
                    alt={item.company_name} 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-secondary font-medium mb-2">{item.company_name}</p>
              <div className="flex gap-2 text-sm text-secondary mb-2">
                <span className="bg-secondary/20 px-2 py-1 rounded text-xs">{item.date}</span>
                <span className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {item.points && item.points.length > 0 && (
                <p className="text-secondary text-sm line-clamp-2">{item.points[0]}</p>
              )}
            </div>
          </div>
        );
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
        return null;
    }
  };

  const renderItemDetail = () => {
    if (!selectedItem) return null;

    const currentTab = tabs.find(tab => tab.id === activeTab);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-tertiary rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <h3 className="text-white text-xl font-bold">
              {currentTab.name.slice(0, -1)} Details
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(selectedItem)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDelete(currentTab.endpoint, selectedItem.id);
                  setSelectedItem(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Remove
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-white hover:text-secondary transition-colors ml-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {renderItemDetailContent(activeTab, selectedItem)}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderItemDetailContent = (tabId, item) => {
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
        return null;
    }
  };

  const renderForm = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    
    // Don't show create form for contacts, only edit
    if (activeTab === 'contacts' && (!editingItem || !editingItem.id)) {
      return null;
    }
    
    const fields = getFormFields(activeTab);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-tertiary rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <h3 className="text-white text-xl font-bold">
              {editingItem && editingItem.id ? 'Edit' : 'Create'} {currentTab.name.slice(0, -1)}
            </h3>
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({});
                setShowCreateForm(false);
              }}
              className="text-white hover:text-secondary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleFormSubmit}>
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
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({});
                    setShowCreateForm(false);
                  }}
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

  const getFormFields = (tabId) => {
    switch (tabId) {
      case 'projects':
        return [
          { name: 'name', label: 'Project Name', placeholder: 'Enter project name', required: true },
          { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter project description', required: true },
          { name: 'source_code_link', label: 'Source Code Link', placeholder: 'https://github.com/...', type: 'url' },
          { name: 'live_demo_link', label: 'Live Demo Link', placeholder: 'https://...', type: 'url' },
          { 
            name: 'image', 
            label: 'Project Image', 
            type: 'file',
            accept: 'image/*',
            placeholder: 'Upload project image',
            description: 'Upload project screenshot or image'
          },
          { name: 'order', label: 'Order', placeholder: '1', type: 'number' },
          { name: 'is_active', label: 'Status', type: 'select', options: [
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' }
          ]},
        ];
      case 'experiences':
        return [
          { name: 'title', label: 'Job Title', placeholder: 'Full Stack Developer', required: true },
          { name: 'company_name', label: 'Company Name', placeholder: 'MaicoGroup', required: true },
          { 
            name: 'icon', 
            label: 'Company Logo', 
            type: 'file',
            accept: 'image/*',
            placeholder: 'Upload company logo',
            description: 'Upload company logo or icon'
          },
          { name: 'icon_bg', label: 'Icon Background Color', placeholder: '#ffffff' },
          { name: 'date', label: 'Date Range', placeholder: 'Apr 2021 - Jan 2022', required: true },
          { name: 'order', label: 'Order', placeholder: '1', type: 'number' },
          { name: 'is_active', label: 'Status', type: 'select', options: [
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' }
          ]},
        ];
      case 'technologies':
        return [
          { name: 'name', label: 'Technology Name', placeholder: 'C#', required: true },
          { 
            name: 'icon', 
            label: 'Technology Icon', 
            type: 'file',
            accept: 'image/*',
            placeholder: 'Upload technology icon',
            description: 'Upload technology logo or icon'
          },
          { name: 'category', label: 'Category', type: 'select', options: [
            { value: 'programming', label: 'Programming' },
            { value: 'framework', label: 'Framework' },
            { value: 'database', label: 'Database' },
            { value: 'cloud', label: 'Cloud' },
            { value: 'frontend', label: 'Frontend' },
            { value: 'backend', label: 'Backend' },
            { value: 'container', label: 'Container' },
            { value: 'ci/cd', label: 'CI/CD' },
            { value: 'messaging', label: 'Messaging' },
            { value: 'os', label: 'Operating System' },
            { value: 'project-management', label: 'Project Management' },
            { value: 'other', label: 'Other' }
          ], required: true },
          { name: 'order', label: 'Order', placeholder: '1', type: 'number' },
          { name: 'is_active', label: 'Status', type: 'select', options: [
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' }
          ]},
        ];
      case 'services':
        return [
          { name: 'title', label: 'Service Title', placeholder: 'Full Stack Developer', required: true },
          { 
            name: 'icon', 
            label: 'Service Icon', 
            type: 'file',
            accept: 'image/*',
            placeholder: 'Upload service icon',
            description: 'Upload service icon or illustration'
          },
          { name: 'order', label: 'Order', placeholder: '1', type: 'number' },
          { name: 'is_active', label: 'Status', type: 'select', options: [
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' }
          ]},
        ];
      case 'testimonials':
        return [
          { name: 'testimonial', label: 'Testimonial', type: 'textarea', placeholder: 'I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.', required: true },
          { name: 'name', label: 'Client Name', placeholder: 'Sara Lee', required: true },
          { name: 'designation', label: 'Designation', placeholder: 'CFO', required: true },
          { name: 'company', label: 'Company', placeholder: 'Acme Co', required: true },
          { 
            name: 'image', 
            label: 'Client Photo', 
            type: 'file',
            accept: 'image/*',
            placeholder: 'Upload client photo',
            description: 'Upload client profile photo'
          },
          { name: 'order', label: 'Order', placeholder: '1', type: 'number' },
          { name: 'is_active', label: 'Status', type: 'select', options: [
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' }
          ]},
        ];
      case 'contacts':
        return [
          { name: 'name', label: 'Name', placeholder: 'Contact Name', required: true },
          { name: 'email', label: 'Email', placeholder: 'contact@example.com', type: 'email', required: true },
          { name: 'subject', label: 'Subject', placeholder: 'Message Subject' },
          { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Contact message', required: true },
          { name: 'status', label: 'Status', type: 'select', options: [
            { value: 'unread', label: 'Unread' },
            { value: 'read', label: 'Read' },
            { value: 'replied', label: 'Replied' }
          ]},
        ];
      default:
        return [];
    }
  };

  // Order management functions
  const renderOrderManagement = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (!currentTab || !currentTab.endpoint) return null;

    const items = data[currentTab.endpoint]?.data || data[currentTab.endpoint] || [];
    
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">No items to reorder</p>
        </div>
      );
    }

    // Sort items by order before displaying
    const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Reorder {currentTab.name}</h3>
          <p className="text-gray-400">Drag and drop items to change their display order</p>
        </div>
        
        <DragDropList
          items={sortedItems}
          onReorder={(itemsWithOrder) => handleReorderItems(itemsWithOrder, activeTab)}
          renderItem={(item) => renderDragDropItem(activeTab, item)}
          keyExtractor={(item) => item.id}
          isActiveExtractor={(item) => item.is_active !== false}
          className="max-w-4xl"
        />
      </div>
    );
  };

  // Helper function to get the correct image path
  const getImagePath = (imagePath, type = 'general') => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('//')) {
      return imagePath;
    }
    
    // Handle different asset paths based on type
    const assetPaths = {
      company: '/src/assets/company/',
      tech: '/src/assets/tech/',
      project: '/src/assets/',
      general: '/src/assets/'
    };
    
    const basePath = assetPaths[type] || assetPaths.general;
    
    // If path already starts with /src/assets, return as is
    if (imagePath.startsWith('/src/assets/')) {
      return imagePath;
    }
    
    // If it's just a filename, prepend the appropriate path
    return basePath + imagePath;
  };

  const renderDragDropItem = (tabId, item) => {
    // Image component with loading state
    const ImageWithLoading = ({ src, alt, className, type = 'general' }) => {
      const [isLoading, setIsLoading] = useState(true);
      const [hasError, setHasError] = useState(false);
      const imageSrc = getImagePath(src, type);
      
      if (!imageSrc) return null;
      
      return (
        <div className="relative">
          {isLoading && (
            <div className={`${className} bg-gray-700 animate-pulse flex items-center justify-center`}>
              <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {!hasError ? (
            <img 
              src={imageSrc} 
              alt={alt} 
              className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          ) : (
            <div className={`${className} bg-gray-700 flex items-center justify-center text-gray-400 text-xs`}>
              No Image
            </div>
          )}
        </div>
      );
    };

    switch (tabId) {
      case 'projects':
        return (
          <div className="flex items-center gap-4">
            <ImageWithLoading 
              src={item.image} 
              alt={item.name} 
              className="w-12 h-12 object-cover rounded"
              type="project"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium">{item.name}</h4>
              <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-400">Order: {item.order || 'N/A'}</span>
            </div>
          </div>
        );
      
      case 'experiences':
        return (
          <div className="flex items-center gap-4">
            <ImageWithLoading 
              src={item.icon} 
              alt={item.title} 
              className="w-12 h-12 object-contain rounded"
              type="company"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.company_name} • {item.date}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-400">Order: {item.order || 'N/A'}</span>
            </div>
          </div>
        );
        
      case 'technologies':
        return (
          <div className="flex items-center gap-4">
            <ImageWithLoading 
              src={item.icon} 
              alt={item.name} 
              className="w-12 h-12 object-contain rounded"
              type="tech"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium">{item.name}</h4>
              <p className="text-gray-400 text-sm">{item.category}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-400">Order: {item.order || 'N/A'}</span>
            </div>
          </div>
        );
        
      case 'services':
        return (
          <div className="flex items-center gap-4">
            <ImageWithLoading 
              src={item.icon} 
              alt={item.title} 
              className="w-12 h-12 object-contain rounded"
              type="general"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium">{item.title}</h4>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-400">Order: {item.order || 'N/A'}</span>
            </div>
          </div>
        );
        
      case 'testimonials':
        return (
          <div className="flex items-center gap-4">
            <ImageWithLoading 
              src={item.image} 
              alt={item.name} 
              className="w-12 h-12 object-cover rounded-full"
              type="general"
            />
            <div className="flex-1">
              <h4 className="text-white font-medium">{item.name}</h4>
              <p className="text-gray-400 text-sm">{item.designation} at {item.company}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-400">Order: {item.order || 'N/A'}</span>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-between">
            <span className="text-white">Item #{item.id}</span>
            <span className="text-sm text-gray-400">Order: {item.order || 'N/A'}</span>
          </div>
        );
    }
  };

  // Handle navigation from dashboard cards to specific tabs
  const handleNavigateToTab = (tabId) => {
    if (tabs.find(tab => tab.id === tabId)) {
      setActiveTab(tabId);
      setSelectedItem(null);
      setEditingItem(null);
      setShowCreateForm(false);
      setIsOrderMode(false);
    }
  };

  // Users management rendering
  const renderUsersManagement = () => {
    const handleCreateUser = async (e) => {
      e.preventDefault();
      try {
        await api.createUser(userForm);
        setUserForm({ username: '', email: '', password: '', role: 'user' });
        setShowUserCreateForm(false);
        await fetchData('users');
      } catch (error) {
        alert('Failed to create user');
      }
    };

    const handleUpdateUser = async (e) => {
      e.preventDefault();
      try {
        const { password, ...updateData } = userForm;
        await api.updateUser(editingUser.id, updateData);
        setEditingUser(null);
        setUserForm({ username: '', email: '', password: '', role: 'user' });
        await fetchData('users');
      } catch (error) {
        alert('Failed to update user');
      }
    };

    const handleUpdatePassword = async (e) => {
      e.preventDefault();
      if (!newPassword || newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }
      try {
        await api.updateUserPassword(editingUser.id, newPassword);
        setShowPasswordForm(false);
        setNewPassword('');
        alert('Password updated successfully');
      } catch (error) {
        alert('Failed to update password');
      }
    };

    const handleDeleteUser = async (userId) => {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await api.deleteUser(userId);
          await fetchData('users');
        } catch (error) {
          alert('Failed to delete user');
        }
      }
    };

    const handleToggleStatus = async (userId) => {
      try {
        await api.toggleUserStatus(userId);
        await fetchData('users');
      } catch (error) {
        alert('Failed to toggle user status');
      }
    };

    const startEdit = (user) => {
      setEditingUser(user);
      setUserForm({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role
      });
      setShowUserCreateForm(false);
    };

    const startPasswordEdit = (user) => {
      setEditingUser(user);
      setShowPasswordForm(true);
      setNewPassword('');
    };

    const users = data.users || [];

    return (
      <div className="space-y-6">
        {/* Create/Edit Form */}
        {(showUserCreateForm || editingUser) && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white text-lg font-medium mb-4">
              {editingUser ? 'Edit User' : 'Create New User'}
            </h3>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                      required
                      minLength="6"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserCreateForm(false);
                    setEditingUser(null);
                    setUserForm({ username: '', email: '', password: '', role: 'user' });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Update Form */}
        {showPasswordForm && editingUser && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-white text-lg font-medium mb-4">
              Update Password for {editingUser.username}
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  required
                  minLength="6"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setEditingUser(null);
                    setNewPassword('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white text-lg font-medium">Users</h3>
            <button
              onClick={() => {
                setShowUserCreateForm(true);
                setEditingUser(null);
                setUserForm({ username: '', email: '', password: '', role: 'user' });
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  {getTableHeaders('users').map(header => (
                    <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm text-white">{user.id}</td>
                    <td className="px-4 py-3 text-sm text-white">{user.username}</td>
                    <td className="px-4 py-3 text-sm text-white">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-600 text-white'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.is_active 
                          ? 'bg-green-600 text-white' 
                          : 'bg-red-600 text-white'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(user)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit user"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => startPasswordEdit(user)}
                          className="text-yellow-400 hover:text-yellow-300"
                          title="Change password"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={user.is_active ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'}
                          title={user.is_active ? 'Deactivate user' : 'Activate user'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete user"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No users found. Click "Add User" to create the first user.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTable = () => {
    // Special case for dashboard tab
    if (activeTab === 'dashboard') {
      return <CountsDashboard onNavigateToTab={handleNavigateToTab} />;
    }

    // Special case for uploads tab
    if (activeTab === 'uploads') {
      return <UploadManager />;
    }

    // Special case for users tab
    if (activeTab === 'users') {
      return renderUsersManagement();
    }
    
    // Show drag-and-drop interface in order mode
    if (isOrderMode) {
      return renderOrderManagement();
    }
    
    return renderItemsList();
  };

  const getTableHeaders = (tabId) => {
    switch (tabId) {
      case 'projects':
        return ['Image', 'Name', 'Description', 'Tags', 'Order', 'Status'];
      case 'experiences':
        return ['Icon', 'Title', 'Company', 'Date', 'Order', 'Status'];
      case 'technologies':
        return ['Icon', 'Name', 'Category', 'Order', 'Status'];
      case 'services':
        return ['Icon', 'Title', 'Order', 'Status'];
      case 'testimonials':
        return ['Image', 'Name', 'Designation', 'Company', 'Order', 'Status'];
      case 'contacts':
        return ['Name', 'Email', 'Subject', 'Status', 'Date'];
      case 'users':
        return ['ID', 'Username', 'Email', 'Role', 'Status', 'Created', 'Actions'];
      default:
        return [];
    }
  };

  const getTableCells = (tabId, item) => {
    switch (tabId) {
      case 'projects':
        return [
          item.image ? (
            <img 
              src={getImagePath(item.image, 'project')} 
              alt={item.name} 
              className="w-12 h-8 object-cover rounded"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA0OCAzMiIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjMyIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Im0yMCAxNiA0IDQgOC04IiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                e.target.className = 'w-12 h-8 object-cover rounded opacity-50';
              }}
            />
          ) : (
            <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">No img</span>
            </div>
          ),
          item.name || '',
          (item.description || '').substring(0, 50) + '...',
          item.tags ? item.tags.map(tag => tag.name).join(', ') : '',
          item.order || '',
          item.is_active ? 'Active' : 'Inactive'
        ];
      case 'experiences':
        return [
          item.icon ? (
            <div 
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ backgroundColor: item.icon_bg || '#ffffff' }}
            >
              <img 
                src={getImagePath(item.icon, 'company')} 
                alt={item.company_name} 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">No icon</span>
            </div>
          ),
          item.title || '',
          item.company_name || '',
          item.date || '',
          item.order || '',
          item.is_active ? 'Active' : 'Inactive'
        ];
      case 'technologies':
        return [
          item.icon ? (
            <img 
              src={getImagePath(item.icon, 'tech')} 
              alt={item.name} 
              className="w-10 h-10 object-contain rounded bg-white p-1"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMCAxMGwtNCA0IDQgNCA0LTR6IiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjwvcWc+Cjwvc3ZnPgo=';
                e.target.className = 'w-10 h-10 object-contain rounded opacity-50';
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">No icon</span>
            </div>
          ),
          item.name || '',
          <span className="capitalize">{item.category ? item.category.replace('-', ' ') : 'Uncategorized'}</span>,
          item.order || '',
          item.is_active ? 'Active' : 'Inactive'
        ];
      case 'services':
        return [
          item.icon ? (
            <img 
              src={getImagePath(item.icon, 'general')} 
              alt={item.title} 
              className="w-10 h-10 object-contain rounded bg-gradient-to-r from-violet-600 to-purple-600 p-2"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMCAxNWg0djEwaC00eiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
                e.target.className = 'w-10 h-10 object-contain rounded opacity-50';
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">No icon</span>
            </div>
          ),
          item.title || '',
          item.order || '',
          item.is_active ? 'Active' : 'Inactive'
        ];
      case 'testimonials':
        return [
          item.image ? (
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-10 h-10 object-cover rounded-full"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMzNzQxNTEiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iNSIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJNMTAgMzBjMC02IDUtMTAgMTAtMTBzMTAgNCAEMCA2IiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPgo=';
              }}
            />
          ) : (
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-400">No img</span>
            </div>
          ),
          item.name || '',
          item.designation || '',
          item.company || '',
          item.order || '',
          item.is_active ? 'Active' : 'Inactive'
        ];
      case 'contacts':
        return [
          item.name || '',
          item.email || '',
          item.subject || '',
          item.status || '',
          item.created_at ? new Date(item.created_at).toLocaleDateString() : ''
        ];
      default:
        return [];
    }
  };

  return (
    <div className={isPage 
      ? "min-h-screen pt-20 bg-primary" 
      : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    }>
      <motion.div
        variants={slideIn('up', 'tween', 0, 0.3)}
        initial="hidden"
        animate="show"
        className={isPage 
          ? "bg-tertiary rounded-2xl w-full max-w-7xl mx-auto min-h-[90vh] overflow-hidden relative" 
          : "bg-tertiary rounded-2xl w-full max-w-7xl h-full max-h-[90vh] overflow-hidden relative"
        }
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          {!isPage && (
            <button
              onClick={onClose}
              className="text-white hover:text-secondary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 mx-6 mt-4 rounded">
            {error}
          </div>
        )}

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-600 p-6">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedItem(null);
                    setEditingItem(null);
                    setShowCreateForm(false);
                    setIsOrderMode(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                    activeTab === tab.id
                      ? 'bg-secondary text-white'
                      : 'text-secondary hover:text-white hover:bg-primary'
                  }`}
                >
                  <span>{tab.name}</span>
                </button>
              ))}
              
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header with Create Button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-600">
              <div>
                <h3 className="text-white text-xl font-semibold">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h3>
                <p className="text-secondary text-sm mt-1">
                  {activeTab === 'dashboard'
                    ? 'Overview of your portfolio content'
                    : `Manage your ${activeTab} content`
                  }
                </p>
              </div>
              {activeTab !== 'contacts' && activeTab !== 'dashboard' && activeTab !== 'uploads' && activeTab !== 'users' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOrderMode(!isOrderMode)}
                    className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                      isOrderMode
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    {isOrderMode ? 'Exit Order Mode' : 'Manage Order'}
                  </button>
                  {!isOrderMode && (
                    <button
                      onClick={startCreate}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                  <span className="ml-3 text-secondary">Loading...</span>
                </div>
              ) : (
                renderTable()
              )}
            </div>
          </div>
        </div>

        {/* Render Forms and Modals */}
        {renderItemDetail()}
        {(editingItem || showCreateForm) && renderForm()}
      </motion.div>
    </div>
  );
};

export default AdminPanel;
