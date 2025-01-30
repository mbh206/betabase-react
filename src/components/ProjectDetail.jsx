import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import {
	doc,
	getDoc,
	collection,
	addDoc,
	updateDoc,
	deleteDoc,
} from 'firebase/firestore';
import TaskList from './TaskList';

export default function ProjectDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [project, setProject] = useState(null);
	const [tasks, setTasks] = useState(null);
	const [editing, setEditing] = useState(false);
	const [updatedProject, setUpdatedProject] = useState({
		name: '',
		description: '',
	});

	React.useEffect(() => {
		const fetchProject = async () => {
			const docRef = doc(db, 'projects', id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setProject({ id: docSnap.id, ...docSnap.data() });
				setUpdatedProject({
					name: docSnap.data().name,
					description: docSnap.data().description,
				});
			} else {
				console.error('No such project!');
			}
		};
		fetchProject();
	}, [id]);

	const handleUpdate = async () => {
		const docRef = doc(db, 'projects', id);
		await updateDoc(docRef, updatedProject);
		setProject({ ...project, ...updatedProject });
		setEditing(false);
	};

	const handleTaskAdd = async (taskDetails) => {
		const taskRef = collection(db, 'projects', id, 'tasks');
		const newTask = await addDoc(taskRef, taskDetails);
		setTasks((prev) => [...prev, { id: newTask.id, ...taskDetails }]);
	};

	const handleDelete = async () => {
		const docRef = doc(db, 'projects', id);
		await deleteDoc(docRef);
		navigate('/projects');
	};

	if (!project) return <p>Loading...</p>;

	return (
		<div className='p-6'>
			{editing ? (
				<div>
					<input
						type='text'
						value={updatedProject.name}
						onChange={(e) =>
							setUpdatedProject({ ...updatedProject, name: e.target.value })
						}
						className='border p-2 mb-4 block'
					/>
					<textarea
						value={updatedProject.description}
						onChange={(e) =>
							setUpdatedProject({
								...updatedProject,
								description: e.target.value,
							})
						}
						className='border p-2 mb-4 block'
					/>
					<button
						onClick={handleUpdate}
						className='bg-blue-500 text-white px-4 py-2 rounded'>
						Save
					</button>
					<button
						onClick={() => setEditing(false)}
						className='bg-gray-300 text-black px-4 py-2 rounded ml-2'>
						Cancel
					</button>
				</div>
			) : (
				<div>
					<h1 className='text-2xl font-bold'>{project.name}</h1>
					<p>{project.description}</p>
					<button
						onClick={() => setEditing(true)}
						className='bg-yellow-500 text-white px-4 py-2 rounded mr-2'>
						Edit
					</button>
					<button
						onClick={handleDelete}
						className='bg-red-500 text-white px-4 py-2 rounded'>
						Delete
					</button>
				</div>
			)}
			<TaskList projectId={id} />
		</div>
	);
}
