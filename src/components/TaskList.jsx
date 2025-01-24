import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	updateDoc,
	doc,
} from 'firebase/firestore';

const TaskList = ({ projectId }) => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState('');
	const [newTaskDetails, setNewTaskDetails] = useState('');

	useEffect(() => {
		const fetchTasks = async () => {
			if (!projectId) return; // Exit if no projectId is available
			const taskCollection = collection(db, 'projects', projectId, 'tasks');
			const taskSnapshot = await getDocs(taskCollection);
			const taskData = taskSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setTasks(taskData);
		};

		// Clear tasks before fetching for a new project
		setTasks([]);
		fetchTasks();
	}, [projectId]);

	const handleAddTask = async () => {
		const taskCollection = collection(db, 'projects', projectId, 'tasks');
		const taskRef = await addDoc(taskCollection, {
			title: newTask,
			details: newTaskDetails,
			status: 'To Do',
		});
		setTasks([
			...tasks,
			{
				id: taskRef.id,
				title: newTask,
				details: newTaskDetails,
				status: 'To Do',
			},
		]);
		setNewTask('');
	};

	const handleDeleteTask = async (taskId) => {
		try {
			const taskRef = doc(db, 'projects', projectId, 'tasks', taskId);
			await deleteDoc(taskRef);
			setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	const handleUpdateTask = async (taskId, newStatus) => {
		try {
			const taskRef = doc(db, 'projects', projectId, 'tasks', taskId);
			await updateDoc(taskRef, { status: newStatus });
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, status: newStatus } : task
				)
			);
		} catch (error) {
			console.error('Error updating task:', error);
		}
	};

	return (
		<div>
			<h2 className='text-xl font-bold'>Tasks</h2>
			<ul>
				{tasks.map((task) => (
					<li
						key={task.id}
						className='p-2 border-b flex justify-between bg-gray-200'>
						<div>
							<span className='bg-gray-100 px-2 py-1 rounded mr-2'>
								{task.title}
							</span>
							<span className='bg-gray-100 px-2 py-1 rounded'>
								{task.details}
							</span>
						</div>
						<div>
							<select
								value={task.status}
								onChange={(e) => handleUpdateTask(task.id, e.target.value)}
								className={`text-white text-center px-2 py-1 rounded text-xs uppercase ${
									task.status === 'To Do'
										? 'bg-blue-500'
										: `${
												task.status === 'In Progress'
													? 'bg-green-500'
													: 'bg-gray-500'
										  }`
								}`}>
								<option value='To Do'>To Do</option>
								<option value='In Progress'>In Progress</option>
								<option value='Done'>Done</option>
							</select>
							<button
								onClick={() => handleDeleteTask(task.id)}
								className='bg-red-600 text-white px-2 py-1 rounded text-xs uppercase ml-2'>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleAddTask({
						title: newTask,
						details: newTaskDetails,
						status: 'To Do',
					});
					setNewTask('');
					setNewTaskDetails('');
				}}
				className='flex gap-2'>
				<input
					type='text'
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
					placeholder='New Task'
					className='border p-2 mt-4'
				/>
				<input
					name='details'
					id='details'
					value={newTaskDetails}
					placeholder='Task Details'
					onChange={(e) => setNewTaskDetails(e.target.value)}
					className='border p-2 mt-4'
				/>
				<button
					type='submit'
					className='bg-green-500 text-white px-4 py-2 mt-4 rounded'>
					Add Task
				</button>
			</form>
		</div>
	);
};

export default TaskList;
