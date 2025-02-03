import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function LandingPage() {
	const { currentUser } = useAuth();

	if (currentUser) {
		return <Navigate to='/dashboard' />;
	}

	return (
		<div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
			<h1 className='text-4xl font-bold mb-4'>Welcome to BetaBase</h1>
			<p className='mb-4'>Build your next project with us.</p>
			<div>
				<Link
					to='/login'
					className='px-4 py-2 bg-blue-500 text-white rounded mr-2'>
					Login
				</Link>
				<Link
					to='/signup'
					className='px-4 py-2 bg-green-500 text-white rounded'>
					Sign Up
				</Link>
			</div>
		</div>
	);
}
