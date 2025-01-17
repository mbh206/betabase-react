import React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export default function ProjectList() {
	return (
		<>
			<h1>Projects</h1>
			<ul>
				<li>
					<Link to='/projects/1'>Project 1</Link>
				</li>
				<li>
					<Link to='/projects/2'>Project 2</Link>
				</li>
			</ul>
		</>
	);
}
