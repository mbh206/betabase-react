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

					return project;
				})
			);

			setProjects(projectsData);
		};

		fetchProjects();
	}, []);

	const handleOpenModal = async (projectId) => {
		const project = projects.find((p) => p.id === projectId);
		setSelectedProject(project);

		const tasksCollection = collection(db, 'projects', projectId, 'tasks');
		const tasksSnapshot = await getDocs(tasksCollection);
		const tasksData = tasksSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

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

	const calculateProgress = (tasks) => {
		if (!tasks || tasks.length === 0) return 0;
		const completedTasks = tasks.filter(
			(task) => task.status === 'Done'
		).length;
		return Math.round((completedTasks / tasks.length) * 100);
	};

	const handleAddTask = async (taskDetails) => {
		if (!selectedProject) return;

		try {
			const taskRef = collection(db, 'projects', selectedProject.id, 'tasks');
			const taskDoc = await addDoc(taskRef, taskDetails);
			setTasks((prev) => [...prev, { id: taskDoc.id, ...taskDetails }]);

			setProjects((prev) =>
				prev.map((project) =>
					project.id === selectedProject.id
						? {
								...project,
								tasks: [...project.tasks, { id: taskDoc.id, ...taskDetails }],
						  }
						: project
				)
			);
		} catch (error) {
			console.error('Error adding task:', error);
		}
	};

	const handleDeleteTask = async (taskId) => {
		if (!selectedProject) return;

		try {
			const taskRef = doc(db, 'projects', selectedProject.id, 'tasks', taskId);
			await deleteDoc(taskRef);
			setTasks((prev) => prev.filter((task) => task.id !== taskId));

			// Update tasks for the selected project in the main list
			setProjects((prev) =>
				prev.map((project) =>
					project.id === selectedProject.id
						? {
								...project,
								tasks: project.tasks.filter((task) => task.id !== taskId),
						  }
						: project
				)
			);
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	// Update a task's status or details
	const handleUpdateTask = async (taskId, updatedFields) => {
		if (!selectedProject) return;

		try {
			const taskRef = doc(db, 'projects', selectedProject.id, 'tasks', taskId);
			await updateDoc(taskRef, updatedFields);
			setTasks((prev) =>
				prev.map((task) =>
					task.id === taskId ? { ...task, ...updatedFields } : task
				)
			);

			// Update tasks for the selected project in the main list
			setProjects((prev) =>
				prev.map((project) =>
					project.id === selectedProject.id
						? {
								...project,
								tasks: project.tasks.map((task) =>
									task.id === taskId ? { ...task, ...updatedFields } : task
								),
						  }
						: project
				)
			);
		} catch (error) {
			console.error('Error updating task:', error);
		}
	};

	return (
		<div className='p-4'>
			{/* Add Project Form */}
			<div>
				<h3>Add New Project</h3>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleAddProject(newProject.name, newProject.description);
					}}
					className='mb-4'>
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
					{showConfirmation && (
						<div className='text-green-500 mt-2'>
							Project added successfully!
						</div>
					)}
				</form>
			</div>

			{/* Projects List */}
			<h3 className='text-3xl font-bold mb-4'>My Projects</h3>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
				{projects.map((project) => (
					<div
						key={project.id}
						onClick={() => handleOpenModal(project.id)}
						className='p-4 bg-white shadow-md hover:shadow-xl transition duration-300 rounded border flex flex-col justify-between'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-semibold'>{project.name}</h2>
							<div className='w-1/3'>
								<div className='h-2 bg-gray-200 rounded'>
									<div
										className='h-full bg-blue-500 rounded'
										style={{
											width: `${calculateProgress(project.tasks)}%`,
										}}></div>
								</div>
								<p className='text-sm text-gray-600 mt-1'>
									{calculateProgress(project.tasks)}% complete
								</p>
							</div>
						</div>
						<p className='text-gray-600'>
							{project.description || 'No description provided.'}
						</p>
						<p className='text-gray-400 text-xs'>
							Created {getDaysSinceCreation(project.createdAt)} days ago
						</p>
					</div>
				))}
			</div>

			{/* Modal for Tasks */}
			<Modal
				isOpen={isModalOpen}
				closeModal={handleCloseModal}
				project={selectedProject}
				tasks={tasks}
				onTaskAdd={handleAddTask}
				onTaskUpdate={handleUpdateTask}
				onTaskDelete={handleDeleteTask}
			/>
		</div>
	);
}
