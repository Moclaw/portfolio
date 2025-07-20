import { useState, useEffect, useCallback } from 'react';
import portfolioAPI from '../services/api';
import {
  csharp,
  net,
  React as ReactIcon,
  docker,
  Aws,
  mongodb,
  nodejs,
  javascript,
  typescript,
  html,
  css,
  tailwind,
  threejs,
  git,
  figma,
  redux,
  reactjs,
  GoogleCloud,
  Azure,
  Cloudfare,
  DigitalOcean,
  GraphQL,
  Heroku,
  Jaeger,
  Jenkins,
  Jira,
  Kubernetes,
  Kafka,
  RabbitMQ,
  Redis,
  Ubuntu,
  GithubActions
} from '../assets';

export const useTechnologies = (initialPage = 1, initialLimit = 10) => {
  const [technologies, setTechnologies] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(initialLimit);

  // Icon mapping for fallback
  const iconMap = {
    'c-sharp.png': csharp,
    'NETcore.png': net,
    'React.png': ReactIcon,
    'docker.png': docker,
    'AWS.png': Aws,
    'mongodb.png': mongodb,
    'nodejs.png': nodejs,
    'javascript.png': javascript,
    'typescript.png': typescript,
    'html.png': html,
    'css.png': css,
    'tailwind.png': tailwind,
    'threejs.svg': threejs,
    'git.png': git,
    'figma.png': figma,
    'redux.png': redux,
    'reactjs.png': reactjs,
    'GoogleCloud.png': GoogleCloud,
    'Azure.png': Azure,
    'Cloudflare.png': Cloudfare,
    'DigitalOcean.png': DigitalOcean,
    'GraphQL.png': GraphQL,
    'Heroku.png': Heroku,
    'JaegerTracing.png': Jaeger,
    'Jenkins.png': Jenkins,
    'Jira.png': Jira,
    'Kubernetes.png': Kubernetes,
    'ApacheKafka.png': Kafka,
    'RabbitMQ.png': RabbitMQ,
    'Redis.png': Redis,
    'Ubuntu.png': Ubuntu,
    'gitaction.png': GithubActions
  };

  const mapIconPath = useCallback((iconPath) => {
    if (!iconPath) return ReactIcon;
    const iconName = iconPath.split('/').pop();
    return iconMap[iconName] || ReactIcon;
  }, []);

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
            icon: mapIconPath(tech.icon)
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
            icon: mapIconPath(tech.icon)
          })));
          setTotalPages(Math.ceil(response.length / pageLimit));
          setTotalItems(response.length);
        }
      } else {
        // Fallback data
        const fallbackTech = [
          { name: "C#", icon: csharp },
          { name: ".NET Core", icon: net },
          { name: "React", icon: ReactIcon },
          { name: "Docker", icon: docker },
          { name: "AWS", icon: Aws },
          { name: "Google Cloud", icon: GoogleCloud },
          { name: "Azure", icon: Azure },
          { name: "MongoDB", icon: mongodb },
          { name: "Node.js", icon: nodejs },
          { name: "JavaScript", icon: javascript },
          { name: "TypeScript", icon: typescript },
          { name: "HTML5", icon: html },
          { name: "CSS3", icon: css },
          { name: "Tailwind CSS", icon: tailwind },
          { name: "Three.js", icon: threejs },
          { name: "Git", icon: git },
          { name: "Figma", icon: figma },
          { name: "Redux", icon: redux },
          { name: "Kubernetes", icon: Kubernetes },
          { name: "GraphQL", icon: GraphQL },
          { name: "Jenkins", icon: Jenkins },
          { name: "Apache Kafka", icon: Kafka },
          { name: "Redis", icon: Redis },
          { name: "RabbitMQ", icon: RabbitMQ },
          { name: "Ubuntu", icon: Ubuntu },
          { name: "Heroku", icon: Heroku },
          { name: "DigitalOcean", icon: DigitalOcean },
          { name: "Cloudflare", icon: Cloudfare },
          { name: "Jaeger", icon: Jaeger },
          { name: "Jira", icon: Jira },
          { name: "GitHub Actions", icon: GithubActions }
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
  }, [currentPage, limit, mapIconPath]);

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
