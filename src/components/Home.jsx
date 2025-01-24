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
	const [selectedProject, setSelectedProject] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		const fetchProjects = async () => {
			const projectsCollection = collection(db, 'projects');
			const projectsSnapshot = await getDocs(projectsCollection);

			const projectsData = projectsSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

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

	const handleDeleteProject = async (projectId) => {
		try {
			await deleteDoc(doc(db, 'projects', projectId));
			setProjects((prev) => prev.filter((project) => project.id !== projectId));
		} catch (error) {
			console.error('Error deleting project:', error);
		}
	};

	const handleAddTask = async (taskDetails) => {
		if (!selectedProject) return;

		try {
			// Reference to the tasks collection within the selected project
			const taskRef = collection(db, 'projects', selectedProject.id, 'tasks');

			// Add the task to Firestore
			const taskDoc = await addDoc(taskRef, taskDetails);

			// Update local state to include the new task
			setTasks((prev) => [...prev, { id: taskDoc.id, ...taskDetails }]);
		} catch (error) {
			console.error('Error adding task:', error);
		}
	};

	// Handle Deleting a Task
	const handleDeleteTask = async (taskId) => {
		if (!selectedProject) return;

		try {
			const taskRef = doc(db, 'projects', selectedProject.id, 'tasks', taskId);
			await deleteDoc(taskRef);

			setTasks((prev) => prev.filter((task) => task.id !== taskId));
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	// Handle Updating a Task
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
		} catch (error) {
			console.error('Error updating task:', error);
		}
	};

	return (
		<div className='p-4'>
			<h1 className='text-3xl font-bold mb-4'>My Projects</h1>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
				{projects.map((project) => (
					<div
						key={project.id}
						className='p-4 bg-white shadow-md rounded border'>
						<h2 className='text-xl font-semibold'>{project.name}</h2>
						<p className='text-gray-600'>
							{project.description || 'No description provided.'}
						</p>
						<div className='mt-4 flex justify-between'>
							<button
								onClick={() => handleOpenModal(project.id)}
								className='bg-blue-500 text-white px-4 py-2 rounded'>
								View Details
							</button>
							<button
								onClick={() => handleDeleteProject(project.id)}
								className='bg-red-500 text-white px-4 py-2 rounded'>
								Delete
							</button>
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
				onTaskUpdate={handleUpdateTask}
				onTaskDelete={handleDeleteTask}
			/>
		</div>
	);
}
