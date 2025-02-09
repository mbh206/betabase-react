import React, { useState } from 'react';
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

	function handleSelectProject(project) {
		setSelectedProject(project);
	}

	return (
		<>
			<NavBar />
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
