import React from 'react';
import { motion } from 'framer-motion';

const TechBallFallback = ({ name, icon, className = "" }) => {
  // Extract initials from name for display
  const getInitials = (name) => {
    if (!name) return 'T';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <motion.div 
      className={`w-24 h-24 flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.1, rotateY: 180 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg border border-white/10">
        <span className="text-white text-sm font-bold">
          {getInitials(name)}
        </span>
      </div>
    </motion.div>
  );
};

export default TechBallFallback;
