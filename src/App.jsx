import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Login from './Login';
import Signup from './Signup';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';

function App() {
	const [selectedProject, setSelectedProject] = useState(null);
	const headerRef = useRef(null);

	useEffect(() => {
		if (headerRef.current) {
			const headerHeight = headerRef.current.offsetHeight;
			document.documentElement.style.setProperty(
				'--header-height',
				`${headerHeight}px`
			);
		}
	}, []);

	function handleSelectProject(project) {
		setSelectedProject(project);
	}

	return (
		<>
			<header ref={headerRef}>
				<NavBar />
			</header>
			<Routes>
				{/* Public routes */}
				<Route
					path='/'
					element={<LandingPage />}
				/>
				<Route
					path='/login'
					element={<Login />}
				/>
				<Route
					path='/signup'
					element={<Signup />}
				/>

				{/* Private routes */}
				<Route
					path='/dashboard/:projectId?'
					element={
						<PrivateRoute>
							<Dashboard
								selectedProject={selectedProject}
								setSelectedProject={setSelectedProject}
								handleSelectProject={handleSelectProject}
							/>
						</PrivateRoute>
					}
				/>
				<Route
					path='/profile'
					element={
						<PrivateRoute>
							<Profile
								selectedProject={selectedProject}
								handleSelectProject={handleSelectProject}
							/>
						</PrivateRoute>
					}
				/>

				{/* Redirect any unknown paths to landing */}
				<Route
					path='*'
					element={<Navigate to='/' />}
				/>
			</Routes>
		</>
	);
}

export default App;
