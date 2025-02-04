// src/components/Dashboard/Sidebar.jsx
import React, { useState } from 'react';
import AddProjectForm from './AddProjectForm';
import ProjectList from './ProjectList';

export default function Sidebar({
	projects,
	selectedProject,
	newProjectName,
	newProjectDescription,
	isSidebarCollapsed,
	isMobile,
	isMobileSidebarOpen,
	setIsSidebarCollapsed,
	setIsMobileSidebarOpen,
	handleSelectProject,
	setNewProjectName,
	setNewProjectDescription,
	handleAddProject,
}) {
	const [showAddForm, setShowAddForm] = useState(false);

	// If there are no projects, render a message with a "Start a Project" button
	if (projects.length === 0) {
		return (
			<div className='sidebar bg-gray-800 text-white p-4 w-64'>
				<h2 className='text-xl font-semibold mb-4'>
					You don't have any projects yet!
				</h2>
				<button
					onClick={() => setShowAddForm(true)}
					className='px-4 py-2 bg-blue-500 rounded'>
					Start a Project
				</button>
				{showAddForm && (
					<AddProjectForm
						newProjectName={newProjectName}
						newProjectDescription={newProjectDescription}
						setNewProjectName={setNewProjectName}
						setNewProjectDescription={setNewProjectDescription}
						handleAddProject={handleAddProject}
						onClose={() => setShowAddForm(false)}
					/>
				)}
			</div>
		);
	}

	// Otherwise, render the full sidebar with the project list and add project form inline
	return (
		<div className='sidebar'>
			{isMobile ? (
				<>
					{/* Mobile sidebar: Button to open overlay */}
					<button
						onClick={() => setIsMobileSidebarOpen(true)}
						className='py-2 fixed top-22 left-0 z-50 bg-gray-800 text-white'>
						{/* (Insert your mobile SVG icon here) */}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5'
							/>
						</svg>
					</button>
					{isMobileSidebarOpen && (
						<div className='fixed inset-0 z-50 flex transition-all duration-300'>
							<div className='w-64 bg-gray-800 text-white p-4 transition-all duration-300'>
								{/* Close button */}
								<button
									onClick={() => setIsMobileSidebarOpen(false)}
									className='mb-4 text-white'>
									{/* (Insert your close SVG icon here) */}
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										strokeWidth={1.5}
										stroke='currentColor'
										className='w-6 h-6'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5'
										/>
									</svg>
								</button>
								<button
									onClick={() => handleSelectProject(null)}
									className='bg-orange-500 text-white my-2 py-1 rounded w-full'>
									Back to Projects
								</button>
								{/* Inline Add Project Form */}
								<div className='my-4'>
									<input
										type='text'
										placeholder='New Project Name'
										value={newProjectName}
										onChange={(e) => setNewProjectName(e.target.value)}
										className='border p-1 rounded w-full mb-2 text-gray-500'
									/>
									<input
										type='text'
										placeholder='Description'
										value={newProjectDescription}
										onChange={(e) => setNewProjectDescription(e.target.value)}
										className='border p-1 rounded w-full mb-2 text-gray-500'
									/>
									<button
										onClick={handleAddProject}
										className='bg-sky-500 text-white px-4 py-2 rounded w-full'>
										Add Project
									</button>
								</div>
								<h2 className='text-xl font-semibold mb-4'>Active Projects</h2>
								<ProjectList
									projects={projects}
									selectedProject={selectedProject}
									onProjectSelect={(proj) => {
										handleSelectProject(proj);
										setIsMobileSidebarOpen(false);
									}}
								/>
							</div>
							<div
								className='flex-1 bg-black opacity-50'
								onClick={() => setIsMobileSidebarOpen(false)}></div>
						</div>
					)}
				</>
			) : (
				<div
					className={`bg-gray-800 text-white p-4 transition-all duration-300 ${
						isSidebarCollapsed ? 'w-16' : 'w-64'
					}`}>
					<button
						onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
						className='mb-4 text-white'>
						{isSidebarCollapsed ? (
							// (Insert your collapsed SVG icon)
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-6 h-6'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5'
								/>
							</svg>
						) : (
							// (Insert your expanded SVG icon)
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-6 h-6'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M18.75 4.5l-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5'
								/>
							</svg>
						)}
					</button>
					<button
						onClick={() => handleSelectProject(null)}
						className={`bg-orange-500 text-white my-2 py-1 rounded w-full ${
							isSidebarCollapsed ? 'hidden' : ''
						}`}>
						Back to Projects
					</button>
					<div className={`my-4 ${isSidebarCollapsed ? 'hidden' : ''}`}>
						<input
							type='text'
							placeholder='New Project Name'
							value={newProjectName}
							onChange={(e) => setNewProjectName(e.target.value)}
							className='border p-1 rounded w-full mb-2 text-gray-500'
						/>
						<input
							type='text'
							placeholder='Description'
							value={newProjectDescription}
							onChange={(e) => setNewProjectDescription(e.target.value)}
							className='border p-1 rounded w-full mb-2 text-gray-500'
						/>
						<button
							onClick={handleAddProject}
							className='bg-sky-500 text-white px-4 py-2 rounded w-full'>
							Add Project
						</button>
					</div>
					<h2
						className={`text-xl font-semibold mb-4 ${
							isSidebarCollapsed ? 'hidden' : ''
						}`}>
						Projects
					</h2>
					<ProjectList
						projects={projects}
						selectedProject={selectedProject}
						onProjectSelect={handleSelectProject}
					/>
				</div>
			)}
		</div>
	);
}
