import {
	mobile,
	backend,
	web,
	carrent,
	jobit,
	tripguide,
	maico,
	freelance,
	terralogic,
	levinci,
	csharp,
	net,
	Ubuntu,
	RabbitMQ,
	Redis,
	GoogleCloud,
	Jenkins,
	Jira,
	Kubernetes,
	React,
	GithubActions,
	docker,
	Aws,
	Kafka,
	mongodb

} from "../assets";

export const navLinks = [
	{
		id: "about",
		title: "About",
	},
	{
		id: "work",
		title: "Work",
	},
	{
		id: "contact",
		title: "Contact",
	},
];

const services = [
	{
		title: "Full Stack Developer",
		icon: web,
	},
	{
		title: ".NET Developer",
		icon: backend,
	},
	{
		title: "Software Engineer",
		icon: mobile,
	},
];

const technologies = [
	{
		name: "C#",
		icon: csharp,
	},
	{
		name: ".NET",
		icon: net,
	},
	{
		name: "Ubuntu",
		icon: Ubuntu,
	},
	{
		name: "RabbitMQ",
		icon: RabbitMQ,
	},
	{
		name: "Redis",
		icon: Redis,
	},
	{
		name: "Google Cloud",
		icon: GoogleCloud,
	},
	{
		name: "Jenkins",
		icon: Jenkins,
	},
	{
		name: "Jira",
		icon: Jira,
	},
	{
		name: "Kubernetes",
		icon: Kubernetes,
	},
	{
		name: "React",
		icon: React,
	},
	{
		name: "Github Actions",
		icon: GithubActions,
	},
	{
		name: "Docker",
		icon: docker,
	},
	{
		name: "AWS",
		icon: Aws,
	},
	{
		name: "Kafka",
		icon: Kafka,
	},
	{
		name: "MongoDB",
		icon: mongodb,
	},


];

const experiences = [
	{
		title: "Full Stack Developer",
		company_name: "MaicoGroup",
		icon: maico,
		iconBg: "#ffffff",
		date: "Apr 2021 - Jan 2022",
		points: [
			"Engaged in ongoing communication with end users to gather feedback and requirements, ensuring project updates were tailored to user needs and preferences.",
			"Played a pivotal role in bug reporting and user support, actively addressing issues and ensuring a seamless user experience throughout software usage.",
			"Took charge of training new employees on software development processes and best practices, contributing to the growth and efficiency of the team.",
			"Participating in code reviews and providing constructive feedback to other developers.",
		],
	},
	{
		title: "Full Stack Developer",
		company_name: "Freelance",
		icon: freelance,
		iconBg: "#ffffff",
		date: "Jan 2022 - Aug 2022",
		points: [
			"Communicated with clients to understand requirements for custom software projects",
			"Developed and implemented custom software solutions for two clients, resulting in tangible benefits and enhanced performance",
			"Ensured client satisfaction through effective follow-up and support.",
		],
	},
	{
		title: "Software Engineer",
		company_name: "Levinci Co., Ltd",
		icon: levinci,
		iconBg: "#ffffff",
		date: "Jan 2022 - Aug 2023",
		points: [
			"Managed two critical ERP projects for finance and employee management.",
			"Implemented comprehensive project management plans, ensuring successful goal achievement for numerous clients.",
			"Utilized modern ERP technologies for increased efficiency and accuracy.",
			"Delivered tailored solutions with a customer-focused approach.",
		],
	},
	{
		title: "Software Engineer",
		company_name: "Terralogic",
		icon: terralogic,
		iconBg: "#ffffff",
		date: "Aug 2023 - Present",
		points: [
			"Facilitated effective communication with international colleagues to ensure project alignment.",
			"Developed and structured base code and module components, contributing to the project's architecture for optimal system performance.",
			"Conducted code reviews, providing constructive feedback and innovative solutions.",
			"Actively contributed to continuous improvement initiatives and fostered a collaborative team environment.",
			"Embraced learning opportunities to stay updated with the latest technologies and best practices."
		],
	},
];

const testimonials = [
	{
		testimonial:
			"I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
		name: "Sara Lee",
		designation: "CFO",
		company: "Acme Co",
		image: "https://randomuser.me/api/portraits/women/4.jpg",
	},
	{
		testimonial:
			"I've never met a web developer who truly cares about their clients' success like Rick does.",
		name: "Chris Brown",
		designation: "COO",
		company: "DEF Corp",
		image: "https://randomuser.me/api/portraits/men/5.jpg",
	},
	{
		testimonial:
			"After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
		name: "Lisa Wang",
		designation: "CTO",
		company: "456 Enterprises",
		image: "https://randomuser.me/api/portraits/women/6.jpg",
	},
];

const projects = [
	{
		name: "Car Rent",
		description:
			"Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
		tags: [
			{
				name: "react",
				color: "blue-text-gradient",
			},
			{
				name: "mongodb",
				color: "green-text-gradient",
			},
			{
				name: "tailwind",
				color: "pink-text-gradient",
			},
		],
		image: carrent,
		source_code_link: "https://github.com/",
	},
	{
		name: "Job IT",
		description:
			"Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
		tags: [
			{
				name: "react",
				color: "blue-text-gradient",
			},
			{
				name: "restapi",
				color: "green-text-gradient",
			},
			{
				name: "scss",
				color: "pink-text-gradient",
			},
		],
		image: jobit,
		source_code_link: "https://github.com/",
	},
	{
		name: "Trip Guide",
		description:
			"A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
		tags: [
			{
				name: "nextjs",
				color: "blue-text-gradient",
			},
			{
				name: "supabase",
				color: "green-text-gradient",
			},
			{
				name: "css",
				color: "pink-text-gradient",
			},
		],
		image: tripguide,
		source_code_link: "https://github.com/",
	},
];

export { services, technologies, experiences, testimonials, projects };
