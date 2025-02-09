import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A simple list of projects that calls onProjectSelect when clicked.
 */
export default function ProjectList({ projects, selectedProject }) {
	return (
		<ul>
			{projects.map((project) => (
				<li
					key={project.id}
					className={`cursor-pointer bg-gray-600 text-white uppercase mx-1 my-2 px-6 py-2 rounded-xl ${
						selectedProject?.id === project.id
							? 'bg-blue-600'
							: 'hover:bg-gray-900'
					}`}>
					<Link to={`/dashboard/${project.id}`}>{project.name}</Link>
				</li>
			))}
		</ul>
	);
}
