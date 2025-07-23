import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { BallCanvas } from "../canvas";
import { SectionWrapper } from "../../../../shared/hoc";
import { usePortfolioData } from "../../../../shared/constants/dynamic";
import { usePortfolio } from "../../../../shared/context/PortfolioContext";
import { ApiLoadingState } from "../../../../shared/components/UI";
import TechCarousel from "../TechCarousel";
import { styles } from "../../../../shared/styles.js";
import { textVariant } from "../../../../shared/utils/motion";

const Tech = () => {
  const { technologies } = usePortfolioData();
  const { loading } = usePortfolio();
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 450) {
        // xs screens
        setItemsPerPage(2);
      } else if (width < 640) {
        // sm screens
        setItemsPerPage(3);
      } else if (width < 768) {
        // md screens
        setItemsPerPage(4);
      } else if (width < 1024) {
        // lg screens
        setItemsPerPage(6);
      } else {
        // xl screens and above
        setItemsPerPage(8);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return <ApiLoadingState message="Loading technologies..." />;
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What I use to build amazing things</p>
        <h2 className={styles.sectionHeadText}>Technologies.</h2>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-20"
      >
        <TechCarousel itemsPerPage={itemsPerPage} />
      </motion.div>

      {/* Stats */}
      <div className="flex justify-center mt-6 sm:mt-8">
        <div className="bg-tertiary rounded-lg px-4 py-2 sm:px-6 sm:py-3 mx-4">
          <p className="text-secondary text-xs sm:text-sm text-center">
            <span className="text-white font-bold">{technologies.length}</span>{" "}
            technologies mastered
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "tech");
