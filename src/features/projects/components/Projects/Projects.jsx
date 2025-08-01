import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../../../../shared/styles.js";
import { github } from "../../../../shared/assets";
import { SectionWrapper } from "../../../../shared/hoc";
import { getFullImageUrl } from "../../../../shared/utils/urlHelper";
import { usePortfolioData } from "../../../../shared/constants/dynamic";
import { fadeIn, textVariant } from "../../../../shared/utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  const isLongDesc = description.length > 120;
  const shortDesc = isLongDesc ? description.slice(0, 120) + "..." : description;

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full min-h-[480px] flex flex-col justify-between'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={getFullImageUrl(image)}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYwIiBoZWlnaHQ9IjIzMCIgdmlld0JveD0iMCAwIDM2MCAyMzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNjAiIGhlaWdodD0iMjMwIiBmaWxsPSIjMzc0MTUxIi8+CjxyZWN0IHg9IjE1MCIgeT0iOTAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzZCNzI4MCIvPgo8dGV4dCB4PSIxODAiIHk9IjEyNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOUI5Qjk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9qZWN0PC90ZXh0Pgo8L3N2Zz4K';
            }}
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={github}
                alt='source code'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col flex-1 mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px] min-h-[60px]'>
            {showFullDesc ? description : shortDesc}
            {isLongDesc && (
              <span
                className='ml-2 text-blue-400 cursor-pointer underline'
                onClick={() => setShowFullDesc((v) => !v)}
              >
                {showFullDesc ? "Show less" : "Read more"}
              </span>
            )}
          </p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Projects = () => {
  const { projects } = usePortfolioData();

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Projects, "projects");
