import React from "react";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../../../../shared/styles.js";
import { SectionWrapper } from "../../../../shared/hoc";
import { textVariant } from "../../../../shared/utils/motion";
import { getFullImageUrl } from "../../../../shared/utils/urlHelper";
import { usePortfolioData } from "../../../../shared/constants/dynamic";
import { usePortfolio } from "../../../../shared/context/PortfolioContext";
import { ApiLoadingState } from "../../../../shared/components/UI";

const ExperienceCard = ({ experience }) => {
	return (
		<VerticalTimelineElement
			contentStyle={{
				background: "#042A70",
				color: "#fff",
			}}
			contentArrowStyle={{ borderRight: "7px solid  #232631" }}
			date={experience.date}
			iconStyle={{ background: experience.iconBg }}
			icon={
				<div className='flex justify-center items-center w-full h-full'>
					<img
						src={getFullImageUrl(experience.icon)}
						alt={experience.company_name}
						className='w-[60%] h-[60%] object-contain'
					/>
				</div>
			}
		>
			<div>
				<h3 className='text-white text-[24px] font-bold'>{experience.title}</h3>
				<p
					className='text-secondary text-[16px] font-semibold'
					style={{ margin: 0 }}
				>
					{experience.company_name}
				</p>
			</div>

			<ul className='mt-5 list-disc ml-5 space-y-2'>
				{experience.points.map((point, index) => (
					<li
						key={`experience-point-${index}`}
						className='text-white-100 text-[14px] pl-1 tracking-wider'
					>
						{point}
					</li>
				))}
			</ul>
		</VerticalTimelineElement>
	);
};

const Experience = () => {
	const { experiences } = usePortfolioData();
	const { loading } = usePortfolio();
	
	if (loading) {
		return (
			<div className="mt-20">
				<motion.div variants={textVariant()}>
					<p className={`${styles.sectionSubText} text-center`}>
						What I have done so far
					</p>
					<h2 className={`${styles.sectionHeadText} text-center`}>
						Work Experience.
					</h2>
				</motion.div>
				<ApiLoadingState message="Loading work experience..." />
			</div>
		);
	}

	return (
		<>
			<motion.div variants={textVariant()}>
				<p className={`${styles.sectionSubText} text-center`}>
					What I have done so far
				</p>
				<h2 className={`${styles.sectionHeadText} text-center`}>
					Work Experience.
				</h2>
			</motion.div>

			<div className='mt-20 flex flex-col'>
				<VerticalTimeline>
					{experiences.map((experience, index) => (
						<ExperienceCard
							key={`experience-${index}`}
							experience={experience}
						/>
					))}
				</VerticalTimeline>
			</div>
		</>
	);
};

export default SectionWrapper(Experience, "work");
