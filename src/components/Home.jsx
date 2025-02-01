import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
	collection,
	doc,
	getDocs,
	updateDoc,
	deleteDoc,
	addDoc,
} from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Home() {
	const [projects, setProjects] = useState([]);
	const [newProjectName, setNewProjectName] = useState('');
	const [newProjectDescription, setNewProjectDescription] = useState('');
	const [editingProject, setEditingProject] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedStep, setSelectedStep] = useState(0);
	const [tasks, setTasks] = useState([]);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskDescription, setNewTaskDescription] = useState('');
	const [filterPriority, setFilterPriority] = useState('');
	const [filterSearch, setFilterSearch] = useState('');
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isTaskHintCollapsed, setIsTaskHintCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	useEffect(() => {
		const fetchProjects = async () => {
			const projSnapshot = await getDocs(collection(db, 'projects'));
			const fetchedProjects = projSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			const allTasks = [];
			for (let project of fetchedProjects) {
				const tasksSnap = await getDocs(
					collection(db, 'projects', project.id, 'tasks')
				);
				const projectTasks = tasksSnap.docs.map((taskDoc) => ({
					id: taskDoc.id,
					...taskDoc.data(),
					projectId: project.id,
				}));
				project.tasks = projectTasks;
				allTasks.push(...projectTasks);
			}

			setProjects(fetchedProjects);
		};
		const width = window.innerWidth;
		console.log('window.innerWidth is: ', width);
		if (width < 1000) {
			setIsSidebarCollapsed(true);
			setIsMobile(true);
		}
		fetchProjects();
	}, []);

	const handleSelectProject = (project) => {
		setSelectedProject(project);
		setSelectedStep(0);
		setTasks(project.tasks || []);
		if (window.innerWidth >= 1000) {
			setIsSidebarCollapsed(false);
		}
		setIsTaskHintCollapsed(false);
	};

	const handleAddProject = async () => {
		if (!newProjectName.trim()) return;

		try {
			const projectRef = collection(db, 'projects');
			const newProject = {
				name: newProjectName,
				description: newProjectDescription,
				steps: [
					{
						title: 'Ideation & Research',
						completed: false,

						tasks: [
							{
								title: 'Problem Definition',
								description:
									'Clearly articulate the issue your app aims to solve. Who is it for, and why does it matter?',
								issues: [],
								challenges: [
									'Need to confirm target audience scope',
									'Validate real user pain points through data',
								],
								images: [],
								links: ['https://example.com/market-research-report.pdf'],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Market Analysis',
								description:
									'Study the competitive landscape. Identify existing solutions and see how your product can stand out.',
								issues: [],
								challenges: [],
								images: [],
								links: ['https://example.com/competitor-analysis'],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'User Research',
								description:
									'Gather insights from potential users about their needs and pain points. Conduct interviews, surveys, or focus groups to validate your hypothesis.',
								issues: ['Need participant consent forms'],
								challenges: ['Scheduling interviews across time zones'],
								images: [],
								links: [],
								awaiting: 'Recruiting participants from user group',
								assignee: 'Jane Smith',
							},
							{
								title: 'Feasibility Analysis',
								description:
									'Assess technical feasibility, potential costs, and revenue models to ensure the concept can be developed sustainably.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'Gathering & Planning',
						completed: false,
						tasks: [
							{
								title: 'Define Key Features',
								description:
									'List core functionalities the app must have to satisfy initial user needs (i.e., the minimum viable product or MVP feature set).',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Create User Stories',
								description:
									'Translate app features into stories that describe the who, what, and why of each feature from a user perspective.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Technical Considerations',
								description:
									'Decide on the technology stack (e.g., native vs. cross-platform for mobile apps), backend infrastructure, data storage, and third-party integrations.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Roadmap & Milestones',
								description:
									'Outline a timeline with key deliverables. Plan your sprints or development cycles if following Agile methodologies.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'UX/UI & Prototyping',
						completed: false,
						tasks: [
							{
								title: 'Information Architecture',
								description:
									'Define the hierarchy of information and navigational flow.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Wireframing',
								description:
									'Sketch low-fidelity wireframes to visualize layout and user journeys.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Interactive Prototypes',
								description:
									'Build high-fidelity mockups or clickable prototypes to gather stakeholder and user feedback early.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Design System/Style Guide',
								description:
									'Establish consistent visual guidelines (colors, typography, icons) that will be used throughout the product.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'Development (MVP)',
						completed: false,
						tasks: [
							{
								title: 'Set Up the Development Environment',
								description:
									'Configure repositories, CI/CD pipeline, and any necessary tools for collaborative work.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Iterative Feature Implementation',
								description:
									'Start coding the MVP features, integrating design elements and functionality in a modular, testable manner.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Regular Checkpoints',
								description:
									'Conduct daily standups (if Agile/Scrum) and frequent demos to keep the team aligned on progress.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Version Control & Documentation',
								description:
									'Use version control (e.g., Git) rigorously and maintain clear documentation for the codebase and APIs.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'Testing & QA',
						completed: false,
						tasks: [
							{
								title: 'Unit Testing',
								description:
									'Developers test individual components to ensure each module works as intended.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Integration Testing',
								description:
									'Check that different parts of the system work correctly together (e.g., front-end with back-end APIs).',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'User Acceptance Testing (UAT)',
								description:
									'Involve a small group of real or representative users to test the app under real-world conditions.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Performance & Security Testing',
								description:
									'Ensure the app meets necessary performance benchmarks (speed, stability) and is secure from common vulnerabilities.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'Prep for Beta',
						completed: false,
						tasks: [
							{
								title: 'Refine the MVP',
								description:
									'Incorporate feedback from testing to fix critical bugs, improve usability, and stabilize core features.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Beta User Selection',
								description:
									'Identify a group of beta testers who represent your target audience. They could be existing users or volunteers recruited via sign-ups.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Beta Release & Distribution',
								description:
									'Deploy a beta version (TestFlight for iOS, internal testing tracks for Android, or invite-based web access).',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Feedback Collection Mechanisms',
								description:
									'Implement in-app feedback forms, bug-reporting tools, or surveys to capture user feedback rapidly.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
					{
						title: 'Beta Testing & Iteration',
						completed: false,
						tasks: [
							{
								title: 'Monitor Key Metrics',
								description:
									'Track session length, crashes, user retention, and feature usage to assess where improvements are needed.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Iterative Fixes & Updates',
								description:
									'Quickly address bugs and usability issues uncovered by beta users. Release updates with improvements and new features if feasible within the beta phase.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
							{
								title: 'Communication with Beta Testers',
								description:
									'Engage testers via email updates or community forums. Show appreciation for their feedback and keep them informed about upcoming changes.',
								issues: [],
								challenges: [],
								images: [],
								links: [],
								awaiting: '',
								assignee: '',
							},
						],
					},
				],
				createdAt: new Date(),
			};
			const docRef = await addDoc(projectRef, newProject);

			setProjects([...projects, { id: docRef.id, ...newProject }]);
			setNewProjectName('');
			setNewProjectDescription('');
		} catch (error) {
			console.error('Error adding project:', error);
		}
	};

	const handleEditProject = async (projectId, updatedFields) => {
		try {
			const projectRef = doc(db, 'projects', projectId);
			await updateDoc(projectRef, updatedFields);

			setProjects((prevProjects) =>
				prevProjects.map((project) =>
					project.id === projectId ? { ...project, ...updatedFields } : project
				)
			);
			setEditingProject(null);
		} catch (error) {
			console.error('Error updating project:', error);
		}
	};

	const handleDeleteProject = async (projectId) => {
		try {
			await deleteDoc(doc(db, 'projects', projectId));
			setProjects((prevProjects) =>
				prevProjects.filter((project) => project.id !== projectId)
			);
		} catch (error) {
			console.error('Error deleting project:', error);
		}
	};

	const calculateStepProgress = (stepIndex) => {
		const stepTasks = tasks.filter((task) => task.step === stepIndex);
		const completedTasks = stepTasks.filter(
			(task) => task.status === 'Done'
		).length;
		return stepTasks.length > 0
			? Math.round((completedTasks / stepTasks.length) * 100)
			: 0;
	};

	const filteredTasks = tasks
		.filter((task) => task.step === selectedStep)
		.filter((task) =>
			filterPriority ? task.priority === filterPriority : true
		)
		.filter((task) =>
			task.title.toLowerCase().includes(filterSearch.toLowerCase())
		)
		.sort((a, b) => a.order - b.order);

	const handleDragEnd = async (result) => {
		if (!result.destination) return;

		const { source, destination } = result;
		const draggedTask = tasks[source.index];

		if (source.droppableId === destination.droppableId) {
			const updatedTasks = Array.from(tasks);
			const [movedTask] = updatedTasks.splice(source.index, 1);
			updatedTasks.splice(destination.index, 0, movedTask);
			updatedTasks.forEach((t, i) => {
				t.order = i;
			});
			setTasks(updatedTasks);

			await updateTaskOrder(updatedTasks);
		} else {
			await updateTaskStep(draggedTask.id, parseInt(destination.droppableId));
		}
	};

	const updateTaskOrder = async (updatedTasks) => {
		try {
			const batch = updatedTasks.map((task, index) => ({
				id: task.id,
				order: index,
			}));

			for (const task of batch) {
				const taskRef = doc(
					db,
					'projects',
					selectedProject.id,
					'tasks',
					task.id
				);
				await updateDoc(taskRef, { order: task.order });
			}
		} catch (error) {
			console.error('Error updating task order:', error);
		}
	};

	const updateTaskStep = async (taskId, newStepIndex) => {
		try {
			const taskRef = doc(db, 'projects', selectedProject.id, 'tasks', taskId);
			await updateDoc(taskRef, { step: newStepIndex });

			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, step: newStepIndex } : task
				)
			);
		} catch (error) {
			console.error('Error updating task step:', error);
		}
	};

	const handleAddTask = async (priority) => {
		if (!newTaskTitle.trim()) return;
		try {
			const taskRef = collection(db, 'projects', selectedProject.id, 'tasks');
			const newTask = {
				title: newTaskTitle,
				description: newTaskDescription,
				dueDate: '',
				step: selectedStep,
				status: 'To Do',
				priority: priority || 'Medium',
				order: tasks.length,
			};
			const docRef = await addDoc(taskRef, newTask);

			setTasks([...tasks, { ...newTask, id: docRef.id }]);
			setNewTaskTitle('');
			setNewTaskDescription('');
		} catch (error) {
			console.error('Error adding task:', error);
		}
	};

	const handleEditTask = async (taskId, field, value) => {
		try {
			const taskRef = doc(db, 'projects', selectedProject.id, 'tasks', taskId);
			await updateDoc(taskRef, { [field]: value });

			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, [field]: value } : task
				)
			);
		} catch (error) {
			console.error('Error updating task:', error);
		}
	};

	const handleDeleteTask = async (taskId) => {
		try {
			await deleteDoc(doc(db, 'projects', selectedProject.id, 'tasks', taskId));
			setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	return (
		<div className='flex h-full min-h-screen'>
			{/* Sidebar */}
			{selectedProject && (
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
									className='size-6'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										d='m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5'
									/>
								</svg>
							</button>

							{/* Mobile sidebar overlay */}
							{isMobileSidebarOpen && (
								<div className='fixed inset-0 z-50 flex  transition-all duration-300'>
									{/* Sidebar panel */}
									<div className='w-64 bg-gray-800 text-white p-4  transition-all duration-300'>
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
												className='size-6'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5'
												/>
											</svg>
										</button>
										<button
											onClick={() => setSelectedProject(null)}
											className='bg-orange-500 text-white my-2 py-1 rounded w-full'>
											Back to Projects
										</button>
										{/* Add Project Form */}
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
												onChange={(e) =>
													setNewProjectDescription(e.target.value)
												}
												className='border p-1sky rounded w-full mb-2 text-gray-500'
											/>
											<button
												onClick={handleAddProject}
												className='bg-sky-500 text-white px-4 py-2 rounded w-full'>
												Add Project
											</button>
										</div>
										{/* Back to Projects Button */}
										<h2 className='text-xl font-semibold mb-4'>
											Active Projects
										</h2>
										<ul>
											{projects.map((project) => (
												<li
													key={project.id}
													className={`cursor-pointer m-1 p-2 rounded ${
														selectedProject?.id === project.id
															? 'bg-gray-600'
															: 'hover:bg-gray-700'
													}`}
													onClick={() => {
														handleSelectProject(project);
														// Optionally close sidebar on selection:
														setIsMobileSidebarOpen(false);
													}}>
													{project.name}
												</li>
											))}
										</ul>
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
							className={`bg-gray-800 text-white p-4 transition-all duration-300  transition-all duration-300 ${
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
									className='border p-1sky rounded w-full mb-2 text-gray-500'
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
			)}

			{/* Main Workspace */}
			<div className={`flex-1 p-8 bg-gray-100 transition-all duration-300`}>
				{selectedProject ? (
					<>
						{/* Project Header */}
						<div className='flex justify-between items-center mb-4'>
							<h2 className='text-2xl font-bold'>{selectedProject.name}</h2>
							<span>
								<button
									onClick={(e) => {
										e.stopPropagation();
										setEditingProject(selectedProject);
									}}
									className='bg-teal-500 text-white text-sm mr-2 px-2 py-1 rounded'>
									Edit
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteProject(selectedProject.id);
									}}
									className='bg-red-500 text-white text-sm mr-2 px-2 py-1 rounded'>
									Delete
								</button>
							</span>
						</div>
						<div>{selectedProject.description}</div>
						{/* Step Tabs & Progress */}
						{isMobile ? (
							<div className='flex space-x-4 border-b mb-4'>
								<select
									className='px-4 py-2 w-full border rounded'
									value={selectedStep}
									onChange={(e) => setSelectedStep(Number(e.target.value))}>
									{selectedProject.steps.map((step, index) => (
										<option
											key={index}
											value={index}>
											{step.title} ({calculateStepProgress(index)}%)
										</option>
									))}
								</select>
							</div>
						) : (
							<div className='flex space-x-4 border-b mb-4'>
								{selectedProject.steps.map((step, index) => (
									<button
										key={index}
										className={`px-4 py-2 border-b-2 ${
											selectedStep === index
												? 'border-blue-500 text-blue-500 font-bold'
												: 'border-transparent'
										}`}
										onClick={() => setSelectedStep(index)}>
										{step.title} ({calculateStepProgress(index)}%)
									</button>
								))}
							</div>
						)}

						{/* Drag-and-Drop Task List */}
						<DragDropContext onDragEnd={handleDragEnd}>
							<Droppable droppableId={String(selectedStep)}>
								{(provided) => {
									const currentStepData = selectedProject.steps[selectedStep];
									return (
										<>
											<div
												className={`flex flex-col bg-gray-200 p-4 mb-4 rounded text-xs gap-2 ${
													isTaskHintCollapsed ? 'h-12' : ''
												}`}>
												<h3 className='flex justify-between'>
													<strong>Typical Tasks for this step</strong>
													<button
														onClick={() =>
															setIsTaskHintCollapsed(!isTaskHintCollapsed)
														}
														className='mb-4 text-gray-500'>
														{isTaskHintCollapsed ? (
															<svg
																xmlns='http://www.w3.org/2000/svg'
																fill='none'
																viewBox='0 0 24 24'
																strokeWidth={1.5}
																stroke='currentColor'
																className='size-6'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25'
																/>
															</svg>
														) : (
															<svg
																xmlns='http://www.w3.org/2000/svg'
																fill='none'
																viewBox='0 0 24 24'
																strokeWidth={1.5}
																stroke='currentColor'
																className='size-6'>
																<path
																	strokeLinecap='round'
																	strokeLinejoin='round'
																	d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
																/>
															</svg>
														)}
													</button>
												</h3>
												{!isTaskHintCollapsed ? (
													<ul className='list-inside'>
														{currentStepData.tasks?.map(
															(guideTask, guideIndex) => {
																if (typeof guideTask === 'string') {
																	return <li key={guideIndex}>{guideTask}</li>;
																} else if (typeof guideTask === 'object') {
																	return Object.entries(guideTask).map(
																		([title, description]) => (
																			<li key={title}>
																				<strong>{title}:</strong> {description}
																			</li>
																		)
																	);
																}
																return null;
															}
														)}
													</ul>
												) : (
													''
												)}
											</div>
											{/* Filters */}
											<div className='flex space-x-4 mb-4'>
												<select
													value={filterPriority}
													onChange={(e) => setFilterPriority(e.target.value)}
													className='border p-2 rounded'>
													<option value=''>All Priorities</option>
													<option value='High'>🔴 High</option>
													<option value='Medium'>🟠 Medium</option>
													<option value='Low'>🟢 Low</option>
												</select>
												<input
													type='text'
													placeholder='Search Tasks'
													value={filterSearch}
													onChange={(e) => setFilterSearch(e.target.value)}
													className='border p-2 rounded'
												/>
											</div>
											{/* DRAGGABLE TASKS */}
											<ul
												ref={provided.innerRef}
												{...provided.droppableProps}
												className='space-y-2'>
												{filteredTasks.map((task, index) => (
													<Draggable
														key={task.id}
														draggableId={task.id}
														index={index}>
														{(provided) => (
															<li
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																className='bg-white p-4 rounded shadow flex justify-between items-center'>
																{/* Task Title */}
																<div>
																	<span className='mr-3 font-medium'>
																		{task.title}:
																	</span>
																	<span className='mr-3'>
																		{task.description
																			? task.description
																			: 'No description yet'}
																	</span>
																</div>
																{/* Priority Dropdown (color-coded) */}
																<select
																	value={task.priority}
																	onChange={(e) =>
																		handleEditTask(
																			task.id,
																			'priority',
																			e.target.value
																		)
																	}
																	className={`text-sm font-semibold mx-2 ${
																		task.priority === 'High'
																			? 'text-red-500'
																			: task.priority === 'Medium'
																			? 'text-orange-500'
																			: 'text-green-500'
																	}`}>
																	<option
																		value='High'
																		className='text-red-500'>
																		High
																	</option>
																	<option
																		value='Medium'
																		className='text-orange-500'>
																		Medium
																	</option>
																	<option
																		value='Low'
																		className='text-green-500'>
																		Low
																	</option>
																</select>

																{/* Status Dropdown */}
																<div className='flex items-center'>
																	<select
																		value={task.status}
																		onChange={(e) =>
																			handleEditTask(
																				task.id,
																				'status',
																				e.target.value
																			)
																		}
																		className={`text-white py-1 px-2 rounded ${
																			task.status === 'To Do'
																				? 'bg-blue-500'
																				: task.status === 'In Progress'
																				? 'bg-green-500'
																				: 'bg-gray-500'
																		}`}>
																		<option value='To Do'>To Do</option>
																		<option value='In Progress'>
																			In Progress
																		</option>
																		<option value='Done'>Done</option>
																	</select>

																	{/* Delete Button */}
																	<button
																		className='ml-3'
																		onClick={() => handleDeleteTask(task.id)}>
																		<svg
																			xmlns='http://www.w3.org/2000/svg'
																			fill='none'
																			viewBox='0 0 24 24'
																			strokeWidth={1.5}
																			stroke='currentColor'
																			className='size-7 text-white bg-red-500 rounded p-1'>
																			<path
																				strokeLinecap='round'
																				strokeLinejoin='round'
																				d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21
                    c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244
                    2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108
                    0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0
                    0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0
                    0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
																			/>
																		</svg>
																	</button>
																</div>
															</li>
														)}
													</Draggable>
												))}
												{provided.placeholder}
											</ul>
										</>
									);
								}}
							</Droppable>
						</DragDropContext>

						{/* Add Task Form */}
						<div className='mt-4'>
							<input
								type='text'
								placeholder='New Task Name'
								value={newTaskTitle}
								onChange={(e) => setNewTaskTitle(e.target.value)}
								className='border p-2 rounded w-full'
								onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
							/>
							<input
								type='text'
								placeholder='New Task Description'
								value={newTaskDescription}
								onChange={(e) => setNewTaskDescription(e.target.value)}
								className='border p-2 rounded w-full'
								onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
							/>
							<div className='flex space-x-2 mt-2'>
								<button
									onClick={() => handleAddTask('High')}
									className='bg-red-500 text-white px-4 py-2 rounded'>
									Add High Priority
								</button>
								<button
									onClick={() => handleAddTask('Medium')}
									className='bg-orange-500 text-white px-4 py-2 rounded'>
									Add Medium Priority
								</button>
								<button
									onClick={() => handleAddTask('Low')}
									className='bg-green-500 text-white px-4 py-2 rounded'>
									Add Low Priority
								</button>
							</div>
						</div>
					</>
				) : (
					<>
						{/* Initial Load: Show All Projects as Cards */}
						<h2 className='text-2xl font-bold mb-4'>All Projects</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
							{projects.map((project) => (
								<div
									key={project.id}
									onClick={() => handleSelectProject(project)}
									className='bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition-shadow'>
									<h3 className='text-xl font-semibold'>{project.name}</h3>
									<p className='text-gray-600'>{project.description}</p>
								</div>
							))}
						</div>
					</>
				)}
			</div>

			{/* Edit Project Modal */}
			{editingProject && (
				<div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'>
					<div className='bg-white w-11/12 max-w-2xl p-6 rounded shadow-md'>
						<h2 className='text-2xl font-bold mb-4'>Edit Project</h2>
						<input
							type='text'
							placeholder='Project Name'
							value={editingProject.name}
							onChange={(e) =>
								setEditingProject({ ...editingProject, name: e.target.value })
							}
							className='border p-2 rounded w-full mb-2'
						/>
						<input
							type='text'
							placeholder='Description'
							value={editingProject.description}
							onChange={(e) =>
								setEditingProject({
									...editingProject,
									description: e.target.value,
								})
							}
							className='border p-2 rounded w-full mb-2'
						/>
						<button
							onClick={() =>
								handleEditProject(editingProject.id, {
									name: editingProject.name,
									description: editingProject.description,
								})
							}
							className='bg-blue-500 text-white px-4 py-2 rounded'>
							Save Changes
						</button>
						<button
							onClick={() => setEditingProject(null)}
							className='bg-gray-500 text-white px-4 py-2 rounded ml-2'>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
