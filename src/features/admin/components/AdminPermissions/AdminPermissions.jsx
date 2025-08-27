import React, { useState, useEffect } from 'react';
import api from '../../../../shared/services/api';
import { useAuth } from '../../../../shared/context/AuthContext';
import { useToast } from '../../../../shared/context/ToastContext';
import { useModal } from '../../../../shared/context/ModalContext';
import PermissionGuard from '../../../../shared/components/Common/PermissionGuard';

const AdminPermissions = () => {
  const { canRead, canCreate, canUpdate, canDelete } = useAuth();
  const { showSuccess, showError } = useToast();
  const { showConfirm } = useModal();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    resource: '',
    action: ''
  });

  const resourceOptions = [
    'users', 'roles', 'permissions', 'projects', 'technologies', 
    'experiences', 'testimonials', 'contacts', 'services', 'uploads'
  ];

  const actionOptions = ['create', 'read', 'update', 'delete'];

  useEffect(() => {
    if (canRead('permissions')) {
      fetchPermissions();
    }
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await api.getPermissions();
      setPermissions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingPermission) {
        await api.updatePermission(editingPermission.id, formData);
        showSuccess('Cập nhật permission thành công!');
      } else {
        await api.createPermission(formData);
        showSuccess('Tạo permission thành công!');
      }
      fetchPermissions();
      resetForm();
    } catch (error) {
      console.error('Error saving permission:', error);
      showError('Lỗi khi lưu permission: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Bạn có chắc chắn muốn xóa permission này?', 'Xác nhận xóa permission');
    if (confirmed) {
      try {
        await api.deletePermission(id);
        showSuccess('Xóa permission thành công!');
        fetchPermissions();
      } catch (error) {
        console.error('Error deleting permission:', error);
        showError('Lỗi khi xóa permission: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleEdit = (permission) => {
    setEditingPermission(permission);
    setFormData({
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      resource: '',
      action: ''
    });
    setEditingPermission(null);
    setShowModal(false);
  };

  const handleInitializeDefaults = async () => {
    const confirmed = await showConfirm(
      'Điều này sẽ tạo các permission mặc định cho tất cả resources. Tiếp tục?',
      'Xác nhận khởi tạo permissions'
    );
    if (confirmed) {
      try {
        setLoading(true);
        await api.initializeDefaultPermissions();
        fetchPermissions();
        showSuccess('Khởi tạo permission mặc định thành công!');
      } catch (error) {
        console.error('Error initializing permissions:', error);
        showError('Lỗi khi khởi tạo permissions: ' + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {});

  if (!canRead('permissions')) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">You don't have permission to view permissions.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Permission Management</h1>
        <div className="flex space-x-2">
          <PermissionGuard resource="permissions" action="create" disableInsteadOfHide={true}>
            <button
              onClick={handleInitializeDefaults}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              Initialize Defaults
            </button>
          </PermissionGuard>
          <PermissionGuard resource="permissions" action="create" disableInsteadOfHide={true}>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add New Permission
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Permissions List */}
      <div className="bg-gray-800 rounded-lg p-6">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
              <div key={resource} className="border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 capitalize">{resource}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Action</th>
                        <th className="text-left py-2">Description</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resourcePermissions.map((permission) => (
                        <tr key={permission.id} className="border-b border-gray-700">
                          <td className="py-2">{permission.name}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              permission.action === 'create' ? 'bg-green-500' :
                              permission.action === 'read' ? 'bg-blue-500' :
                              permission.action === 'update' ? 'bg-yellow-500' :
                              permission.action === 'delete' ? 'bg-red-500' : 'bg-gray-500'
                            }`}>
                              {permission.action}
                            </span>
                          </td>
                          <td className="py-2">{permission.description}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              permission.is_active ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {permission.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-2">
                            <div className="flex space-x-2">
                              <PermissionGuard resource="permissions" action="update" disableInsteadOfHide={true}>
                                <button
                                  onClick={() => handleEdit(permission)}
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                                >
                                  Edit
                                </button>
                              </PermissionGuard>
                              <PermissionGuard resource="permissions" action="delete" disableInsteadOfHide={true}>
                                <button
                                  onClick={() => handleDelete(permission.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                >
                                  Delete
                                </button>
                              </PermissionGuard>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingPermission ? 'Edit Permission' : 'Add New Permission'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Resource</label>
                <select
                  value={formData.resource}
                  onChange={(e) => setFormData({...formData, resource: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                >
                  <option value="">Select Resource</option>
                  {resourceOptions.map(resource => (
                    <option key={resource} value={resource}>{resource}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Action</label>
                <select
                  value={formData.action}
                  onChange={(e) => setFormData({...formData, action: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                >
                  <option value="">Select Action</option>
                  {actionOptions.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingPermission ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPermissions;
