import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';

export default function NavBar() {
	return (
		<>
			<nav className='flex justify-between mx-4'>
				<img
					src={logo}
					alt='Main Logo'
					width='100px'
				/>
				<ul className='flex gap-4 my-5'>
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
