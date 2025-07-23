import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
	const [active, setActive] = useState("");
	const [toggle, setToggle] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [shouldCollapse, setShouldCollapse] = useState(false);
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
			if (navRef.current && menuRef.current) {
				const navWidth = navRef.current.offsetWidth;
				const menuWidth = menuRef.current.scrollWidth;
				const logoWidth = 250; // Ước tính width của logo và text
				const padding = 120; // Padding và margin
				
				// Nếu menu + logo + padding > nav width thì collapse
				setShouldCollapse(menuWidth + logoWidth + padding > navWidth);
			}
		};

		// Delay để đảm bảo DOM đã render
		const timeoutId = setTimeout(checkNavOverflow, 100);
		
		window.addEventListener("resize", checkNavOverflow);

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener("resize", checkNavOverflow);
		};
	}, []);

	return (
		<nav
			ref={navRef}
			className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 transition-all duration-300 ${
				scrolled ? "bg-primary/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
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
					<img src={logo} alt='logo' className='w-9 h-9 object-contain' />
					<p className='text-white text-[18px] font-bold cursor-pointer flex '>
						Moclaw &nbsp;
						<span className='sm:block hidden'> | Software Engineer</span>
					</p>
				</Link>

				{/* Desktop Menu */}
				<div className="flex items-center gap-4">
					<ul 
						ref={menuRef}
						className={`list-none ${shouldCollapse ? 'hidden' : 'flex'} flex-row gap-6 md:gap-10`}
					>
						{navLinks.map((nav) => (
							<li
								key={nav.id}
								className={`${
									active === nav.title ? "text-white" : "text-secondary"
								} hover:text-white text-[16px] md:text-[18px] font-medium cursor-pointer transition-colors duration-200 whitespace-nowrap`}
								onClick={() => setActive(nav.title)}
							>
								<a href={`#${nav.id}`}>{nav.title}</a>
							</li>
						))}
					</ul>

					{/* Auth Section */}
					<div className={`${shouldCollapse ? 'hidden' : 'flex'} items-center gap-2`}>
						{isAuthenticated && (
							<div className="flex items-center gap-2">
								{location.pathname === '/admin' && (
									<Link
										to="/"
										className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
									>
										Portfolio
									</Link>
								)}
								<button
									onClick={() => {
										logout();
										if (location.pathname === '/admin') {
											navigate('/');
										}
									}}
									className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
								>
									Logout
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Mobile Menu Button */}
				<div className={`${shouldCollapse ? 'flex' : 'hidden'} flex-1 justify-end items-center`}>
					<img
						src={toggle ? close : menu}
						alt='menu'
						className='w-[28px] h-[28px] object-contain cursor-pointer hover:opacity-80 transition-opacity'
						onClick={() => setToggle(!toggle)}
					/>

					{/* Mobile Menu Dropdown */}
					<div
						className={`${
							!toggle ? "hidden" : "flex"
						} p-6 blue-dark-gradient absolute top-20 right-0 mx-4 my-2 min-w-[180px] z-10 rounded-xl shadow-xl border border-white/20`}
					>
						<ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
							{navLinks.map((nav) => (
								<li
									key={nav.id}
									className={`font-poppins font-medium cursor-pointer text-[16px] transition-colors duration-200 ${
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
							<li className="border-t border-white/20 pt-4 mt-2 w-full">
								{isAuthenticated && (
									<div className="flex flex-col gap-2 w-full">
										{location.pathname === '/admin' && (
											<Link
												to="/"
												onClick={() => setToggle(false)}
												className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full block text-center"
											>
												Portfolio
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
											className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full"
										>
											Logout
										</button>
									</div>
								)}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
