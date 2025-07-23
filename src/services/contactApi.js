// Contact API service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5303';

class ContactAPI {
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
      
      // Handle the backend response structure
      if (data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message
        };
      }
      
      // Fallback for other response structures
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Success'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to send message'
      };
    }
  }

  // Submit contact form
  async submitContact(contactData) {
    return this.request('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Get contact statistics (if needed)
  async getContactStats() {
    return this.request('/api/contacts/stats');
  }
}

const contactAPI = new ContactAPI();
export default contactAPI;
