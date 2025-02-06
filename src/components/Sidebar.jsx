import React from 'react';
import AddProjectForm from './AddProjectForm';
import ProjectList from './ProjectList';
import MobileDrawer from './MobileDrawer';

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
	setShowAddForm,
	showAddProjectForm,
}) {
	if (isMobile) {
		return (
			<>
				<button
					onClick={() => setIsMobileSidebarOpen(true)}
					className='fixed top-3 right-3 z-50 bg-gray-800 text-white p-1 rounded'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='size-10'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
						/>
					</svg>
				</button>
				<MobileDrawer
					isOpen={isMobileSidebarOpen}
					onClose={() => setIsMobileSidebarOpen(false)}>
					{/* Drawer content goes here */}
					<div className='fixed top-0 right-2'>
						<button
							onClick={() => setIsMobileSidebarOpen(false)}
							className='my-2 text-white p-1 rounded'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='size-11'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M6 18 18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
					{/* Add Project Form */}
					<AddProjectForm
						newProjectName={newProjectName}
						newProjectDescription={newProjectDescription}
						setNewProjectName={setNewProjectName}
						setNewProjectDescription={setNewProjectDescription}
						handleAddProject={handleAddProject}
						isSidebarCollapsed={false} // not collapsed inside the drawer
					/>
					<div className='p-1 bg-gray-700 rounded-xl'>
						<h2 className='text-xl font-semibold m-2'>Active Projects</h2>
						<ProjectList
							projects={projects}
							selectedProject={selectedProject}
							onProjectSelect={(proj) => {
								handleSelectProject(proj);
								// optionally close the drawer
								setIsMobileSidebarOpen(false);
							}}
						/>
					</div>
				</MobileDrawer>
			</>
		);
	}

	return (
		<div
			className={`bg-gray-800 text-white p-4 transition-all duration-300 ${
				isSidebarCollapsed ? 'w-16' : 'w-64'
			}`}>
			<button
				onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
				className='mb-1 text-white'>
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
	);
}
