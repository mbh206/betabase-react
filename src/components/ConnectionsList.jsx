// src/components/ConnectionsList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
} from 'firebase/firestore';

export default function ConnectionsList() {
	const { currentUser } = useAuth();
	const [connections, setConnections] = useState([]);
	const [userMap, setUserMap] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchConnections() {
			try {
				// Query connections where the current user is the requester and status is accepted.
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

				// Query connections where the current user is the recipient and status is accepted.
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

				// Merge the two arrays
				const allConns = [...conns1, ...conns2];
				setConnections(allConns);

				// Build a set of UIDs for the "other" user.
				const uidsSet = new Set();
				allConns.forEach((conn) => {
					// Determine the "other" user UID.
					const otherUid =
						conn.requester === currentUser.uid
							? conn.recipient
							: conn.requester;
					uidsSet.add(otherUid);
				});
				const uids = Array.from(uidsSet);

				// Now, fetch user profiles for each UID.
				const newUserMap = {};
				await Promise.all(
					uids.map(async (uid) => {
						const userDoc = await getDoc(doc(db, 'users', uid));
						if (userDoc.exists()) {
							newUserMap[uid] = userDoc.data();
						}
					})
				);
				setUserMap(newUserMap);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching connections:', error);
				setLoading(false);
			}
		}
		fetchConnections();
	}, [currentUser]);

	return (
		<div className='p-4 border rounded'>
			<h2 className='text-xl font-bold mb-2'>Your Connections</h2>
			{loading ? (
				<p>Loading connections...</p>
			) : connections.length === 0 ? (
				<p>You have no connections yet.</p>
			) : (
				<ul>
					{connections.map((conn) => {
						const otherUid =
							conn.requester === currentUser.uid
								? conn.recipient
								: conn.requester;
						const user = userMap[otherUid];
						return (
							<li key={conn.id}>
								{user
									? user.username || user.email // Show the friendly name if available.
									: otherUid}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
