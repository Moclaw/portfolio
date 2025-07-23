import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Model3D, AdminContacts } from './components';
import Contact from './components/Contact';
import AdminRoute from './components/AdminRoute';
import { PortfolioProvider } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ApiLoadingState from './components/ApiLoadingState';

const Experience = lazy(() => import('./components/Experience'));
const About = lazy(() => import('./components/About'));
const Tech = lazy(() => import('./components/Tech'));
const Projects = lazy(() => import('./components/Projects'));
const Testimonials = lazy(() => import('./components/Testimonials'));

const App = () => {
	return (
		<ErrorBoundary>
			<AuthProvider>
				<PortfolioProvider>
					<BrowserRouter>
						<Routes>
							{/* Admin Routes */}
							<Route path="/admin" element={<AdminRoute />} />
							<Route path="/admin/contacts" element={<AdminContacts />} />
							
							{/* Main Portfolio Route */}
							<Route path="/" element={
								<div className='relative z-0 bg-primary'>
									<div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
										<Navbar />
										<Model3D />
									</div>
									<Suspense fallback={<ApiLoadingState message="Loading sections..." />}>
										<About />
										<Experience />
										<Tech />
										<Projects />
										<Testimonials />
									</Suspense>
									<Contact />
								</div>
							} />
						</Routes>
					</BrowserRouter>
				</PortfolioProvider>
			</AuthProvider>
		</ErrorBoundary>
	);
}

export default App;
	