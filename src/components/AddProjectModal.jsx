import React from 'react';
import AddProjectForm from './AddProjectForm';

export default function AddProjectModal({ isOpen, onClose, ...formProps }) {
	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
			onClick={onClose}>
			<div
				className='relative bg-white px-4 pb-2 pt-0 rounded shadow-lg w-full max-w-lg'
				onClick={(e) => e.stopPropagation()}>
				<button
					onClick={onClose}
					className='absolute top-2 right-2 text-gray-600 hover:text-gray-900'
					aria-label='Close modal'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>

				<h2 className='text-xl font-bold mb-4'>Create New Project</h2>
				<AddProjectForm
					{...formProps}
					onClose={onClose}
				/>
			</div>
		</div>
	);
}
