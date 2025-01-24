import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function NavBar() {
	return (
		<>
			<nav className='flex justify-between px-4 bg-orange-100 sticky top-0'>
				<div className='flex flex-col px-1 py-3'>
					<span className='text-4xl uppercase'>Betabase</span>
					<span className='text-xs uppercase'>Your Dev Project Tracker</span>
				</div>
				<ul className='flex gap-5 my-5 uppercase font-bold text-2xl'>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/projects'>Projects</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}
