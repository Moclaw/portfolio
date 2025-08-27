import React, { useState, useEffect } from 'react';
import api from '../../../../shared/services/api';
import { useAuth } from '../../../../shared/context/AuthContext';
import { useToast } from '../../../../shared/context/ToastContext';
import { useModal } from '../../../../shared/context/ModalContext';
import PermissionGuard from '../../../../shared/components/Common/PermissionGuard';

const AdminRoles = () => {
  const { canRead, canCreate, canUpdate, canDelete } = useAuth();
  const { showSuccess, showError } = useToast();
  const { showConfirm } = useModal();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permission_ids: []
  });

  useEffect(() => {
    if (canRead('roles')) {
      fetchRoles();
      fetchPermissions();
    }
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.getRoles();
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.getPermissions();
      setPermissions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingRole) {
        await api.updateRole(editingRole.id, formData);
        showSuccess('Cập nhật role thành công!');
      } else {
        await api.createRole(formData);
        showSuccess('Tạo role thành công!');
      }
      fetchRoles();
      resetForm();
    } catch (error) {
      console.error('Error saving role:', error);
      showError('Lỗi khi lưu role: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Bạn có chắc chắn muốn xóa role này?', 'Xác nhận xóa role');
    if (confirmed) {
      try {
        await api.deleteRole(id);
        showSuccess('Xóa role thành công!');
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
        showError('Lỗi khi xóa role: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permission_ids: role.permissions ? role.permissions.map(p => p.id) : []
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permission_ids: []
    });
    setEditingRole(null);
    setShowModal(false);
  };

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter(id => id !== permissionId)
        : [...prev.permission_ids, permissionId]
    }));
  };

  // Group permissions by resource for better display
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {});

  if (!canRead('roles')) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">You don't have permission to view roles.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Role Management</h1>
        <PermissionGuard resource="roles" action="create" disableInsteadOfHide={true}>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add New Role
          </button>
        </PermissionGuard>
      </div>

      {/* Roles List */}
      <div className="bg-gray-800 rounded-lg p-6">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Permissions</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-gray-700">
                    <td className="py-2">{role.name}</td>
                    <td className="py-2">{role.description}</td>
                    <td className="py-2">
                      <span className="text-sm text-gray-400">
                        {role.permissions ? role.permissions.length : 0} permissions
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        role.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {role.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex space-x-2">
                        <PermissionGuard resource="roles" action="update" disableInsteadOfHide={true}>
                          <button
                            onClick={() => handleEdit(role)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                        </PermissionGuard>
                        <PermissionGuard resource="roles" action="delete" disableInsteadOfHide={true}>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            disabled={role.name === 'admin'} // Prevent deleting admin role
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
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingRole ? 'Edit Role' : 'Add New Role'}
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
                  disabled={editingRole && (editingRole.name === 'admin' || editingRole.name === 'user')}
                />
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
              <div className="mb-4">
                <label className="block text-white mb-2">Permissions</label>
                <div className="max-h-60 overflow-y-auto bg-gray-700 p-4 rounded">
                  {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                    <div key={resource} className="mb-4">
                      <h4 className="text-white font-semibold mb-2 capitalize">{resource}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {resourcePermissions.map((permission) => (
                          <label key={permission.id} className="flex items-center text-gray-300">
                            <input
                              type="checkbox"
                              checked={formData.permission_ids.includes(permission.id)}
                              onChange={() => handlePermissionChange(permission.id)}
                              className="mr-2"
                            />
                            {permission.action}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
                  {loading ? 'Saving...' : (editingRole ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
