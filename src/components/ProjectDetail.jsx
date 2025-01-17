import React from 'react';
import { useParams } from 'react-router-dom';
import KanbanBoard from './KanbanBoard';

export default function ProjectDetail() {
	const { id } = useParams();
	return (
		<>
			<h1>Project Details for ID: {id}</h1>
			<KanbanBoard />
		</>
	);
}
