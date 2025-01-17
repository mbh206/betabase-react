import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';

function App() {
	return (
		<>
			<Routes>
				<Route
					path='/projects'
					element={<ProjectList />}
				/>
				<Route
					path='/projects/:id'
					element={<ProjectDetail />}
				/>
			</Routes>
		</>
	);
}

export default App;
