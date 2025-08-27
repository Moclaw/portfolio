import axios from 'axios';

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
    projects: { order: '/admin/projects/order' },
    experiences: { order: '/admin/experiences/order' },
    technologies: { order: '/admin/technologies/order' },
    services: { order: '/admin/services/order' },
    testimonials: { order: '/admin/testimonials/order' },
    uploads: '/admin/uploads',
    resources: '/admin/resources',
    users: '/admin/users'
  }
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle responses
apiClient.interceptors.response.use(
  (response) => {
    const { data } = response;
    
    // Handle the new backend response structure
    if (data.success) {
      // For paginated responses, return the full structure including pagination
      if (data.pagination) {
        return {
          data: data.data,
          summary: data.summary,
          pagination: data.pagination,
          message: data.message
        };
      }
      // For single item responses, just return the data
      return data.data;
    }
    
    // Fallback for legacy response structures
    return data.data || data;
  },
  (error) => {
    console.error('API Error:', error);
    return null; // Return null instead of throwing, let components handle fallbacks
  }
);

class PortfolioAPI {
  // Helper method for authenticated requests
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get all portfolio data in one request
  async getPortfolioData() {
    return apiClient.get(endpoints.portfolio);
  }

  // Individual API calls
  async getExperiences() {
    return apiClient.get(endpoints.experiences);
  }

  async getServices() {
    return apiClient.get(endpoints.services);
  }

  async getTechnologies(page = 1, limit = 10) {
    return apiClient.get(endpoints.technologies, {
      params: { page, limit }
    });
  }

  async getAllTechnologies() {
    return apiClient.get(endpoints.technologies);
  }

  async getProjects() {
    return apiClient.get(endpoints.projects);
  }

  async getTestimonials() {
    return apiClient.get(endpoints.testimonials);
  }

  // Submit contact form
  async submitContact(contactData) {
    return apiClient.post(endpoints.contacts, contactData);
  }

  // Get counts for all entities
  async getCounts() {
    return apiClient.get(endpoints.stats);
  }

  // Admin order update methods
  async updateProjectsOrder(items) {
    return apiClient.put(endpoints.admin.projects.order, { items });
  }

  async updateExperiencesOrder(items) {
    return apiClient.put(endpoints.admin.experiences.order, { items });
  }

  async updateTechnologiesOrder(items) {
    return apiClient.put(endpoints.admin.technologies.order, { items });
  }

  async updateServicesOrder(items) {
    return apiClient.put(endpoints.admin.services.order, { items });
  }

  async updateTestimonialsOrder(items) {
    return apiClient.put(endpoints.admin.testimonials.order, { items });
  }

  // Upload API methods
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post(endpoints.admin.uploads, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });
  }

  async getUploads(page = 1, limit = 10) {
    return apiClient.get(endpoints.uploads, {
      params: { page, limit }
    });
  }

  async getUploadsWithSummary(page = 1, limit = 12) {
    return apiClient.get(endpoints.uploadsWithSummary, {
      params: { page, limit }
    });
  }

  async deleteUpload(id) {
    return apiClient.delete(`${endpoints.admin.uploads}/${id}`);
  }

  // Resource API methods
  async getResources(page = 1, limit = 12, filters = {}) {
    return apiClient.get(endpoints.resources, {
      params: {
        page,
        limit,
        ...filters
      }
    });
  }

  async getResource(id) {
    return apiClient.get(`${endpoints.resources}/${id}`);
  }

  async createResource(resourceData) {
    return apiClient.post(endpoints.admin.resources, resourceData);
  }

  async updateResource(id, resourceData) {
    return apiClient.put(`${endpoints.admin.resources}/${id}`, resourceData);
  }

  async deleteResource(id) {
    return apiClient.delete(`${endpoints.admin.resources}/${id}`);
  }

  async getResourceStats() {
    return apiClient.get(`${endpoints.resources}/stats`);
  }

  async downloadResource(id) {
    return apiClient.post(`${endpoints.resources}/${id}/download`);
  }

  async refreshExpiredURLs() {
    return apiClient.post(`${endpoints.admin.resources}/refresh-urls`);
  }

  async createResourceFromUpload(uploadId, resourceData) {
    return apiClient.post(endpoints.admin.resources, {
      upload_id: uploadId,
      ...resourceData
    });
  }

  async getResourcesByType(type, page = 1, limit = 12) {
    return apiClient.get(endpoints.resources, {
      params: { type, page, limit }
    });
  }

  async searchFiles(query, filters = {}) {
    return apiClient.get(endpoints.uploads, {
      params: {
        search: query,
        page: filters.page || 1,
        limit: filters.limit || 12,
        ...filters
      }
    });
  }

  // User management methods
  async getUsers() {
    return apiClient.get(endpoints.admin.users);
  }

  async getUser(id) {
    return apiClient.get(`${endpoints.admin.users}/${id}`);
  }

  async createUser(userData) {
    return apiClient.post(endpoints.admin.users, userData);
  }

  async updateUser(id, userData) {
    return apiClient.put(`${endpoints.admin.users}/${id}`, userData);
  }

  async updateUserPassword(id, password) {
    return apiClient.patch(`${endpoints.admin.users}/${id}/password`, { password });
  }

  async deleteUser(id) {
    return apiClient.delete(`${endpoints.admin.users}/${id}`);
  }

  async toggleUserStatus(id) {
    return apiClient.patch(`${endpoints.admin.users}/${id}/toggle-status`);
  }
}

export default new PortfolioAPI();
