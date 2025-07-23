import { useState, useEffect, useCallback } from 'react';
import portfolioAPI from '../services/api';

export const useTechnologies = (initialPage = 1, initialLimit = 10) => {
  const [technologies, setTechnologies] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(initialLimit);

  const fetchTechnologies = useCallback(async (page = currentPage, pageLimit = limit) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await portfolioAPI.getTechnologies(page, pageLimit);
      
      if (response) {
        // Handle paginated response
        if (response.technologies && response.pagination) {
          setTechnologies(response.technologies.map(tech => ({
            ...tech,
            icon: tech.icon || '/default-tech.png' // Use URL directly with fallback
          })));
          setTotalPages(response.pagination.totalPages);
          setTotalItems(response.pagination.totalItems);
        } 
        // Handle array response (fallback)
        else if (Array.isArray(response)) {
          const startIndex = (page - 1) * pageLimit;
          const endIndex = startIndex + pageLimit;
          const paginatedData = response.slice(startIndex, endIndex);
          
          setTechnologies(paginatedData.map(tech => ({
            ...tech,
            icon: tech.icon || '/default-tech.png' // Use URL directly with fallback
          })));
          setTotalPages(Math.ceil(response.length / pageLimit));
          setTotalItems(response.length);
        }
      } else {
        // Fallback data
        const fallbackTech = [
          { name: "C#", icon: "/default-tech.png" },
          { name: ".NET Core", icon: "/default-tech.png" },
          { name: "React", icon: "/default-tech.png" },
          { name: "Docker", icon: "/default-tech.png" },
          { name: "AWS", icon: "/default-tech.png" },
          { name: "Google Cloud", icon: "/default-tech.png" },
          { name: "Azure", icon: "/default-tech.png" },
          { name: "MongoDB", icon: "/default-tech.png" },
          { name: "Node.js", icon: "/default-tech.png" },
          { name: "JavaScript", icon: "/default-tech.png" },
          { name: "TypeScript", icon: "/default-tech.png" },
          { name: "HTML5", icon: "/default-tech.png" },
          { name: "CSS3", icon: "/default-tech.png" },
          { name: "Tailwind CSS", icon: "/default-tech.png" },
          { name: "Three.js", icon: "/default-tech.png" },
          { name: "Git", icon: "/default-tech.png" },
          { name: "Figma", icon: "/default-tech.png" },
          { name: "Redux", icon: "/default-tech.png" },
          { name: "Kubernetes", icon: "/default-tech.png" },
          { name: "GraphQL", icon: "/default-tech.png" },
          { name: "Jenkins", icon: "/default-tech.png" },
          { name: "Apache Kafka", icon: "/default-tech.png" },
          { name: "Redis", icon: "/default-tech.png" },
          { name: "RabbitMQ", icon: "/default-tech.png" },
          { name: "Ubuntu", icon: "/default-tech.png" },
          { name: "Heroku", icon: "/default-tech.png" },
          { name: "DigitalOcean", icon: "/default-tech.png" },
          { name: "Cloudflare", icon: "/default-tech.png" },
          { name: "Jaeger", icon: "/default-tech.png" },
          { name: "Jira", icon: "/default-tech.png" },
          { name: "GitHub Actions", icon: "/default-tech.png" }
        ];
        
        const startIndex = (page - 1) * pageLimit;
        const endIndex = startIndex + pageLimit;
        const paginatedData = fallbackTech.slice(startIndex, endIndex);
        
        setTechnologies(paginatedData);
        setTotalPages(Math.ceil(fallbackTech.length / pageLimit));
        setTotalItems(fallbackTech.length);
      }
    } catch (err) {
      console.error('Error fetching technologies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  }, [currentPage, totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  }, []);

  const refresh = useCallback(() => {
    fetchTechnologies(currentPage, limit);
  }, [fetchTechnologies, currentPage, limit]);

  return {
    // Data
    technologies,
    totalItems,
    
    // Pagination
    currentPage,
    totalPages,
    limit,
    
    // State
    loading,
    error,
    
    // Actions
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    refresh,
    
    // Helper values
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startIndex: (currentPage - 1) * limit + 1,
    endIndex: Math.min(currentPage * limit, totalItems)
  };
};
