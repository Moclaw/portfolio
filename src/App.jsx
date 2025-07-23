import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, ErrorBoundary, ApiLoadingState } from './shared';
import { Model3D } from './features/home';
import { Contact } from './features/contact';
import { AdminRoute, AdminContacts } from './features/admin';
import { PortfolioProvider } from './shared/context/PortfolioContext';
import { AuthProvider } from './shared/context/AuthContext';

const Experience = lazy(() => import('./features/experience').then(module => ({ default: module.Experience })));
const About = lazy(() => import('./features/about').then(module => ({ default: module.About })));
const Tech = lazy(() => import('./features/tech').then(module => ({ default: module.Tech })));
const Projects = lazy(() => import('./features/projects').then(module => ({ default: module.Projects })));
const Testimonials = lazy(() => import('./features/testimonials').then(module => ({ default: module.Testimonials })));

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
	