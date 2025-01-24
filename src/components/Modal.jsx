import React from 'react';

export default function Modal({
	isOpen,
	closeModal,
	project,
	tasks,
	onTaskAdd,
	onTaskUpdate,
	onTaskDelete,
}) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white w-11/12 max-w-2xl p-6 rounded shadow-md'>
				<h2 className='text-2xl font-bold mb-4'>{project.name}</h2>
				<p className='text-gray-600 mb-6'>{project.description}</p>

				<h3 className='text-xl font-semibold mb-4'>Tasks</h3>
				<ul className='space-y-2'>
					{tasks.map((task) => (
						<li
							key={task.id}
							className='p-2 border rounded flex justify-between'>
							<span>
								{task.title} ({task.status})
							</span>
							<div>
								<button
									onClick={() => onTaskUpdate(task)}
									className='bg-blue-500 text-white px-4 py-1 rounded mr-2'>
									Update
								</button>
								<button
									onClick={() => onTaskDelete(task.id)}
									className='bg-red-500 text-white px-4 py-1 rounded'>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>

				<button
					onClick={closeModal}
					className='mt-6 bg-gray-500 text-white px-4 py-2 rounded'>
					Close
				</button>
			</div>
		</div>
	);
}
