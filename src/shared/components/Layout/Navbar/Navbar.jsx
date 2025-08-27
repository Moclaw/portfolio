import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { styles } from "../../../styles.js";
import { navLinks } from "../../../constants/constants";
import { logo, menu, close } from "../../../assets";
import { useAuth } from "../../../context/AuthContext";
import { AuthModal } from "../../UI";

const Navbar = () => {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [shouldCollapse, setShouldCollapse] = useState(false);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authModalMode, setAuthModalMode] = useState('login');
	const [isMobile, setIsMobile] = useState(false);
	const navRef = useRef(null);
	const menuRef = useRef(null);

	const { user, isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			if (scrollTop > 100) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Kiểm tra xem menu có bị tràn không
	useEffect(() => {
		const checkNavOverflow = () => {
			// Update mobile state
			setIsMobile(window.innerWidth < 768);
			
			if (navRef.current && menuRef.current) {
				const navWidth = navRef.current.offsetWidth;
				const menuWidth = menuRef.current.scrollWidth;
				const logoWidth = window.innerWidth < 640 ? 180 : 250; // Responsive logo width
				
				// Auth buttons width: varies by screen size and auth state
				const authButtonsWidth = (() => {
					if (window.innerWidth < 640) {
						// Mobile: always collapse auth buttons
						return 120; 
					}
					if (window.innerWidth < 768) {
						// Tablet
						return isAuthenticated ? 280 : 180; 
					}
					if (window.innerWidth < 1024) {
						// Small desktop
						return isAuthenticated ? (user?.username ? 380 : 280) : 220; 
					}
					// Large desktop
					return isAuthenticated ? (user?.username ? 420 : 320) : 250; 
				})();
				
				const padding = window.innerWidth < 640 ? 60 : 120; // Responsive padding
				
				// Nếu menu + logo + auth buttons + padding > nav width thì collapse
				setShouldCollapse(menuWidth + logoWidth + authButtonsWidth + padding > navWidth);
			}
		};

		// Delay để đảm bảo DOM đã render
		const timeoutId = setTimeout(checkNavOverflow, 100);
		
		window.addEventListener("resize", checkNavOverflow);

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener("resize", checkNavOverflow);
		};
	}, [isAuthenticated, user]); // Add user as dependency since username affects width

	return (
		<nav
			ref={navRef}
			className={`${styles.paddingX} w-full flex items-center py-3 xs:py-4 sm:py-5 fixed top-0 z-20 transition-all duration-300 ${
				scrolled ? "bg-primary/95 backdrop-blur-sm shadow-lg" : "bg-transparent/20 backdrop-blur-sm"
			}`}
		>
			<div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
				<Link
					to='/'
					className='flex items-center gap-2'
					onClick={() => {
						setActive("");
						window.scrollTo(0, 0);
					}}
				>
					<img src={logo} alt='logo' className='w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 object-contain' />
					<p className='text-white text-[14px] xs:text-[16px] sm:text-[18px] font-bold cursor-pointer flex '>
						Moclaw &nbsp;
						<span className='hidden xs:hidden sm:block md:block'> | Software Engineer</span>
					</p>
				</Link>

				{/* Desktop Menu */}
				<div className="flex items-center gap-4">
					<ul 
						ref={menuRef}
						className={`list-none ${shouldCollapse ? 'hidden' : 'flex'} flex-row gap-3 md:gap-6 lg:gap-8 xl:gap-10`}
					>
						{navLinks.map((nav) => (
							<li
								key={nav.id}
								className={`${
									active === nav.title ? "text-white" : "text-secondary"
								} hover:text-white text-[14px] md:text-[16px] lg:text-[18px] font-medium cursor-pointer transition-colors duration-200 whitespace-nowrap`}
								onClick={() => setActive(nav.title)}
							>
								<a href={`#${nav.id}`}>{nav.title}</a>
							</li>
						))}
					</ul>

					{/* Auth Section */}
					<div className={`${shouldCollapse ? 'hidden' : 'flex'} items-center gap-1 md:gap-2 lg:gap-3`}>
						{isAuthenticated ? (
							<div className="flex items-center gap-1 md:gap-2 lg:gap-3">
								{user && (
									<span className="text-secondary text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] hidden md:block">
										Hello, <span className="text-white font-medium">{user.username}</span>
									</span>
								)}
								{location.pathname === '/admin' && (
									<Link
										to="/"
										className="bg-white/10 hover:bg-white/20 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] font-medium transition-colors border border-white/20"
									>
										Portfolio
									</Link>
								)}
								{user?.role === 'admin' && location.pathname !== '/admin' && (
									<Link
										to="/admin"
										className="bg-white/10 hover:bg-white/20 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] font-medium transition-colors border border-white/20"
									>
										Admin
									</Link>
								)}
								<button
									onClick={() => {
										logout();
										if (location.pathname === '/admin') {
											navigate('/');
										}
									}}
									className="bg-red-600/80 hover:bg-red-600 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] font-medium transition-colors"
								>
									Logout
								</button>
							</div>
						) : (
							<div className="flex items-center gap-1 md:gap-2">
								<button
									onClick={() => {
										setAuthModalMode('login');
										setAuthModalOpen(true);
									}}
									className="text-secondary hover:text-white px-2 py-1.5 md:px-3 md:py-2 text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] font-medium transition-colors"
								>
									Login
								</button>
								<button
									onClick={() => {
										setAuthModalMode('signup');
										setAuthModalOpen(true);
									}}
									className="bg-white/10 hover:bg-white/20 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] font-medium transition-colors border border-white/20"
								>
									Sign Up
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Mobile Menu Button - Show when collapsed or on mobile */}
				<div className={`${shouldCollapse || isMobile ? 'flex' : 'hidden'} flex-1 justify-end items-center`}>
					<img
						src={toggle ? close : menu}
						alt='menu'
						className='w-[24px] h-[24px] xs:w-[26px] xs:h-[26px] sm:w-[28px] sm:h-[28px] object-contain cursor-pointer hover:opacity-80 transition-opacity'
						onClick={() => setToggle(!toggle)}
					/>

					{/* Mobile Menu Dropdown */}
					<div
						className={`${
							!toggle ? "hidden" : "flex"
						} p-4 xs:p-5 sm:p-6 blue-dark-gradient absolute top-16 xs:top-18 sm:top-20 right-0 mx-2 xs:mx-3 sm:mx-4 my-2 min-w-[160px] xs:min-w-[170px] sm:min-w-[180px] z-10 rounded-xl shadow-xl border border-white/20`}
					>
						<ul className='list-none flex justify-end items-start flex-1 flex-col gap-3 xs:gap-3.5 sm:gap-4'>
							{navLinks.map((nav) => (
								<li
									key={nav.id}
									className={`font-poppins font-medium cursor-pointer text-[14px] xs:text-[15px] sm:text-[16px] transition-colors duration-200 ${
										active === nav.title ? "text-white" : "text-secondary hover:text-white"
									}`}
									onClick={() => {
										setToggle(!toggle);
										setActive(nav.title);
									}}
								>
									<a href={`#${nav.id}`} className="block py-1">{nav.title}</a>
								</li>
							))}
							
							{/* Mobile Auth Section */}
							<li className="border-t border-white/20 pt-3 xs:pt-3.5 sm:pt-4 mt-2 w-full">
								{isAuthenticated ? (
									<div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 w-full">
										{user && (
											<div className="text-center pb-2 border-b border-white/10">
												<p className="text-secondary text-[12px] xs:text-[13px] sm:text-[14px]">Hello</p>
												<p className="text-white font-medium text-[14px] xs:text-[15px] sm:text-[16px]">{user.username}</p>
											</div>
										)}
										{location.pathname === '/admin' && (
											<Link
												to="/"
												onClick={() => setToggle(false)}
												className="bg-white/10 hover:bg-white/20 text-white px-3 xs:px-3.5 sm:px-4 py-2 rounded-lg text-[14px] xs:text-[15px] sm:text-[16px] font-medium w-full block text-center border border-white/20"
											>
												Portfolio
											</Link>
										)}
										{user?.role === 'admin' && location.pathname !== '/admin' && (
											<Link
												to="/admin"
												onClick={() => setToggle(false)}
												className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 xs:px-3.5 sm:px-4 py-2 rounded-lg text-[14px] xs:text-[15px] sm:text-[16px] font-medium w-full block text-center border border-blue-400/20"
											>
												Admin Panel
											</Link>
										)}
										<button
											onClick={() => {
												logout();
												setToggle(false);
												if (location.pathname === '/admin') {
													navigate('/');
												}
											}}
											className="bg-red-600/80 hover:bg-red-600 text-white px-3 xs:px-3.5 sm:px-4 py-2 rounded-lg text-[14px] xs:text-[15px] sm:text-[16px] font-medium w-full"
										>
											Logout
										</button>
									</div>
								) : (
									<div className="flex flex-col gap-2 w-full">
										<button
											onClick={() => {
												setAuthModalMode('login');
												setAuthModalOpen(true);
												setToggle(false);
											}}
											className="text-secondary hover:text-white px-3 xs:px-3.5 sm:px-4 py-2 text-[14px] xs:text-[15px] sm:text-[16px] font-medium w-full text-left transition-colors"
										>
											Login
										</button>
										<button
											onClick={() => {
												setAuthModalMode('signup');
												setAuthModalOpen(true);
												setToggle(false);
											}}
											className="bg-white/10 hover:bg-white/20 text-white px-3 xs:px-3.5 sm:px-4 py-2 rounded-lg text-[14px] xs:text-[15px] sm:text-[16px] font-medium w-full border border-white/20"
										>
											Sign Up
										</button>
									</div>
								)}
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Auth Modal */}
			<AuthModal
				isOpen={authModalOpen}
				onClose={() => setAuthModalOpen(false)}
				initialMode={authModalMode}
			/>
		</nav>
	);
};

export default Navbar;
