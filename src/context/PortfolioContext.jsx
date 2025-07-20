import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import portfolioAPI from '../services/api';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  // Enhanced fallback data
  const fallbackData = {
    services: [
      { title: "Full Stack Developer", icon: "web" },
      { title: ".NET Developer", icon: "backend" },
      { title: "Software Engineer", icon: "mobile" }
    ],
    technologies: [
      { name: "C#", icon: "csharp" },
      { name: ".NET", icon: "net" },
      { name: "React", icon: "React" },
      { name: "Docker", icon: "docker" },
      { name: "AWS", icon: "Aws" },
      { name: "MongoDB", icon: "mongodb" }
    ],
    experiences: [
      {
        title: "Full Stack Developer",
        company_name: "MaicoGroup", 
        icon: "maico",
        iconBg: "#ffffff",
        date: "Apr 2021 - Jan 2022",
        points: [
          "Engaged in ongoing communication with end users",
          "Played a pivotal role in bug reporting and user support",
          "Took charge of training new employees"
        ]
      }
    ],
    testimonials: [
      {
        id: 1,
        testimonial: "Great work on the portfolio project!",
        name: "Sara Lee",
        designation: "CFO",
        company: "Acme Co",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    projects: [
      {
        name: "Car Rent",
        description: "Web-based platform for car rentals",
        tags: [{ name: "react", color: "blue-text-gradient" }],
        image: "carrent",
        source_code_link: "https://github.com/"
      }
    ]
  };

  useEffect(() => {
    // Prevent duplicate API calls in StrictMode
    if (hasFetched.current) {
      console.log('🚫 Preventing duplicate API call');
      return;
    }

    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        setError(null);
        hasFetched.current = true;
        
        console.log('🔄 Fetching portfolio data from API...');
        
        const data = await portfolioAPI.getPortfolioData();
        
        if (data && typeof data === 'object') {
          console.log('✅ API data received:', data);
          console.log('🔍 Testimonials data:', data.testimonials);
          setPortfolioData(data);
        } else {
          console.log('⚠️  Using fallback data');
          setPortfolioData(fallbackData);
        }
        
      } catch (err) {
        console.error('❌ API Error:', err);
        setError(err.message);
        setPortfolioData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const value = {
    portfolioData: portfolioData || fallbackData,
    loading,
    error,
    refreshData: async () => {
      setLoading(true);
      try {
        const data = await portfolioAPI.getPortfolioData();
        setPortfolioData(data || fallbackData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPortfolioData(fallbackData);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
