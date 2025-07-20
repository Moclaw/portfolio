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
    }
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
      console.log(`🔗 Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`📦 API Response for ${endpoint}:`, data);
      
      // Check if the response has the expected structure
      if (data.success && data.data) {
        return data.data;
      }
      
      // If response structure is different but has data
      if (data.data) {
        return data.data;
      }
      
      // Return the data directly if it doesn't have wrapper
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      
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
}

export default new PortfolioAPI();
