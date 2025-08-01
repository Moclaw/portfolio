import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../../../../shared/styles.js";
import { SectionWrapper } from "../../../../shared/hoc";
import { fadeIn, textVariant } from "../../../../shared/utils/motion";
import { getFullImageUrl } from "../../../../shared/utils/urlHelper";
import { usePortfolioData } from "../../../../shared/constants/dynamic";
import { usePortfolio } from "../../../../shared/context/PortfolioContext";
import { ApiLoadingState } from "../../../../shared/components/UI";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt options={{ max: 40, scale: 1, speed: 450 }}>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col" style={{ width: '300px', height: '350px' }}>
        <motion.img
          src={getFullImageUrl(icon)}
          alt="web-development"
          className="w-16 h-16 object-contain"
          variants={fadeIn("", "", 0.1, 1)}
        />

        <motion.h3
          className="text-white text-[20px] font-bold text-center"
          variants={fadeIn("", "", 0.1, 1)}
        >
          {title}
        </motion.h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  const { services } = usePortfolioData();
  const { loading } = usePortfolio();

  if (loading) {
    return (
      <div className="mt-20">
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>Introduction</p>
          <h2 className={styles.sectionHeadText}>Overview.</h2>
        </motion.div>
        <ApiLoadingState message="Loading services..." />
      </div>
    );
  }

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-white text-[17px] max-w-3xl leading-[30px]"
      >
        I am a passionate programmer who deeply enjoys coding. Programming demands a
        lot of time, patience, and skill, but for me, it's not just a profession; it's a way of life. I
        spend most of my days either reading or writing code, and I truly love every moment
        of it!
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10 justify-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
