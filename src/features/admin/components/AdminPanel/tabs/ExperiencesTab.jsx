import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getImagePath } from '../utils/tabConfigs';

const ExperiencesTab = ({ 
  data, 
  isLoading, 
  error, 
  onFetchData, 
  onEdit, 
  onDelete, 
  onItemClick 
}) => {
  const experiences = data.experiences || [];

  useEffect(() => {
    if (!experiences.length && !isLoading.experiences) {
      onFetchData('experiences');
    }
  }, [experiences.length, isLoading.experiences, onFetchData]);

  if (isLoading.experiences) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-2">Error loading experiences</div>
        <div className="text-secondary text-sm">{error}</div>
        <button
          onClick={() => onFetchData('experiences')}
          className="mt-4 bg-secondary hover:bg-secondary/80 text-white px-6 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-secondary text-lg mb-4">No experiences found</div>
      </div>
    );
  }

  const renderExperiencePreview = (experience) => (
    <div className="flex gap-3">
      {experience.icon && (
        <div className="flex-shrink-0">
          <div 
            className="w-16 h-16 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: experience.icon_bg || '#ffffff' }}
          >
            <img 
              src={getImagePath(experience.icon, 'company')} 
              alt={experience.company_name} 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-white font-semibold text-lg mb-1">{experience.title}</h3>
        <p className="text-secondary font-medium mb-2">{experience.company_name}</p>
        <div className="flex gap-2 text-sm text-secondary mb-2">
          <span className="bg-secondary/20 px-2 py-1 rounded text-xs">{experience.date}</span>
          <span className={`px-2 py-1 rounded text-xs ${experience.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {experience.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        {experience.points && experience.points.length > 0 && (
          <p className="text-secondary text-sm line-clamp-2">{experience.points[0]}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-4">
      {experiences.map(experience => (
        <motion.div
          key={experience.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-lg p-4 cursor-pointer hover:bg-primary/80 transition-colors border border-gray-700 hover:border-secondary/50"
          onClick={() => onItemClick(experience)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {renderExperiencePreview(experience)}
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(experience);
                }}
                className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400/10 transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete('experiences', experience.id);
                }}
                className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ExperiencesTab;
