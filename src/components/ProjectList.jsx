import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function ProjectList() {
	const [projects, setProjects] = useState([]);
	const [newProject, setNewProject] = useState({ name: '', description: '' });

	useEffect(() => {
		const fetchProjects = async () => {
			const querySnapshot = await getDocs(collection(db, 'projects'));
			const projectData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setProjects(projectData);
		};
		fetchProjects();
	}, []);

	const handleCreate = async () => {
		const docRef = await addDoc(collection(db, 'projects'), newProject);
		setProjects([...projects, { id: docRef.id, ...newProject }]);
		setNewProject({ name: '', description: '' });
	};

	return (
		<>
			<h1 className='text-2xl font-bold mb-4'>Projects</h1>
			<div className='mb-4'>
				<input
					type='text'
					placeholder='Project Name'
					value={newProject.name}
					onChange={(e) =>
						setNewProject({ ...newProject, name: e.target.value })
					}
					className='border p-2 mr-2'
				/>
				<input
					type='text'
					placeholder='Description'
					value={newProject.description}
					onChange={(e) =>
						setNewProject({ ...newProject, description: e.target.value })
					}
					className='border p-2 mr-2'
				/>
				<button
					onClick={handleCreate}
					className='bg-blue-500 text-white px-4 py-2 rounded'>
					Add Project
				</button>
			</div>
			<ul className='space-y-2'>
				{projects.map((project) => (
					<li
						key={project.id}
						className='bg-gray-100 p-4 rounded shadow'>
						<Link
							to={`/projects/${project.id}`}
							className='text-blue-500'>
							{project.name}
						</Link>
						<p>{project.description}</p>
					</li>
				))}
			</ul>
		</>
	);
}
