import React, { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar, Model3D } from './components';
const Experience = lazy(() => import('./components/Experience'));
const About = lazy(() => import('./components/About'));
const Tech = lazy(() => import('./components/Tech'));

const App = () => {
	return (
		<BrowserRouter>
			<div className='relative z-0 bg-primary'>
				<div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
					<Navbar />
					<Model3D />
				</div>
				<Suspense fallback={<div>Loading...</div>}>
					<About />
					<Experience />
					<Tech />
				</Suspense>
			</div>
		</BrowserRouter>
	);
}

export default App;
	