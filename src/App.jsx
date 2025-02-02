import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';

function App() {
	return (
		<Routes>
			<Route
				path='/'
				element={<Home />}
			/>
			<Route
				path='/login'
				element={<Login />}
			/>
			<Route
				path='/signup'
				element={<Signup />}
			/>
			<Route
				path='/profile'
				element={<Profile />}
			/>
		</Routes>
	);
}

export default App;
