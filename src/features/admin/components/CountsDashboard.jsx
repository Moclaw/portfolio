import React from 'react';
import { motion } from 'framer-motion';

const CountsCard = ({ title, count, isLoading, icon, onClick, isClickable = false }) => {
  return (
    <motion.div
      className={`group bg-black-200 rounded-xl p-6 shadow-lg border border-gray-700 transition-all duration-300 ${
        isClickable 
          ? 'cursor-pointer hover:bg-gradient-to-br hover:from-black-200 hover:to-black-200/80 hover:border-secondary hover:shadow-xl hover:shadow-secondary/20' 
          : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: isClickable ? 1.05 : 1.02,
        y: isClickable ? -2 : 0,
        transition: { duration: 0.2 }
      }}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
          <p className="text-secondary text-3xl font-bold">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              count
            )}
          </p>
          {isClickable && (
            <p className="text-gray-400 text-sm mt-2 opacity-75 group-hover:text-secondary transition-colors">
              Click to view details
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          {icon && (
            <div className={`text-4xl transition-all duration-300 ${
              isClickable 
                ? 'text-secondary opacity-50 group-hover:opacity-100 group-hover:scale-110' 
                : 'text-secondary opacity-50'
            }`}>
              {icon}
            </div>
          )}
          {isClickable && (
            <motion.svg 
              className="w-5 h-5 text-secondary opacity-50 group-hover:opacity-100 transition-all duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CountsDashboard = ({ counts = {}, isLoading = false, onNavigateToTab }) => {
  console.log('📊 CountsDashboard rendered with counts:', counts);

  const cardData = [
    {
      title: 'Projects',
      count: counts.projects || 0,
      icon: '📁',
      tabId: 'projects',
      isClickable: true
    },
    {
      title: 'Experiences',
      count: counts.experiences || 0,
      icon: '💼',
      tabId: 'experiences',
      isClickable: true
    },
    {
      title: 'Technologies',
      count: counts.technologies || 0,
      icon: '⚙️',
      tabId: 'technologies',
      isClickable: true
    },
    {
      title: 'Services',
      count: counts.services || 0,
      icon: '🛠️',
      tabId: 'services',
      isClickable: true
    },
    {
      title: 'Testimonials',
      count: counts.testimonials || 0,
      icon: '💬',
      tabId: 'testimonials',
      isClickable: true
    },
    {
      title: 'Total Contacts',
      count: counts.contacts || 0,
      icon: '📞',
      tabId: 'contacts',
      isClickable: true
    },
    {
      title: 'Unread Contacts',
      count: counts.unread_contacts || 0,
      icon: '🔔',
      tabId: 'contacts',
      isClickable: true
    }
  ];

  const handleCardClick = (tabId) => {
    if (onNavigateToTab && tabId) {
      console.log(`🔄 Navigating to tab: ${tabId}`);
      onNavigateToTab(tabId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white text-2xl font-bold">Dashboard Overview</h2>
          <p className="text-secondary text-sm mt-1">
            Click on any card to manage that content type
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <CountsCard
            key={card.title}
            title={card.title}
            count={card.count}
            isLoading={isLoading}
            icon={card.icon}
            isClickable={card.isClickable}
            onClick={() => card.isClickable && handleCardClick(card.tabId)}
          />
        ))}
      </div>

      <div className="text-center text-secondary text-sm">
        Data refreshes automatically when you make changes
      </div>
    </div>
  );
};

export default CountsDashboard;
