import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import ProjectModal from './ProjectModal';

export default function ProjectList() {
	const [projects, setProjects] = useState([]);
	const [newProject, setNewProject] = useState({ name: '', description: '' });
	const [selectedProject, setSelectedProject] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [tasks, setTasks] = useState([]);

	const location = useLocation();
	const navigate = useNavigate();

	// Read the projectId query parameter from the URL
	const queryParams = new URLSearchParams(location.search);
	const projectIdFromUrl = queryParams.get('projectId');

	useEffect(() => {
		const fetchProjects = async () => {
			const projectsCollection = collection(db, 'projects');
			const projectsSnapshot = await getDocs(projectsCollection);

			const projectsData = await Promise.all(
				projectsSnapshot.docs.map(async (doc) => {
					const project = { id: doc.id, ...doc.data() };

					// Ensure name and description are included
					project.name = project.name || 'Unnamed Project';
					project.description =
						project.description || 'No description provided.';

					// Fetch tasks for the project
					const tasksCollection = collection(
						db,
						'projects',
						project.id,
						'tasks'
					);
					const tasksSnapshot = await getDocs(tasksCollection);
					project.tasks = tasksSnapshot.docs.map((taskDoc) => ({
						id: taskDoc.id,
						...taskDoc.data(),
					}));

					// Fetch steps for the project
					const stepsCollection = collection(
						db,
						'projects',
						project.id,
						'steps'
					);
					const stepsSnapshot = await getDocs(stepsCollection);
					project.steps = stepsSnapshot.docs.map((stepDoc) => ({
						id: stepDoc.id,
						...stepDoc.data(),
					}));

					return project;
				})
			);

			setProjects(projectsData);

			// Automatically open the modal if projectIdFromUrl is present
			if (projectIdFromUrl) {
				const project = projectsData.find((p) => p.id === projectIdFromUrl);
				if (project) {
					handleOpenModal(projectIdFromUrl);
				}
			}
		};

		fetchProjects();
	}, [projectIdFromUrl]); // Re-run when projectIdFromUrl changes

	const handleOpenModal = async (projectId) => {
		const project = projects.find((p) => p.id === projectId);

		if (!project) return;

		// Fetch tasks for the selected project
		const tasksCollection = collection(db, 'projects', projectId, 'tasks');
		const tasksSnapshot = await getDocs(tasksCollection);
		const tasksData = tasksSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		// Fetch steps for the selected project
		const stepsCollection = collection(db, 'projects', projectId, 'steps');
		const stepsSnapshot = await getDocs(stepsCollection);
		const stepsData = stepsSnapshot.docs
			.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			.sort((a, b) => a.order - b.order); // Ensure steps are sorted by order

		// Ensure the project object has all necessary fields
		const fullProject = {
			...project, // Include existing project data
			name: project.name || 'Unnamed Project', // Fallback for name
			description: project.description || 'No description provided.', // Fallback for description
			steps: stepsData, // Add steps
		};

		// Set the selected project with all necessary data
		setSelectedProject(fullProject);
		setTasks(tasksData);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedProject(null);
		setIsModalOpen(false);
		navigate('/projects'); // Clear the projectId from the URL
	};

	const handleAddProject = async (name, description = '') => {
		if (!name.trim()) return;

		try {
			const projectRef = collection(db, 'projects');
			const newProject = {
				name,
				description,
				createdAt: new Date(),
				steps: [
					'Ideation & Market Research',
					'Requirements Gathering & Planning',
					'UX/UI Design & Prototyping',
					'Development (MVP Build)',
					'Testing & Quality Assurance',
					'Preparations for Beta Launch',
					'Beta Testing & Iteration',
				].map((step, index) => ({
					title: step,
					completed: false,
					order: index + 1,
				})),
			};
			const projectDoc = await addDoc(projectRef, newProject);

			setNewProject({ name: '', description: '' });
			setProjects((prev) => [...prev, { id: projectDoc.id, ...newProject }]);
		} catch (error) {
			console.error('Error adding project:', error);
		}
	};

	const handleAddTask = async (taskDetails) => {
		if (!selectedProject) return;

		try {
			const taskRef = collection(db, 'projects', selectedProject.id, 'tasks');
			const taskDoc = await addDoc(taskRef, taskDetails);

			setTasks((prev) => [...prev, { id: taskDoc.id, ...taskDetails }]);
		} catch (error) {
			console.error('Error adding task:', error);
		}
	};

	return (
		<div className='p-4'>
			<h1 className='text-2xl font-bold mb-4'>Projects</h1>

			<div className='mb-4'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleAddProject(newProject.name, newProject.description);
					}}>
					<input
						type='text'
						placeholder='Project Name'
						value={newProject.name}
						onChange={(e) =>
							setNewProject({ ...newProject, name: e.target.value })
						}
						className='border p-2 mr-2'
					/>
					<input
						type='text'
						placeholder='Description'
						value={newProject.description}
						onChange={(e) =>
							setNewProject({ ...newProject, description: e.target.value })
						}
						className='border p-2 mr-2'
					/>
					<button
						type='submit'
						className='bg-blue-500 text-white px-4 py-2 rounded'>
						Add Project
					</button>
				</form>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
				{projects.map((project) => (
					<div
						key={project.id}
						onClick={() => handleOpenModal(project.id)}
						className='p-4 bg-white shadow-md hover:shadow-xl transition duration-300 rounded border flex flex-col justify-between'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-semibold'>{project.name}</h2>
							<div className='mt-4 w-50'>
								<div className='h-2 bg-gray-200 rounded'>
									<div
										className='h-full bg-blue-500 rounded'
										style={{
											width: `${calculateStepProgress(project.steps)}%`,
										}}></div>
								</div>
								<p className='text-sm text-gray-600 mt-1'>
									Step{' '}
									{project.steps?.filter((step) => step.completed).length || 0}{' '}
									of {project.steps?.length || 7}
								</p>
							</div>
						</div>
						<p className='text-gray-600'>
							{project.description || 'No description provided.'}
						</p>
						<div className='flex justify-between'>
							<p className='text-gray-400 text-xs'>
								Created {getDaysSinceCreation(project.createdAt)} days ago
							</p>
						</div>
					</div>
				))}
			</div>

			<ProjectModal
				isOpen={isModalOpen}
				closeModal={handleCloseModal}
				project={selectedProject}
				tasks={tasks}
				onTaskAdd={handleAddTask}
			/>
		</div>
	);
}

const getDaysSinceCreation = (createdAt) => {
	if (!createdAt) return 'N/A';
	const createdDate = createdAt.toDate
		? createdAt.toDate()
		: new Date(createdAt);
	const diffTime = Math.abs(new Date() - createdDate);
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateStepProgress = (steps) => {
	if (!Array.isArray(steps) || steps.length === 0) return 0;
	const completedSteps = steps.filter((step) => step.completed).length;
	return Math.round((completedSteps / steps.length) * 100);
};
