import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import {
	collection,
	query,
	where,
	getDocs,
	onSnapshot,
	doc,
	getDoc,
	deleteDoc,
} from 'firebase/firestore';

export default function ConnectionsList() {
	const { currentUser } = useAuth();
	const [connections, setConnections] = useState([]);
	const [userMap, setUserMap] = useState({});
	const [loading, setLoading] = useState(true);

	const handleDeleteConnection = async (connectionId) => {
		try {
			await deleteDoc(doc(db, 'connections', connectionId));
			setConnections((prev) => prev.filter((conn) => conn.id !== connectionId));
		} catch (error) {
			console.error('Error deleting connection:', error);
		}
	};

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
							<li
								key={conn.id}
								className='flex justify-between border-b pb-1'>
								<span className='uppercase'>
									{user ? user.displayName || user.email : otherUid}
								</span>
								<button
									onClick={() => handleDeleteConnection(conn.id)}
									className='text-red-500 hover:text-red-700'
									title='Delete connection'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										strokeWidth={1.5}
										stroke='currentColor'
										className='size-8 p-1 bg-red-400 text-white rounded-full border shadow-sm hover:shadow-lg active:shadow-xs'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z'
										/>
									</svg>
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
