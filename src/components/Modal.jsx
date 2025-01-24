import React, { useState } from 'react';

export default function Modal({
	isOpen,
	closeModal,
	project,
	tasks,
	onTaskAdd,
	onTaskUpdate,
	onTaskDelete,
}) {
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskDescription, setNewTaskDescription] = useState('');
	const [newTaskDueDate, setNewTaskDueDate] = useState('');

	if (!isOpen) return null;

	// Handles task addition on form submission
	const handleAddTask = (e) => {
		e.preventDefault(); // Prevent page reload
		if (newTaskTitle.trim() === '') return;

		// Pass all task details to onTaskAdd
		onTaskAdd({
			title: newTaskTitle,
			description: newTaskDescription,
			dueDate: newTaskDueDate,
			status: 'To Do', // Default status
		});

		// Clear inputs after adding
		setNewTaskTitle('');
		setNewTaskDescription('');
		setNewTaskDueDate('');
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white w-11/12 max-w-2xl p-6 rounded shadow-md'>
				<h2 className='text-2xl font-bold mb-4'>{project.name}</h2>
				<p className='text-gray-600 mb-6'>{project.description}</p>

				<h3 className='text-xl font-semibold mb-4'>Tasks</h3>
				<ul className='space-y-2 flex flex-col'>
					{tasks.map((task) => (
						<li
							key={task.id}
							className='p-2 border rounded flex justify-between'>
							<span>{task.title}</span>
							<span>{task.description}</span>
							<span>{task.dueDate}</span>
							<div className='flex gap-2'>
								<select
									value={task.status}
									onChange={(e) =>
										onTaskUpdate(task.id, { status: e.target.value })
									}
									className={`text-white py-1 rounded text-center ${
										task.status === 'To Do'
											? 'bg-blue-500'
											: task.status === 'In Progress'
											? 'bg-green-500'
											: 'bg-gray-500'
									}`}>
									<option value='To Do'>To Do</option>
									<option value='In Progress'>In Progress</option>
									<option value='Done'>Done</option>
								</select>
								<button
									onClick={() => onTaskDelete(task.id)}
									className='bg-red-500 text-white py-1 px-2 rounded'>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>

				{/* Add Task Section */}
				<form
					onSubmit={handleAddTask} // Submit on Enter
					className='mt-4 flex flex-col gap-2'>
					<input
						type='text'
						placeholder='Task Title'
						value={newTaskTitle}
						onChange={(e) => setNewTaskTitle(e.target.value)}
						className='border rounded px-4 py-2 w-full'
					/>
					<input
						type='text'
						placeholder='Task Description'
						value={newTaskDescription}
						onChange={(e) => setNewTaskDescription(e.target.value)}
						className='border rounded px-4 py-2 w-full'
					/>
					<input
						type='date'
						value={newTaskDueDate}
						onChange={(e) => setNewTaskDueDate(e.target.value)}
						className='border rounded px-4 py-2 w-full'
					/>
					<button
						type='submit' // Submit button
						className='bg-green-500 text-white px-4 py-2 rounded w-full'>
						Add Task
					</button>
				</form>

				<button
					onClick={closeModal}
					className='mt-6 bg-gray-500 text-white px-4 py-2 rounded'>
					Close
				</button>
			</div>
		</div>
	);
}
