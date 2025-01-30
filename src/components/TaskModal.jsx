// TaskModal.jsx
import React from 'react';

export default function TaskModal({ task, onClose, onDeleteTask }) {
	if (!task) return null;

	const handleDelete = () => {
		if (onDeleteTask) onDeleteTask(task); // calls parent's deletion logic
		onClose();
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50'>
			<div
				className='absolute inset-0'
				onClick={onClose}
			/>
			<div className='relative bg-white w-11/12 max-w-2xl p-6 rounded shadow-md'>
				<h2 className='text-2xl font-bold mb-4'>{task.title}</h2>
				<p className='text-gray-600 mb-4'>{task.description}</p>
				<p className='text-gray-400 text-sm mb-4'>
					Due Date: {task.dueDate || 'None'}
				</p>

				<div className='flex justify-between items-center mt-6'>
					{/* Delete Task button */}
					{onDeleteTask && (
						<button
							onClick={handleDelete}
							className='bg-red-600 text-white px-4 py-2 rounded'>
							Delete Task
						</button>
					)}

					<button
						onClick={onClose}
						className='bg-gray-500 text-white px-4 py-2 rounded'>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
