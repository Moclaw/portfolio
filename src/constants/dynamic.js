import { usePortfolio } from '../context/PortfolioContext';
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

// Navigation links (static)
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
		id: "projects",
		title: "Projects",
	},
	{
		id: "contact",
		title: "Contact",
	},
];

// Hook to get dynamic data from API/context
export const usePortfolioData = () => {
	const { portfolioData } = usePortfolio();
	
	// Map API data to frontend format with fallback icons
	const iconMap = {
		'web.png': web,
		'backend.png': backend,
		'mobile.png': mobile,
		'c-sharp.png': csharp,
		'NETcore.png': net,
		'Ubuntu.png': Ubuntu,
		'RabbitMQ.png': RabbitMQ,
		'Redis.png': Redis,
		'GoogleCloud.png': GoogleCloud,
		'Jenkins.png': Jenkins,
		'Jira.png': Jira,
		'Kubernetes.png': Kubernetes,
		'React.png': React,
		'gitaction.png': GithubActions,
		'docker.png': docker,
		'AWS.png': Aws,
		'ApacheKafka.png': Kafka,
		'mongodb.png': mongodb,
		'maico.png': maico,
		'freelance.jpg': freelance,
		'levinci.svg': levinci,
		'terralogic.jfif': terralogic,
		'carrent.png': carrent,
		'jobit.png': jobit,
		'tripguide.png': tripguide,
	};

	const mapIconPath = (iconPath) => {
		if (!iconPath) return web; // default fallback
		const iconName = iconPath.split('/').pop(); // get filename
		return iconMap[iconName] || web;
	};

	const services = portfolioData?.services?.map(service => ({
		title: service.title,
		icon: mapIconPath(service.icon)
	})) || [];

	const technologies = portfolioData?.technologies?.map(tech => ({
		name: tech.name,
		icon: mapIconPath(tech.icon)
	})) || [];

	const experiences = portfolioData?.experiences?.map(exp => ({
		title: exp.title,
		company_name: exp.company_name || exp.companyName,
		icon: mapIconPath(exp.icon),
		iconBg: exp.icon_bg || exp.iconBg || "#ffffff",
		date: exp.date,
		points: exp.points || []
	})) || [];

	const testimonials = portfolioData?.testimonials
		?.filter(testimonial => testimonial.is_active !== false) // Only show active testimonials
		?.sort((a, b) => (a.order || 999) - (b.order || 999)) // Sort by order field
		?.map(testimonial => ({
			id: testimonial.id,
			testimonial: testimonial.testimonial,
			name: testimonial.name,
			designation: testimonial.designation,
			company: testimonial.company,
			image: testimonial.image,
			order: testimonial.order,
			isActive: testimonial.is_active,
			createdAt: testimonial.created_at,
			updatedAt: testimonial.updated_at
		})) || [];

	const projects = portfolioData?.projects?.map(project => ({
		name: project.name,
		description: project.description,
		tags: project.tags || [],
		image: mapIconPath(project.image),
		source_code_link: project.source_code_link || project.sourceCodeLink || "#",
		live_demo_link: project.live_demo_link || project.liveDemoLink
	})) || [];

	return {
		services,
		technologies,
		experiences,
		testimonials,
		projects
	};
};
