// src/components/Notifications.jsx
import React, { useEffect, useState } from 'react';
import {
	collection,
	query,
	where,
	onSnapshot,
	orderBy,
	updateDoc,
	doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';

export default function Notifications() {
	const { currentUser } = useAuth();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		if (!currentUser) return;

		// Build a query for notifications where recipient equals the current user's uid
		const q = query(
			collection(db, 'notifications'),
			where('recipient', '==', currentUser.uid),
			orderBy('timestamp', 'desc')
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const notifs = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setNotifications(notifs);
		});

		return () => unsubscribe();
	}, [currentUser]);

	// Function to mark a notification as read
	const markAsRead = async (notifId) => {
		try {
			await updateDoc(doc(db, 'notifications', notifId), { read: true });
		} catch (error) {
			console.error('Error marking notification as read:', error);
		}
	};

	return (
		<div className='notifications-panel p-2 border rounded bg-white shadow-md max-w-sm'>
			<h3 className='text-lg font-bold mb-2'>Notifications</h3>
			{notifications.length === 0 && <p>No new notifications.</p>}
			<ul>
				{notifications.map((notif) => (
					<li
						key={notif.id}
						className={`p-2 border-b ${
							notif.read ? 'bg-gray-100' : 'bg-white'
						}`}>
						<p>{notif.message}</p>
						<small>
							{notif.timestamp ? notif.timestamp.toDate().toLocaleString() : ''}
						</small>
						{!notif.read && (
							<button
								onClick={() => markAsRead(notif.id)}
								className='ml-2 text-blue-500 text-xs'>
								Mark as read
							</button>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
