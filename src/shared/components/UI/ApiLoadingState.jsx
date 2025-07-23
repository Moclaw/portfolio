import React from 'react';
import { motion } from 'framer-motion';

const APILoader = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <motion.div
        className="w-12 h-12 border-4 border-[#915EFF] border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

const LoadingCard = ({ width = "w-full", height = "h-48" }) => {
  return (
    <div className={`${width} ${height} bg-tertiary rounded-2xl animate-pulse p-4`}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-600 rounded w-5/6"></div>
      </div>
    </div>
  );
};

const ApiLoadingState = ({ type = "spinner", message = "Loading data...", className = "" }) => {
  if (type === "card") {
    return <LoadingCard className={className} />;
  }

  return (
    <div className={`flex flex-col justify-center items-center py-8 ${className}`}>
      <APILoader />
      {message && (
        <motion.p
          className="text-white-100 text-[16px] mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default ApiLoadingState;
