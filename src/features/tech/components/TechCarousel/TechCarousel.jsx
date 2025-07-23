import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { BallCanvas } from "../canvas";
import { useTechnologies } from "../../../../shared/hooks/useTechnologies";
import { ApiLoadingState } from "../../../../shared/components/UI";

const TechCarousel = ({ itemsPerPage = 8 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responsiveItemsPerPage, setResponsiveItemsPerPage] = useState(itemsPerPage);

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Mobile screens (phones)
        setResponsiveItemsPerPage(3);
      } else {
        // Medium and large screens (tablets, desktops)
        setResponsiveItemsPerPage(10);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    technologies,
    loading,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    refresh,
  } = useTechnologies(1, responsiveItemsPerPage);

  // Auto-rotate carousel every 0.5 seconds
  useEffect(() => {
    if (technologies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + 1) % Math.max(1, technologies.length - responsiveItemsPerPage + 1)
      );
    }, 3000); 

    return () => clearInterval(interval);
  }, [technologies.length, responsiveItemsPerPage]);

  // Reset carousel index when page changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentPage]);

  const visibleTechnologies = useMemo(() => {
    return technologies.slice(
      currentIndex,
      currentIndex + Math.min(responsiveItemsPerPage, technologies.length)
    );
  }, [technologies, currentIndex, responsiveItemsPerPage]);

  // Calculate visible page numbers for pagination
  const getVisiblePages = useMemo(() => {
    const width = window.innerWidth;
    const maxVisiblePages = width < 640 ? 3 : 7; // Show 3 pages on small screens, 7 on larger
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (currentPage <= halfVisible + 1) {
      // Show first pages + ellipsis + last page
      for (let i = 1; i <= maxVisiblePages - 2; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - halfVisible) {
      // Show first page + ellipsis + last pages
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - (maxVisiblePages - 3); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page + ellipsis + middle pages + ellipsis + last page
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, currentPage]);

  if (loading) {
    return <ApiLoadingState message="Loading technologies..." />;
  }

  if (error) {
    return (
      <div className="text-center text-red-400">
        <p>Error loading technologies: {error}</p>
        <button
          onClick={refresh}
          className="mt-2 px-4 py-2 bg-[#915EFF] text-white rounded hover:bg-[#7c3aed] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden px-4 sm:px-0">
        <motion.div
          className="flex gap-2 sm:gap-4 md:gap-6 justify-center items-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px]"
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {visibleTechnologies.map((technology, index) => (
            <motion.div
              key={`tech-${technology.name}-${currentIndex}-${index}`}
              className="flex-shrink-0 w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 relative" key={`canvas-${technology.name}-${currentIndex}`}>
                <BallCanvas icon={technology.icon} />
              </div>
              <p className="text-white text-[10px] xs:text-[11px] sm:text-[12px] text-center mt-1 sm:mt-2 font-medium leading-tight max-w-full truncate px-1">
                {technology.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Page Navigation */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 sm:mt-6 gap-2 sm:gap-4 px-4">
          <button
            onClick={prevPage}
            className="px-2 py-2 sm:px-4 sm:py-2 bg-tertiary text-white rounded hover:bg-[#151030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasPrevPage}
            aria-label="Previous page"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex gap-1 sm:gap-2 max-w-[200px] sm:max-w-none overflow-x-auto scrollbar-hide">
            {getVisiblePages.map((page, index) => (
              <button
                key={`page-${page}-${index}`}
                onClick={() => page !== '...' && goToPage(page)}
                disabled={page === '...'}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-xs sm:text-sm flex-shrink-0 ${
                  page === '...'
                    ? "bg-transparent text-secondary cursor-default"
                    : currentPage === page
                    ? "bg-[#915EFF] text-white"
                    : "bg-tertiary text-secondary hover:text-white"
                } transition-colors`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={nextPage}
            className="px-2 py-2 sm:px-4 sm:py-2 bg-tertiary text-white rounded hover:bg-[#151030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasNextPage}
            aria-label="Next page"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Slide Indicators */}
      {technologies.length > responsiveItemsPerPage && (
        <div className="flex justify-center mt-3 sm:mt-4 gap-1 sm:gap-2 px-4">
          {Array.from(
            {
              length: Math.max(1, technologies.length - responsiveItemsPerPage + 1),
            },
            (_, i) => i
          ).map((index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                currentIndex === index ? "bg-[#915EFF]" : "bg-secondary"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default TechCarousel;
