import React, { useState } from "react";
import { motion } from "framer-motion";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { usePortfolioData } from "../constants/dynamic";
import { usePortfolio } from "../context/PortfolioContext";
import ApiLoadingState from "./ApiLoadingState";
import TechCarousel from "./TechCarousel";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";

const Tech = () => {
  const { technologies } = usePortfolioData();
  const { loading } = usePortfolio();
  const [itemsPerPage, setItemsPerPage] = useState(6);

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
      <div className="flex justify-center mt-8">
        <div className="bg-tertiary rounded-lg px-6 py-3">
          <p className="text-secondary text-sm text-center">
            <span className="text-white font-bold">{technologies.length}</span>{" "}
            technologies mastered
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Tech, "tech");
