import React from 'react';
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
	setSelectedProject,
	setNewProjectName,
	setNewProjectDescription,
	handleAddProject,
	handleSelectProject,
	clearSelectedProject,
	setShowAddForm,
}) {
	return (
		<>
			{isMobile ? (
				<>
					{/* Button to open sidebar overlay on mobile */}
					<button
						onClick={() => setIsMobileSidebarOpen(true)}
						className='py-2 fixed top-22 left-0 z-50 bg-gray-800 text-white'>
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

					{/* Mobile sidebar overlay */}
					{isMobileSidebarOpen && (
						<div className='fixed inset-0 z-50 flex transition-all duration-300'>
							{/* Sidebar panel */}
							<div className='w-64 bg-gray-800 text-white p-4 transition-all duration-300'>
								{/* Close button */}
								<button
									onClick={() => setIsMobileSidebarOpen(false)}
									className='mb-4 text-white'>
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
									onClick={() => clearSelectedProject()}
									className='bg-orange-500 text-white my-2 py-1 rounded w-full'>
									Back to Projects
								</button>

								{/* Add Project Form */}
								<div className='my-4 text-gray-400'>
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
								{/* Back to Projects Button */}
								<h2 className='text-xl font-semibold mb-4'>Active Projects</h2>
								<ProjectList
									projects={projects}
									selectedProject={selectedProject}
									onProjectSelect={handleSelectProject}
								/>
							</div>
							{/* Backdrop: clicking it closes the sidebar */}
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
						onClick={() => setSelectedProject(null)}
						className={`bg-orange-500 text-white my-2 py-1 rounded w-full ${
							isSidebarCollapsed ? 'hidden' : ''
						}`}>
						Back to Projects
					</button>
					{/* Add Project Form */}

					<AddProjectForm
						newProjectName={newProjectName}
						newProjectDescription={newProjectDescription}
						setNewProjectName={setNewProjectName}
						setNewProjectDescription={setNewProjectDescription}
						handleAddProject={handleAddProject}
						onClose={() => setShowAddForm(false)}
						isSidebarCollapsed={isSidebarCollapsed}
					/>

					<h2
						className={`text-xl font-semibold mb-4 ${
							isSidebarCollapsed ? 'hidden' : ''
						}`}>
						Projects
					</h2>
					<ul className={`${isSidebarCollapsed ? 'hidden' : ''}`}>
						{projects.map((project) => (
							<li
								key={project.id}
								className={`cursor-pointer m-1 p-2 rounded ${
									selectedProject?.id === project.id
										? 'bg-gray-600'
										: 'hover:bg-gray-700'
								}`}
								onClick={() => handleSelectProject(project)}>
								{project.name}
							</li>
						))}
					</ul>
				</div>
			)}
		</>
	);
}
