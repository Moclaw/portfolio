import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { BallCanvas } from "./canvas";
import { useTechnologies } from "../hooks/useTechnologies";
import ApiLoadingState from "./ApiLoadingState";

const TechCarousel = ({ itemsPerPage = 8 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
  } = useTechnologies(1, itemsPerPage);

  // Auto-rotate carousel
  useEffect(() => {
    if (technologies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + 1) % Math.max(1, technologies.length - itemsPerPage + 1)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [technologies.length, itemsPerPage]);

  // Reset carousel index when page changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentPage]);

  const nextSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex + 1) % Math.max(1, technologies.length - itemsPerPage + 1)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, technologies.length - itemsPerPage)
        : prevIndex - 1
    );
  };

  const visibleTechnologies = useMemo(() => {
    return technologies.slice(
      currentIndex,
      currentIndex + Math.min(itemsPerPage, technologies.length)
    );
  }, [technologies, currentIndex, itemsPerPage]);

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
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6 justify-center items-center min-h-[200px]"
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {visibleTechnologies.map((technology, index) => (
            <motion.div
              key={`tech-${technology.name}-${currentIndex}-${index}`}
              className="flex-shrink-0 w-32 h-32 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-24 h-24 relative" key={`canvas-${technology.name}-${currentIndex}`}>
                <BallCanvas icon={technology.icon} />
              </div>
              <p className="text-white text-[12px] text-center mt-2 font-medium leading-tight">
                {technology.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Page Navigation */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={prevPage}
            className="px-4 py-2 bg-tertiary text-white rounded hover:bg-[#151030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasPrevPage}
          >
            <svg
              className="w-5 h-5"
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

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 rounded ${
                  currentPage === page
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
            className="px-4 py-2 bg-tertiary text-white rounded hover:bg-[#151030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasNextPage}
          >
            <svg
              className="w-5 h-5"
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
      {technologies.length > itemsPerPage && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from(
            {
              length: Math.max(1, technologies.length - itemsPerPage + 1),
            },
            (_, i) => i
          ).map((index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? "bg-[#915EFF]" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default TechCarousel;
