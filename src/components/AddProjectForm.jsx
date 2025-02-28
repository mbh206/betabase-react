import React, { useState, useEffect } from 'react';
import CollaboratorsCheckboxList from './CollaboratorsCheckboxList';
import { useAuth } from '../AuthContext';
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export default function AddProjectForm({
	newProjectName,
	newProjectDescription,
	setNewProjectName,
	setNewProjectDescription,
	handleAddProject,
	onClose,
}) {
	const { currentUser } = useAuth();
	const [connectedUsers, setConnectedUsers] = useState([]);
	const [selectedCollaborators, setSelectedCollaborators] = useState([]);

	useEffect(() => {
		async function fetchConnectedUsers() {
			try {
				const q1 = query(
					collection(db, 'connections'),
					where('requester', '==', currentUser.uid),
					where('status', '==', 'accepted')
				);
				const snapshot1 = await getDocs(q1);
				const conns1 = snapshot1.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				const q2 = query(
					collection(db, 'connections'),
					where('recipient', '==', currentUser.uid),
					where('status', '==', 'accepted')
				);
				const snapshot2 = await getDocs(q2);
				const conns2 = snapshot2.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				const allConns = [...conns1, ...conns2];

				const uidsSet = new Set();
				allConns.forEach((conn) => {
					const otherUid =
						conn.requester === currentUser.uid
							? conn.recipient
							: conn.requester;
					uidsSet.add(otherUid);
				});
				const uids = Array.from(uidsSet);

				const connectedUsersArray = await Promise.all(
					uids.map(async (uid) => {
						const userDoc = await getDoc(doc(db, 'users', uid));
						if (userDoc.exists()) {
							return { uid, ...userDoc.data() };
						}
						return { uid, username: uid, email: uid };
					})
				);
				setConnectedUsers(connectedUsersArray);
			} catch (error) {
				console.error('Error fetching connected users:', error);
			}
		}

		fetchConnectedUsers();
	}, [currentUser]);

	const onSubmit = () => {
		handleAddProject(selectedCollaborators);
		if (onClose) onClose();
	};

	return (
		<div>
			<input
				type='text'
				placeholder='Project Name'
				value={newProjectName}
				onChange={(e) => setNewProjectName(e.target.value)}
				className='text-gray-500 border p-1 rounded w-full mb-2'
			/>
			<input
				type='text'
				placeholder='Project Description'
				value={newProjectDescription}
				onChange={(e) => setNewProjectDescription(e.target.value)}
				className='text-gray-500 border p-1 rounded w-full mb-2'
			/>
			<label className='block text-gray-700 mb-1'>Select Collaborators:</label>
			<CollaboratorsCheckboxList
				value={selectedCollaborators}
				onChange={setSelectedCollaborators}
				currentUser={currentUser}
			/>
			<button
				onClick={onSubmit}
				className='bg-sky-500 text-white px-4 py-2 rounded w-full mb-2'>
				Add Project
			</button>
		</div>
	);
}
