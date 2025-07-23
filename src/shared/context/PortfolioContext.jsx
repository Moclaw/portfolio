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
      return;
    }

    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        setError(null);
        hasFetched.current = true;
        
        // Fetch all data from individual API endpoints
        const [services, technologies, experiences, projects, testimonials] = await Promise.all([
          portfolioAPI.getServices(),
          portfolioAPI.getAllTechnologies(),
          portfolioAPI.getExperiences(),
          portfolioAPI.getProjects(),
          portfolioAPI.getTestimonials()
        ]);

        const data = {
          services: services || fallbackData.services,
          technologies: technologies || fallbackData.technologies,
          experiences: experiences || fallbackData.experiences,
          projects: projects || fallbackData.projects,
          testimonials: testimonials || fallbackData.testimonials
        };
        
        if (data && typeof data === 'object') {
          setPortfolioData(data);
        } else {
          setPortfolioData(fallbackData);
        }
        
      } catch (err) {
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
        const [services, technologies, experiences, projects, testimonials] = await Promise.all([
          portfolioAPI.getServices(),
          portfolioAPI.getAllTechnologies(),
          portfolioAPI.getExperiences(),
          portfolioAPI.getProjects(),
          portfolioAPI.getTestimonials()
        ]);

        const data = {
          services: services || fallbackData.services,
          technologies: technologies || fallbackData.technologies,
          experiences: experiences || fallbackData.experiences,
          projects: projects || fallbackData.projects,
          testimonials: testimonials || fallbackData.testimonials
        };

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
