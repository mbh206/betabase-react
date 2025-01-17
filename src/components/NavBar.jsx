import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';

export default function NavBar() {
	return (
		<>
			<nav>
				<ul className=''>
					<li>
						<img
							src={logo}
							alt='Main Logo'
							width='50px'
						/>
					</li>
					<li>Home</li>
				</ul>
			</nav>
		</>
	);
}
