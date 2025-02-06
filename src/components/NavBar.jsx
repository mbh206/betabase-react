import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigate('/login');
		} catch (error) {
			console.error('Error signing out: ', error);
		}
	};

	return (
		<nav className='flex justify-between items-center px-4 bg-white sticky top-0'>
			<div className='flex flex-col px-1 pt-2'>
				<Link to='/'>
					<img
						src='/betabase.png'
						alt='Logo'
						className='w-48'
					/>
				</Link>
			</div>
			<ul className='hidden md:flex flex gap-5 my-4 uppercase font-bold text-2xl'>
				<li>
					<Link to='/'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='size-11 bg-blue-200 rounded-full p-2 shadow hover:shadow-lg'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
							/>
						</svg>
					</Link>
				</li>
				{currentUser ? (
					<li>
						<Link to='/profile'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='size-11 bg-blue-200 rounded-full p-2 shadow hover:shadow-lg'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
								/>
							</svg>
						</Link>
					</li>
				) : (
					''
				)}
				{!currentUser ? (
					<li>
						<Link to='/signup'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='size-11 bg-blue-200 rounded-full p-2 shadow hover:shadow-lg'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z'
								/>
							</svg>
						</Link>
					</li>
				) : (
					<li>
						{/* Use a button to call handleLogout */}
						<button
							onClick={handleLogout}
							className='focus:outline-none'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='size-11 bg-blue-200 rounded-full p-2 shadow hover:shadow-lg'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15'
								/>
							</svg>
						</button>
					</li>
				)}
			</ul>
		</nav>
	);
}
