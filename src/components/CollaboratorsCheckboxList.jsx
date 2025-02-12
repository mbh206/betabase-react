// src/components/CollaboratorsCheckboxList.jsx
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

export default function CollaboratorsCheckboxList({
	value,
	onChange,
	currentUser,
}) {
	const [connectedUsers, setConnectedUsers] = useState([]);

	useEffect(() => {
		async function fetchConnectedUsers() {
			try {
				// Query for connections where currentUser is the requester and accepted.
				const q1 = query(
					collection(db, 'connections'),
					where('requester', '==', currentUser.uid),
					where('status', '==', 'accepted')
				);
				const snapshot1 = await getDocs(q1);
				const conns1 = snapshot1.docs.map((doc) => doc.data());

				// Query for connections where currentUser is the recipient and accepted.
				const q2 = query(
					collection(db, 'connections'),
					where('recipient', '==', currentUser.uid),
					where('status', '==', 'accepted')
				);
				const snapshot2 = await getDocs(q2);
				const conns2 = snapshot2.docs.map((doc) => doc.data());

				// Merge the two sets of connections.
				const allConns = [...conns1, ...conns2];
				const uidsSet = new Set();
				allConns.forEach((conn) => {
					// Determine the "other" user's UID.
					const otherUid =
						conn.requester === currentUser.uid
							? conn.recipient
							: conn.requester;
					uidsSet.add(otherUid);
				});
				const uids = Array.from(uidsSet);

				// Fetch user profiles for each connected UID.
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

	// When a checkbox is toggled, update the array of selected collaborator UIDs.
	const toggleUser = (uid) => {
		if (value.includes(uid)) {
			// Remove uid.
			onChange(value.filter((item) => item !== uid));
		} else {
			// Add uid.
			onChange([...value, uid]);
		}
	};

	return (
		<div className='pb-2'>
			{connectedUsers.map((user) => (
				<div
					key={user.uid}
					className='flex items-center'>
					<input
						type='checkbox'
						id={`collab-${user.uid}`}
						checked={value.includes(user.uid)}
						onChange={() => toggleUser(user.uid)}
						className='form-checkbox'
					/>
					<label
						htmlFor={`collab-${user.uid}`}
						className='ml-2 text-gray-600 '>
						{user.displayName ? user.displayName : user.email}
					</label>
				</div>
			))}
		</div>
	);
}
