import React from 'react';

export default function AddProjectForm({
	newProjectName,
	newProjectDescription,
	setNewProjectName,
	setNewProjectDescription,
	handleAddProject,
	isSidebarCollapsed,
}) {
	return (
		<div
			className={`bg-gray-700 p-2 rounded-xl ${
				isSidebarCollapsed ? 'hidden' : ''
			}`}>
			<h2 className='text-xl font-bold mb-1'>Create New Project</h2>
			<input
				type='text'
				placeholder='Project Name'
				value={newProjectName}
				onChange={(e) => setNewProjectName(e.target.value)}
				className='text-gray-500 border p-1 rounded w-full mb-2'
			/>
			<input
				type='text'
				placeholder='Project Description'
				value={newProjectDescription}
				onChange={(e) => setNewProjectDescription(e.target.value)}
				className='text-gray-500 border p-1 rounded w-full mb-2'
			/>
			<button
				onClick={handleAddProject}
				className='bg-sky-500 text-white px-4 py-2 rounded w-full mb-2'>
				Add Project
			</button>
		</div>
	);
}
