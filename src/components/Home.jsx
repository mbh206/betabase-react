import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
	const [projects, setProjects] = useState([]);
	const [stats, setStats] = useState({ activeProjects: 0, completedTasks: 0 });

	useEffect(() => {
		const fetchData = async () => {
			const projectsCollection = collection(db, 'projects');
			const projectsSnapshot = await getDocs(projectsCollection);

			const projectsData = projectsSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			// Calculate stats
			const activeProjects = projectsData.length;
			const completedTasks = projectsData.reduce(
				(total, project) => total + project.completedTasks || 0,
				0
			);

			setProjects(projectsData);
			setStats({ activeProjects, completedTasks });
		};

		fetchData();
	}, []);

	return (
		<div className='p-4'>
			<h1 className='text-3xl font-bold mb-4'>Dashboard</h1>
			<div className='grid grid-cols-2 gap-4 mb-8'>
				<div className='p-4 bg-blue-500 text-white rounded'>
					<h2 className='text-lg'>Active Projects</h2>
					<p className='text-2xl'>{stats.activeProjects}</p>
				</div>
				<div className='p-4 bg-green-500 text-white rounded'>
					<h2 className='text-lg'>Completed Tasks</h2>
					<p className='text-2xl'>{stats.completedTasks}</p>
				</div>
			</div>
			<div className='mb-8'>
				<h2 className='text-2xl font-semibold mb-4'>Recent Projects</h2>
				{projects.length > 0 ? (
					<ul className='space-y-2'>
						{projects.slice(0, 5).map((project) => (
							<li
								key={project.id}
								className='p-4 border rounded shadow-sm flex justify-between'>
								<span>{project.name}</span>
								<button
									className='bg-blue-500 text-white px-4 py-2 rounded'
									onClick={() =>
										(window.location.href = `/projects/${project.id}`)
									}>
									View
								</button>
							</li>
						))}
					</ul>
				) : (
					<p>No projects to display.</p>
				)}
			</div>
			<div>
				<button
					className='bg-green-500 text-white px-6 py-3 rounded shadow'
					onClick={() => (window.location.href = '/projects/add')}>
					Start New Project
				</button>
			</div>
		</div>
	);
}
