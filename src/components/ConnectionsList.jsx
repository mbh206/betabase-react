import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import {
	collection,
	query,
	where,
	onSnapshot,
	doc,
	getDoc,
} from 'firebase/firestore';

export default function ConnectionsList() {
	const { currentUser } = useAuth();
	const [connections, setConnections] = useState([]);
	const [userMap, setUserMap] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!currentUser) return;

		const requesterQuery = query(
			collection(db, 'connections'),
			where('requester', '==', currentUser.uid),
			where('status', '==', 'accepted')
		);

		const recipientQuery = query(
			collection(db, 'connections'),
			where('recipient', '==', currentUser.uid),
			where('status', '==', 'accepted')
		);

		const unsubscribeRequester = onSnapshot(requesterQuery, (snapshot) => {
			const reqConns = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setConnections((prev) => {
				const filtered = prev.filter(
					(conn) => conn.requester !== currentUser.uid
				);
				return [...filtered, ...reqConns];
			});
		});

		const unsubscribeRecipient = onSnapshot(recipientQuery, (snapshot) => {
			const recConns = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setConnections((prev) => {
				const filtered = prev.filter(
					(conn) => conn.recipient !== currentUser.uid
				);
				return [...filtered, ...recConns];
			});
		});

		return () => {
			unsubscribeRequester();
			unsubscribeRecipient();
		};
	}, [currentUser]);

	useEffect(() => {
		async function updateUserMap() {
			const uidsSet = new Set();
			connections.forEach((conn) => {
				const otherUid =
					conn.requester === currentUser.uid ? conn.recipient : conn.requester;
				uidsSet.add(otherUid);
			});
			const uids = Array.from(uidsSet);
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
		}
		if (currentUser) {
			updateUserMap();
		}
	}, [connections, currentUser]);

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
								{user ? user.username || user.email : otherUid}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
