import { usePortfolio } from '../context/PortfolioContext';

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
	
	const services = portfolioData?.services?.map(service => ({
		title: service.title,
		icon: service.icon || '/default-web.png' // Use URL directly with fallback
	})) || [];

	const technologies = portfolioData?.technologies?.map(tech => ({
		name: tech.name,
		icon: tech.icon || '/default-tech.png' // Use URL directly with fallback
	})) || [];

	const experiences = portfolioData?.experiences?.map(exp => ({
		title: exp.title,
		company_name: exp.company_name || exp.companyName,
		icon: exp.icon || '/default-company.png', // Use URL directly with fallback
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
		image: project.image || '/default-project.png', // Use URL directly with fallback
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
