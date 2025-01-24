import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import '../App.css';

export default function NavBar() {
	return (
		<>
			<nav className='flex justify-between mx-4'>
				<img
					src={logo}
					alt='Main Logo'
					width='100px'
					className='App-logo-spin'
				/>
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
