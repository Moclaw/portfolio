import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { slideIn } from '../utils/motion';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    status: 'unread'
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  });

  const { token, API_BASE_URL } = useAuth();

  const fetchContacts = async (page = 1, status = '') => {
    setIsLoading(true);
    setError('');

    try {
      let url = `${API_BASE_URL}/admin/contacts?page=${page}&limit=${pagination.limit}`;
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setContacts(result.data || []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        setError('Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Fetch contacts error:', error);
      setError('Network error occurred');
    }

    setIsLoading(false);
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUnreadCount(result.data?.unread_count || 0);
      }
    } catch (error) {
      console.error('Fetch unread count error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchContacts(pagination.page, filter === 'all' ? '' : filter);
        await fetchUnreadCount();
        setSelectedContact(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Network error occurred');
    }
  };

  const handleUpdate = async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await fetchContacts(pagination.page, filter === 'all' ? '' : filter);
        await fetchUnreadCount();
        setEditingContact(null);
        setFormData({ name: '', email: '', subject: '', message: '', status: 'unread' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update contact');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Network error occurred');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/contacts/${id}/mark-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchContacts(pagination.page, filter === 'all' ? '' : filter);
        await fetchUnreadCount();
        // Update the selected contact if it's currently displayed
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact({...selectedContact, status: 'read'});
        }
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchContacts(1, newFilter === 'all' ? '' : newFilter);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchContacts(newPage, filter === 'all' ? '' : filter);
    }
  };

  const startEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      status: contact.status
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingContact) {
      handleUpdate(editingContact.id, formData);
    }
  };

  const viewContact = async (contact) => {
    setSelectedContact(contact);
    // Mark as read when viewing
    if (contact.status === 'unread') {
      await handleMarkAsRead(contact.id);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchUnreadCount();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-primary">
      <motion.div
        variants={slideIn('up', 'tween', 0, 0.3)}
        initial="hidden"
        animate="show"
        className="bg-tertiary rounded-2xl w-full max-w-7xl mx-auto min-h-[90vh] overflow-hidden relative"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-bold text-2xl">Contact Management</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <a
            href="/"
            className="text-white hover:text-secondary transition-colors"
          >
            Back to Portfolio
          </a>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 mx-6 mt-4 rounded">
            {error}
          </div>
        )}

        <div className="flex h-full">
          {/* Sidebar with filters */}
          <div className="w-64 border-r border-gray-600 p-6">
            <nav className="space-y-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-secondary text-white'
                    : 'text-secondary hover:text-white hover:bg-primary'
                }`}
              >
                All Contacts
              </button>
              <button
                onClick={() => handleFilterChange('unread')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  filter === 'unread'
                    ? 'bg-secondary text-white'
                    : 'text-secondary hover:text-white hover:bg-primary'
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleFilterChange('read')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  filter === 'read'
                    ? 'bg-secondary text-white'
                    : 'text-secondary hover:text-white hover:bg-primary'
                }`}
              >
                Read
              </button>
              <button
                onClick={() => handleFilterChange('replied')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  filter === 'replied'
                    ? 'bg-secondary text-white'
                    : 'text-secondary hover:text-white hover:bg-primary'
                }`}
              >
                Replied
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Contact List */}
            <div className="flex-1 p-6 border-r border-gray-600">
              {/* Edit Form */}
              {editingContact && (
                <div className="mb-6">
                  <form onSubmit={handleFormSubmit} className="bg-primary p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white text-lg">Edit Contact</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingContact(null);
                          setFormData({ name: '', email: '', subject: '', message: '', status: 'unread' });
                        }}
                        className="text-white hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-tertiary border border-gray-600 rounded-lg px-4 py-3 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-tertiary border border-gray-600 rounded-lg px-4 py-3 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Subject</label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full bg-tertiary border border-gray-600 rounded-lg px-4 py-3 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full bg-tertiary border border-gray-600 rounded-lg px-4 py-3 text-white"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white text-sm font-medium mb-2">Message</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full bg-tertiary border border-gray-600 rounded-lg px-4 py-3 text-white"
                          rows={3}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        type="submit"
                        className="bg-secondary hover:bg-secondary/80 text-white px-6 py-2 rounded-lg"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingContact(null);
                          setFormData({ name: '', email: '', subject: '', message: '', status: 'unread' });
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Contact List */}
              <div>
                <h3 className="text-white text-lg mb-4">
                  Contacts ({pagination.totalItems})
                </h3>

                {isLoading ? (
                  <div className="text-center text-secondary py-8">Loading...</div>
                ) : contacts.length === 0 ? (
                  <div className="text-center text-secondary py-8">No contacts found.</div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {contacts.map(contact => (
                        <div
                          key={contact.id}
                          className={`p-4 rounded-lg border cursor-pointer hover:bg-primary/50 transition-colors ${
                            contact.status === 'unread' 
                              ? 'border-yellow-400 bg-yellow-400/10' 
                              : 'border-gray-600'
                          } ${
                            selectedContact?.id === contact.id ? 'bg-secondary/20' : ''
                          }`}
                          onClick={() => viewContact(contact)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium">{contact.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  contact.status === 'unread' ? 'bg-yellow-500 text-black' :
                                  contact.status === 'read' ? 'bg-blue-500 text-white' :
                                  'bg-green-500 text-white'
                                }`}>
                                  {contact.status}
                                </span>
                              </div>
                              <p className="text-secondary text-sm">{contact.email}</p>
                              <p className="text-white text-sm mt-1">{contact.subject}</p>
                              <p className="text-secondary text-xs mt-2">
                                {formatDate(contact.created_at)}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1 ml-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEdit(contact);
                                }}
                                className="text-blue-400 hover:text-blue-300 text-sm px-2 py-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(contact.id);
                                }}
                                className="text-red-400 hover:text-red-300 text-sm px-2 py-1"
                              >
                                Delete
                              </button>
                              {contact.status === 'unread' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(contact.id);
                                  }}
                                  className="text-green-400 hover:text-green-300 text-sm px-2 py-1"
                                >
                                  Mark Read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="px-3 py-1 text-white bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        {[...Array(pagination.totalPages)].map((_, index) => {
                          const page = index + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 rounded ${
                                page === pagination.page
                                  ? 'bg-secondary text-white'
                                  : 'bg-gray-600 text-white hover:bg-gray-500'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="px-3 py-1 text-white bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Contact Detail */}
            <div className="w-96 p-6">
              {selectedContact ? (
                <div>
                  <h3 className="text-white text-lg mb-4">Contact Details</h3>
                  <div className="bg-primary p-4 rounded-lg space-y-4">
                    <div>
                      <label className="text-secondary text-sm">Name</label>
                      <p className="text-white">{selectedContact.name}</p>
                    </div>
                    <div>
                      <label className="text-secondary text-sm">Email</label>
                      <p className="text-white break-all">
                        <a 
                          href={`mailto:${selectedContact.email}`}
                          className="hover:text-secondary transition-colors"
                        >
                          {selectedContact.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <label className="text-secondary text-sm">Subject</label>
                      <p className="text-white">{selectedContact.subject}</p>
                    </div>
                    <div>
                      <label className="text-secondary text-sm">Message</label>
                      <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                    <div>
                      <label className="text-secondary text-sm">Status</label>
                      <p className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
                        selectedContact.status === 'unread' ? 'bg-yellow-500 text-black' :
                        selectedContact.status === 'read' ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {selectedContact.status}
                      </p>
                    </div>
                    <div>
                      <label className="text-secondary text-sm">Received</label>
                      <p className="text-white">{formatDate(selectedContact.created_at)}</p>
                    </div>
                    
                    <div className="flex gap-2 pt-4 border-t border-gray-600">
                      <button
                        onClick={() => startEdit(selectedContact)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(selectedContact.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Delete
                      </button>
                      {selectedContact.status === 'unread' && (
                        <button
                          onClick={() => handleMarkAsRead(selectedContact.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-secondary py-8">
                  Select a contact to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminContacts;
