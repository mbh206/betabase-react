// src/components/ProjectList.jsx
import React from 'react';

/**
 * A simple list of projects that calls onProjectSelect when clicked.
 */
export default function ProjectList({
	projects,
	selectedProject,
	onProjectSelect,
}) {
	return (
		<ul>
			{projects.map((project) => (
				<li
					key={project.id}
					className={`cursor-pointer bg-gray-600 mx-1 my-2 px-1 py-2 rounded-xl ${
						selectedProject?.id === project.id
							? 'bg-gray-600'
							: 'hover:bg-gray-700'
					}`}
					onClick={() => onProjectSelect(project)}>
					{project.name}
				</li>
			))}
		</ul>
	);
}
