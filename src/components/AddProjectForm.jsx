import React, { useState } from 'react';

export default function AddProjectForm({
	newProjectName,
	newProjectDescription,
	setNewProjectName,
	setNewProjectDescription,
	handleAddProject, // This function should accept a collaborators array
	onClose, // New prop for closing the modal
}) {
	const [collaboratorsInput, setCollaboratorsInput] = useState('');

	const onSubmit = () => {
		// Convert comma-separated input into an array.
		const collaboratorsArray = collaboratorsInput
			.split(',')
			.map((c) => c.trim())
			.filter((c) => c !== '');
		// Call the project creation handler.
		handleAddProject(collaboratorsArray);
		// Close the modal after project creation.
		if (onClose) onClose();
	};

	return (
		<div>
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
			<input
				type='text'
				placeholder='Collaborators (comma separated UIDs)'
				value={collaboratorsInput}
				onChange={(e) => setCollaboratorsInput(e.target.value)}
				className='text-gray-500 border p-1 rounded w-full mb-2'
			/>
			<button
				onClick={onSubmit}
				className='bg-sky-500 text-white px-4 py-2 rounded w-full mb-2'>
				Add Project
			</button>
		</div>
	);
}
