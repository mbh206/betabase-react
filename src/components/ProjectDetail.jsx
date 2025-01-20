import React from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from './KanbanBoard';

export default function ProjectDetail() {
	const { name } = useParams();
	return (
		<>
			<h1 className='text-3xl font-bold underline'>
				Project Details for: {name}
			</h1>
			<KanbanBoard />
		</>
	);
}
