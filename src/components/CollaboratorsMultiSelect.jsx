import React, { useState, useEffect } from 'react';
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export default function CollaboratorsMultiSelect({
	value,
	onChange,
	currentUser,
}) {
	const [connectedUsers, setConnectedUsers] = useState([]);

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

				const usersArray = await Promise.all(
					uids.map(async (uid) => {
						const userDoc = await getDoc(doc(db, 'users', uid));
						if (userDoc.exists()) {
							return { uid, ...userDoc.data() };
						}
						return { uid, username: uid, email: uid };
					})
				);
				setConnectedUsers(usersArray);
			} catch (error) {
				console.error('Error fetching connected users:', error);
			}
		}
		fetchConnectedUsers();
	}, [currentUser]);

	return (
		<select
			multiple
			value={value}
			onChange={(e) => {
				const options = Array.from(e.target.selectedOptions);
				const selected = options.map((option) => option.value);
				onChange(selected);
			}}
			className='border p-1 rounded w-full mb-2'>
			{connectedUsers.map((user) => (
				<option
					key={user.uid}
					value={user.uid}>
					{user.displayName || user.email}
				</option>
			))}
		</select>
	);
}
