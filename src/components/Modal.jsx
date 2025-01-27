import React, { useState } from 'react';

export default function Modal({
	isOpen,
	closeModal,
	project,
	tasks,
	onTaskAdd,
	onTaskUpdate,
	onTaskDelete,
	onDeleteProject,
}) {
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskDescription, setNewTaskDescription] = useState('');
	const [newTaskDueDate, setNewTaskDueDate] = useState('');
	const [selectedStep, setSelectedStep] = useState(0);

	if (!isOpen || !project) return null;

	const steps = project.steps || []; // Ensure steps is always an array

	const handleAddTask = (e) => {
		e.preventDefault();
		if (newTaskTitle.trim() === '') return;

		onTaskAdd({
			title: newTaskTitle,
			description: newTaskDescription,
			dueDate: newTaskDueDate,
			step: selectedStep,
			status: 'To Do',
		});

		setNewTaskTitle('');
		setNewTaskDescription('');
		setNewTaskDueDate('');
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'>
			<div
				onClick={closeModal}
				className='fixed inset-0 z-0'></div>
			<div className='bg-white w-11/12 max-w-100 p-3 rounded shadow-md z-50'>
				<h2 className='text-2xl font-bold mb-4'>{project.name}</h2>
				<p className='text-gray-600 mb-6'>{project.description}</p>
				<div className='flex gap-2 overflow-x-scroll justify-between'>
					{steps.map((step, index) => (
						<button
							key={index}
							className={`px-2 py-1 rounded text-xs ${
								index === selectedStep
									? 'bg-blue-500 text-white'
									: 'bg-gray-200'
							}`}
							onClick={() => setSelectedStep(index)}>
							{step.title}
						</button>
					))}
				</div>
				<div className='mt-4'>
					<h3 className='text-lg font-bold'>{steps[selectedStep]?.title}</h3>
					<p>
						{steps[selectedStep]?.description || 'No description available.'}
					</p>

					{/* Render tasks related to this step */}
					<ul>
						{tasks
							.filter((task) => task.step === selectedStep)
							.map((task) => (
								<li
									key={task.id}
									className='flex justify-between'>
									<span>{task.title}</span>
									<span>{task.description}</span>
									<span>{task.dueDate ? task.dueDate : 'No Due Date'}</span>
								</li>
							))}
					</ul>
				</div>

				{/* Task Management */}
				<form
					onSubmit={handleAddTask}
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
						type='submit'
						className='bg-green-500 text-white px-4 py-2 rounded w-full'>
						Add Task
					</button>
				</form>

				<div className='flex justify-between'>
					<button
						onClick={closeModal}
						className='mt-6 bg-gray-500 text-white px-4 py-2 rounded'>
						Close
					</button>
					<button
						onClick={() => {
							onDeleteProject(project.id);
							closeModal();
						}}
						className='mt-6 bg-red-700 text-white px-4 py-2 rounded'>
						Delete Project
					</button>
				</div>
			</div>
		</div>
	);
}
