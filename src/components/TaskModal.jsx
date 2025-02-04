// src/components/Dashboard/TaskModal.jsx
import React, { useState, useEffect } from 'react';

export default function TaskModal({ task, onClose, onSave }) {
	// Create a local copy of the task to allow editing without immediate save
	const [localTask, setLocalTask] = useState(task);

	// When the task prop changes, update the local state
	useEffect(() => {
		setLocalTask(task);
	}, [task]);

	// Handler for local changes
	const handleLocalChange = (field, value) => {
		setLocalTask((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div
			className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
			onClick={onClose}>
			<div
				className='bg-white p-6 rounded shadow-lg w-full max-w-2xl'
				onClick={(e) => e.stopPropagation()}>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-bold'>Edit Task Details</h2>
					<button
						onClick={onClose}
						className='text-gray-500'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-6 h-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>
				<form>
					<div className='mb-2'>
						<label className='block text-sm font-medium'>Title</label>
						<input
							type='text'
							className='border p-1 rounded w-full'
							value={localTask.title}
							onChange={(e) => handleLocalChange('title', e.target.value)}
						/>
					</div>
					<div className='mb-2'>
						<label className='block text-sm font-medium'>Description</label>
						<textarea
							className='border p-1 rounded w-full'
							value={localTask.description}
							onChange={(e) => handleLocalChange('description', e.target.value)}
						/>
					</div>
					<div className='mb-2'>
						<label className='block text-sm font-medium'>Priority</label>
						<select
							className='border p-1 rounded w-full'
							value={localTask.priority}
							onChange={(e) => handleLocalChange('priority', e.target.value)}>
							<option value='High'>High</option>
							<option value='Medium'>Medium</option>
							<option value='Low'>Low</option>
						</select>
					</div>
					<div className='mb-2'>
						<label className='block text-sm font-medium'>Status</label>
						<select
							className='border p-1 rounded w-full'
							value={localTask.status}
							onChange={(e) => handleLocalChange('status', e.target.value)}>
							<option value='To Do'>To Do</option>
							<option value='In Progress'>In Progress</option>
							<option value='Done'>Done</option>
						</select>
					</div>
					<div className='mb-2'>
						<label className='block text-sm font-medium'>
							Issues (comma separated)
						</label>
						<input
							type='text'
							className='border p-1 rounded w-full'
							value={(localTask.issues || []).join(', ')}
							onChange={(e) =>
								handleLocalChange(
									'issues',
									e.target.value.split(',').map((s) => s.trim())
								)
							}
						/>
					</div>
					<div className='mb-2'>
						<label className='block text-sm font-medium'>
							Challenges (comma separated)
						</label>
						<input
							type='text'
							className='border p-1 rounded w-full'
							value={(localTask.challenges || []).join(', ')}
							onChange={(e) =>
								handleLocalChange(
									'challenges',
									e.target.value.split(',').map((s) => s.trim())
								)
							}
						/>
					</div>
					<div className='mb-2'>
						<label className='block text-sm font-medium'>Awaiting</label>
						<input
							type='text'
							className='border p-1 rounded w-full'
							value={localTask.awaiting || ''}
							onChange={(e) => handleLocalChange('awaiting', e.target.value)}
						/>
					</div>
					<div className='mb-2'>
						<label className='block text-sm font-medium'>Assignee</label>
						<input
							type='text'
							className='border p-1 rounded w-full'
							value={localTask.assignee || ''}
							onChange={(e) => handleLocalChange('assignee', e.target.value)}
						/>
					</div>
					<div className='flex justify-end mt-4 space-x-2'>
						<button
							type='button'
							className='bg-gray-500 text-white px-4 py-2 rounded'
							onClick={onClose}>
							Cancel
						</button>
						<button
							type='button'
							className='bg-blue-500 text-white px-4 py-2 rounded'
							onClick={() => onSave(localTask)}>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
