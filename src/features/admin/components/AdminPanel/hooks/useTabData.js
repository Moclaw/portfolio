import { useState, useCallback } from 'react';
import { useAuth } from '../../../../../shared/context/AuthContext';

export const useTabData = () => {
  const [data, setData] = useState({});
  const [counts, setCounts] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const [error, setError] = useState('');
  
  const { token, API_BASE_URL } = useAuth();

  // Fetch only counts for all tabs
  const fetchCounts = useCallback(async () => {
    console.log('🔄 Fetching counts for dashboard...');
    setIsLoadingCounts(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/stats/counts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const countsData = result.data || result;
        console.log('✅ Successfully fetched counts:', countsData);
        setCounts(countsData);
      } else {
        console.error('❌ Failed to fetch counts:', response.status);
        setError('Failed to fetch counts');
      }
    } catch (error) {
      console.error('❌ Network error fetching counts:', error);
      setError('Network error occurred while fetching counts');
    } finally {
      setIsLoadingCounts(false);
    }
  }, [token, API_BASE_URL]);

  const fetchData = useCallback(async (endpoint) => {
    // Skip if no endpoint provided
    if (!endpoint) {
      console.log('❌ No endpoint provided, skipping fetch');
      return;
    }
    
    // Skip if already loading this endpoint
    if (isLoading[endpoint]) {
      console.log(`⏳ Already loading ${endpoint}, skipping`);
      return;
    }
    
    // Skip if data already exists for this endpoint (prevent unnecessary refetch)
    if (data[endpoint] && data[endpoint].length > 0) {
      console.log(`✅ Data already exists for ${endpoint}, skipping`);
      return;
    }
    
    console.log(`🔄 Starting fetch for ${endpoint}`);
    setIsLoading(prev => ({ ...prev, [endpoint]: true }));
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
        let processedData = [];

        if (endpoint === 'contacts') {
          processedData = result.data || [];
        } else if (endpoint === 'users') {
          processedData = result.users || [];
        } else if (['projects', 'experiences', 'technologies', 'services', 'testimonials'].includes(endpoint)) {
          processedData = result.data || [];
        } else {
          processedData = Array.isArray(result) ? result : result[endpoint] || [];
        }

        console.log(`✅ Successfully fetched ${endpoint} data:`, processedData.length, 'items');
        setData(prev => ({ ...prev, [endpoint]: processedData }));
      } else {
        console.error(`❌ Failed to fetch ${endpoint}:`, response.status);
        setError(`Failed to fetch ${endpoint} data`);
      }
    } catch (error) {
      console.error(`❌ Network error fetching ${endpoint}:`, error);
      setError(`Network error occurred while fetching ${endpoint}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [endpoint]: false }));
    }
  }, [token, API_BASE_URL, isLoading, data]);

  const handleCreate = useCallback(async (endpoint, itemData) => {
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
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to create item' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }, [token, API_BASE_URL, fetchData]);

  const handleUpdate = useCallback(async (endpoint, id, itemData) => {
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
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to update item' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }, [token, API_BASE_URL, fetchData]);

  const handleDelete = useCallback(async (endpoint, id) => {
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
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to delete item' };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  }, [token, API_BASE_URL, fetchData]);

  // Force refresh data for a specific endpoint (clear cache and refetch)
  const forceRefreshData = useCallback(async (endpoint) => {
    if (!endpoint) return;
    
    console.log(`🔄 Force refreshing data for ${endpoint}`);
    // Clear existing data to force refetch
    setData(prev => ({ ...prev, [endpoint]: null }));
    await fetchData(endpoint);
  }, [fetchData]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    data,
    counts,
    isLoading,
    isLoadingCounts,
    error,
    fetchData,
    fetchCounts,
    forceRefreshData,
    handleCreate,
    handleUpdate,
    handleDelete,
    clearError,
  };
};
