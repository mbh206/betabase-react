import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
	doc,
	collection,
	addDoc,
	updateDoc,
	getDocs,
	Timestamp,
} from 'firebase/firestore';

export default function ProjectModal({
	project,
	onClose,
	onDeleteProject, // <-- new
	onDeleteTask, // <-- new
}) {
	const isNew = !project?.id;

	const [name, setName] = useState(project?.name || '');
	const [description, setDescription] = useState(project?.description || '');
	const [tasks, setTasks] = useState(project?.tasks || []);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskDesc, setNewTaskDesc] = useState('');
	const [newTaskDue, setNewTaskDue] = useState('');

	// If existing project, refresh tasks from Firestore in case they've changed
	useEffect(() => {
		const fetchTasks = async () => {
			if (!isNew && project?.id) {
				try {
					const tasksSnap = await getDocs(
						collection(db, 'projects', project.id, 'tasks')
					);
					const tasksData = tasksSnap.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					setTasks(tasksData);
				} catch (error) {
					console.error('Error fetching tasks for project:', error);
				}
			}
		};
		fetchTasks();
		// eslint-disable-next-line
	}, [project]);

	const handleSaveProject = async () => {
		try {
			if (isNew) {
				// Create new
				const newProj = {
					name,
					description,
					createdAt: Timestamp.now(),
					steps: [
						{ title: 'Ideation & Market Research', completed: false },
						{ title: 'Requirements Gathering & Planning', completed: false },
						// ...
					],
				};
				await addDoc(collection(db, 'projects'), newProj);
			} else {
				// Update existing
				const projectRef = doc(db, 'projects', project.id);
				await updateDoc(projectRef, {
					name,
					description,
				});
			}
			onClose();
		} catch (error) {
			console.error('Error saving project:', error);
		}
	};

	// Add a new task
	const handleAddTask = async () => {
		if (isNew) {
			alert('Save the project first before adding tasks.');
			return;
		}
		if (!newTaskTitle.trim()) return;

		try {
			const tasksCol = collection(db, 'projects', project.id, 'tasks');
			const newTask = {
				title: newTaskTitle,
				description: newTaskDesc,
				dueDate: newTaskDue || '',
				createdAt: Timestamp.now(),
			};
			const docRef = await addDoc(tasksCol, newTask);
			setTasks([...tasks, { ...newTask, id: docRef.id }]);
			setNewTaskTitle('');
			setNewTaskDesc('');
			setNewTaskDue('');
		} catch (error) {
			console.error('Error adding task:', error);
		}
	};

	// If you want to allow deleting tasks from here as well:
	const handleDeleteTaskLocal = (task) => {
		if (!onDeleteTask) return;
		onDeleteTask(task); // calls the parent's function
		// Also remove from local tasks array
		setTasks((prev) => prev.filter((t) => t.id !== task.id));
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'>
			<div
				className='absolute inset-0'
				onClick={onClose}
			/>
			<div className='relative bg-white w-11/12 max-w-3xl p-6 rounded shadow-md'>
				<h2 className='text-2xl font-bold mb-4'>
					{isNew ? 'Create a New Project' : 'Edit Project'}
				</h2>

				{/* PROJECT FIELDS */}
				<div className='mb-4'>
					<label className='block text-sm font-medium mb-1'>Project Name</label>
					<input
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						className='w-full border rounded px-3 py-2'
					/>
				</div>

				<div className='mb-4'>
					<label className='block text-sm font-medium mb-1'>Description</label>
					<textarea
						rows={2}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='w-full border rounded px-3 py-2'
					/>
				</div>

				{/* TASKS SECTION (if editing existing project) */}
				{!isNew && (
					<>
						<h3 className='text-xl font-semibold mb-2'>Tasks</h3>
						<div className='space-y-2 max-h-48 overflow-y-auto mb-4'>
							{tasks.map((task) => (
								<div
									key={task.id}
									className='border p-2 rounded flex justify-between items-center'>
									<div>
										<h4 className='font-semibold'>{task.title}</h4>
										<p className='text-sm text-gray-600'>{task.description}</p>
									</div>
									<div className='text-sm flex items-center space-x-2'>
										<p className='text-gray-400'>
											{task.dueDate || 'No due date'}
										</p>
										<button
											onClick={() => handleDeleteTaskLocal(task)}
											className='bg-red-500 text-white px-2 py-1 rounded'>
											Delete
										</button>
									</div>
								</div>
							))}
						</div>

						{/* ADD NEW TASK */}
						<div className='border p-3 rounded mb-4'>
							<h4 className='font-semibold mb-2'>Add New Task</h4>
							<input
								type='text'
								placeholder='Task Title'
								className='w-full border rounded px-2 py-1 mb-2'
								value={newTaskTitle}
								onChange={(e) => setNewTaskTitle(e.target.value)}
							/>
							<textarea
								rows={2}
								placeholder='Task Description'
								className='w-full border rounded px-2 py-1 mb-2'
								value={newTaskDesc}
								onChange={(e) => setNewTaskDesc(e.target.value)}
							/>
							<input
								type='date'
								className='w-full border rounded px-2 py-1 mb-2'
								value={newTaskDue}
								onChange={(e) => setNewTaskDue(e.target.value)}
							/>
							<button
								onClick={handleAddTask}
								className='bg-green-500 text-white px-3 py-1 rounded'>
								Add Task
							</button>
						</div>
					</>
				)}

				{/* ACTION BUTTONS */}
				<div className='flex justify-between items-center mt-6'>
					{/* Delete entire project (only if not new) */}
					{!isNew && onDeleteProject && (
						<button
							onClick={() => {
								onDeleteProject(project.id);
								onClose();
							}}
							className='bg-red-600 text-white px-4 py-2 rounded'>
							Delete Project
						</button>
					)}

					<div className='flex space-x-2'>
						<button
							onClick={onClose}
							className='bg-gray-400 text-white px-4 py-2 rounded'>
							Cancel
						</button>
						<button
							onClick={handleSaveProject}
							className='bg-blue-600 text-white px-4 py-2 rounded'>
							{isNew ? 'Create Project' : 'Save Changes'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
