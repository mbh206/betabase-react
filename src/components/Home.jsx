import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
	collection,
	getDocs,
	doc,
	deleteDoc,
	updateDoc,
	addDoc,
} from 'firebase/firestore';
import Modal from './Modal';

export default function Home() {
	const [projects, setProjects] = useState([]);
	const [newProject, setNewProject] = useState({ name: '', description: '' });
	const [selectedProject, setSelectedProject] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [tasks, setTasks] = useState([]);
	const [showConfirmation, setShowConfirmation] = useState(false);

	useEffect(() => {
		const fetchProjects = async () => {
			const projectsCollection = collection(db, 'projects');
			const projectsSnapshot = await getDocs(projectsCollection);

			const projectsData = await Promise.all(
				projectsSnapshot.docs.map(async (doc) => {
					const project = { id: doc.id, ...doc.data() };
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

					// Ensure steps is always an array
					project.steps = project.steps.length ? project.steps : [];

					return project;
				})
			);

			setProjects(projectsData);
		};

		fetchProjects();
	}, []);

	const handleOpenModal = async (projectId) => {
		const project = projects.find((p) => p.id === projectId);

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

		// Add steps to the selected project
		setSelectedProject({ ...project, steps: stepsData });
		setTasks(tasksData);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedProject(null);
		setIsModalOpen(false);
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
			setShowConfirmation(true);
			setTimeout(() => setShowConfirmation(false), 2000);
		} catch (error) {
			console.error('Error adding project:', error);
		}
	};

	const handleDeleteProject = async (projectId) => {
		try {
			await deleteDoc(doc(db, 'projects', projectId));
			setProjects((prev) => prev.filter((project) => project.id !== projectId));
		} catch (error) {
			console.error('Error deleting project:', error);
		}
	};

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

	const updateStepCompletion = async (stepIndex) => {
		const tasksInStep = tasks.filter((task) => task.step === stepIndex);
		const isComplete = tasksInStep.every((task) => task.status === 'Done');

		const projectRef = doc(db, 'projects', selectedProject.id);
		await updateDoc(projectRef, {
			[`steps.${stepIndex}.completed`]: isComplete,
		});

		setProjects((prev) =>
			prev.map((project) =>
				project.id === selectedProject.id
					? {
							...project,
							steps: project.steps.map((step, index) =>
								index === stepIndex ? { ...step, completed: isComplete } : step
							),
					  }
					: project
			)
		);
	};

	const handleAddTask = async (taskDetails) => {
		if (!selectedProject) return;

		try {
			const taskRef = collection(db, 'projects', selectedProject.id, 'tasks');
			const taskDoc = await addDoc(taskRef, taskDetails);

			setTasks((prev) => [...prev, { id: taskDoc.id, ...taskDetails }]);
			updateStepCompletion(taskDetails.step);
		} catch (error) {
			console.error('Error adding task:', error);
		}
	};

	return (
		<div className='p-4'>
			<h3>Add New Project</h3>
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
				/>
				<input
					type='text'
					placeholder='Description'
					value={newProject.description}
					onChange={(e) =>
						setNewProject({ ...newProject, description: e.target.value })
					}
				/>
				<button type='submit'>Add Project</button>
			</form>

			<h3>My Projects</h3>
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

			<Modal
				isOpen={isModalOpen}
				closeModal={handleCloseModal}
				project={selectedProject}
				tasks={tasks}
				onTaskAdd={handleAddTask}
			/>
		</div>
	);
}
