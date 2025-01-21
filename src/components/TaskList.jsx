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

	useEffect(() => {
		const fetchTasks = async () => {
			const taskCollection = collection(db, 'projects', projectId, 'tasks');
			const taskSnapshot = await getDocs(taskCollection);
			const taskData = taskSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setTasks(taskData);
		};

		fetchTasks();
	}, [projectId]);

	const handleAddTask = async () => {
		const taskCollection = collection(db, 'projects', projectId, 'tasks');
		const taskRef = await addDoc(taskCollection, {
			title: newTask,
			status: 'To Do',
		});
		setTasks([...tasks, { id: taskRef.id, title: newTask, status: 'To Do' }]);
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
						className='p-2 border-b flex gap-2'>
						<span>{task.title}</span>
						<select
							value={task.status}
							onChange={(e) => handleUpdateTask(task.id, e.target.value)}
							className='bg-blue-500 text-white text-center px-1 py-0 rounded text-xs uppercase '>
							<option value='To Do'>To Do</option>
							<option value='In Progress'>In Progress</option>
							<option value='Done'>Done</option>
						</select>
						<button
							onClick={() => handleDeleteTask(task.id)}
							className='bg-red-600 text-white px-1 py-0 rounded text-xs uppercase'>
							Delete
						</button>
					</li>
				))}
			</ul>
			<input
				type='text'
				value={newTask}
				onChange={(e) => setNewTask(e.target.value)}
				placeholder='New Task'
				className='border p-2 mt-4'
			/>
			<button
				onClick={handleAddTask}
				className='bg-green-500 text-white px-4 py-2 rounded'>
				Add Task
			</button>
		</div>
	);
};

export default TaskList;
