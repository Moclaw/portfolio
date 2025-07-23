// API service for portfolio frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5303';

// API endpoints
const endpoints = {
  portfolio: '/api/portfolio',
  experiences: '/api/experiences',
  services: '/api/services',
  technologies: '/api/technologies',
  projects: '/api/projects',
  testimonials: '/api/testimonials',
  contacts: '/api/contacts',
  stats: '/api/stats/counts',
  uploads: '/api/v1/uploads',
  uploadsWithSummary: '/api/v1/uploads/summary',
  resources: '/api/v1/resources',
  admin: {
    projects: {
      order: '/admin/projects/order'
    },
    experiences: {
      order: '/admin/experiences/order'
    },
    technologies: {
      order: '/admin/technologies/order'
    },
    services: {
      order: '/admin/services/order'
    },
    testimonials: {
      order: '/admin/testimonials/order'
    },
    uploads: '/admin/uploads',
    resources: '/admin/resources',
    users: '/admin/users'
  }
};

class PortfolioAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle the new backend response structure
      if (data.success) {
        // For paginated responses, return the full structure including pagination
        if (data.pagination) {
          return {
            data: data.data,
            summary: data.summary, // Include summary data
            pagination: data.pagination,
            message: data.message
          };
        }
        // For single item responses, just return the data
        return data.data;
      }
      
      // Fallback for legacy response structures
      if (data.data) {
        return data.data;
      }
      
      // Return the data directly if it doesn't have wrapper
      return data;
    } catch (error) {
      // Return null instead of throwing, let components handle fallbacks
      return null;
    }
  }

  // Get all portfolio data in one request
  async getPortfolioData() {
    return this.request(endpoints.portfolio);
  }

  // Individual API calls
  async getExperiences() {
    return this.request(endpoints.experiences);
  }

  async getServices() {
    return this.request(endpoints.services);
  }

  async getTechnologies(page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    return this.request(`${endpoints.technologies}?${params}`);
  }

  async getAllTechnologies() {
    return this.request(endpoints.technologies);
  }

  async getProjects() {
    return this.request(endpoints.projects);
  }

  async getTestimonials() {
    return this.request(endpoints.testimonials);
  }

  // Submit contact form
  async submitContact(contactData) {
    return this.request(endpoints.contacts, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Get counts for all entities
  async getCounts() {
    return this.request(endpoints.stats);
  }

  // Admin order update methods
  async updateProjectsOrder(items) {
    const token = localStorage.getItem('token');
    return this.request(endpoints.admin.projects.order, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ items }),
    });
  }

  async updateExperiencesOrder(items) {
    const token = localStorage.getItem('token');
    return this.request(endpoints.admin.experiences.order, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ items }),
    });
  }

  async updateTechnologiesOrder(items) {
    const token = localStorage.getItem('token');
    return this.request(endpoints.admin.technologies.order, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ items }),
    });
  }

  async updateServicesOrder(items) {
    const token = localStorage.getItem('token');
    return this.request(endpoints.admin.services.order, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ items }),
    });
  }

  async updateTestimonialsOrder(items) {
    const token = localStorage.getItem('token');
    return this.request(endpoints.admin.testimonials.order, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ items }),
    });
  }

  // Upload API methods
  async uploadFile(file, onProgress) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            // Handle the new backend response structure
            if (response.success && response.data) {
              resolve(response.data);
            } else if (response.data) {
              resolve(response.data);
            } else {
              resolve(response);
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error occurred'));
      };

      xhr.open('POST', `${this.baseURL}${endpoints.admin.uploads}`);
      xhr.setRequestHeader('Authorization', token ? `Bearer ${token}` : '');
      xhr.send(formData);
    });
  }

  async getUploads(page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    return this.request(`${endpoints.uploads}?${params}`);
  }

  async getUploadsWithSummary(page = 1, limit = 12) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    return this.request(`${endpoints.uploadsWithSummary}?${params}`);
  }

  async deleteUpload(id) {
    const token = localStorage.getItem('token');
    return this.request(`${endpoints.admin.uploads}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
  }

  // Resource API methods
  async getResources(page = 1, limit = 12, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    return this.request(`${endpoints.resources}?${params}`);
  }

  async getResource(id) {
    return this.request(`${endpoints.resources}/${id}`);
  }

  async createResource(resourceData) {
    const token = localStorage.getItem('token');
    return this.request(endpoints.admin.resources, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(resourceData),
    });
  }

  async updateResource(id, resourceData) {
    const token = localStorage.getItem('token');
    return this.request(`${endpoints.admin.resources}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(resourceData),
    });
  }

  async deleteResource(id) {
    const token = localStorage.getItem('token');
    return this.request(`${endpoints.admin.resources}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
  }

  async getResourceStats() {
    return this.request(`${endpoints.resources}/stats`);
  }

  async downloadResource(id) {
    return this.request(`${endpoints.resources}/${id}/download`, {
      method: 'POST',
    });
  }

  async refreshExpiredURLs() {
    const token = localStorage.getItem('token');
    return this.request(`${endpoints.admin.resources}/refresh-urls`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
  }

  // Enhanced resource methods for file management
  async createResourceFromUpload(uploadId, resourceData) {
    const token = localStorage.getItem('token');
    return this.request(endpoints.admin.resources, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        upload_id: uploadId,
        ...resourceData
      }),
    });
  }

  async getResourcesByType(type, page = 1, limit = 12) {
    const params = new URLSearchParams({
      type: type,
      page: page.toString(),
      limit: limit.toString()
    });
    return this.request(`${endpoints.resources}?${params}`);
  }

  async searchFiles(query, filters = {}) {
    const params = new URLSearchParams({
      search: query,
      page: (filters.page || 1).toString(),
      limit: (filters.limit || 12).toString()
    });

    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);

    return this.request(`${endpoints.uploads}?${params}`);
  }

  // User management methods
  async getUsers() {
    return this.request(endpoints.admin.users);
  }

  async createUser(userData) {
    return this.request(endpoints.admin.users, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(userId, userData) {
    return this.request(`${endpoints.admin.users}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async updateUserPassword(userId, newPassword) {
    return this.request(`${endpoints.admin.users}/${userId}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password: newPassword })
    });
  }

  async deleteUser(userId) {
    return this.request(`${endpoints.admin.users}/${userId}`, {
      method: 'DELETE'
    });
  }

  async toggleUserStatus(userId) {
    return this.request(`${endpoints.admin.users}/${userId}/toggle-status`, {
      method: 'PATCH'
    });
  }

  // User management methods
  async getUsers() {
    return this.request(endpoints.admin.users);
  }

  async getUser(id) {
    return this.request(`${endpoints.admin.users}/${id}`);
  }

  async createUser(userData) {
    return this.request(endpoints.admin.users, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id, userData) {
    return this.request(`${endpoints.admin.users}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async updateUserPassword(id, password) {
    return this.request(`${endpoints.admin.users}/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password })
    });
  }

  async deleteUser(id) {
    return this.request(`${endpoints.admin.users}/${id}`, {
      method: 'DELETE'
    });
  }

  async toggleUserStatus(id) {
    return this.request(`${endpoints.admin.users}/${id}/toggle-status`, {
      method: 'PATCH'
    });
  }
}

export default new PortfolioAPI();
