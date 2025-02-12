// src/components/Notifications.jsx
import React, { useEffect, useState } from 'react';
import {
	collection,
	query,
	where,
	onSnapshot,
	orderBy,
	updateDoc,
	deleteDoc,
	doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Notifications() {
	const { currentUser } = useAuth();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		if (!currentUser) return;
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

	const markAsRead = async (notifId) => {
		try {
			await updateDoc(doc(db, 'notifications', notifId), { read: true });
		} catch (error) {
			console.error('Error marking notification as read:', error);
		}
	};

	const dismissNotification = async (notifId) => {
		try {
			await deleteDoc(doc(db, 'notifications', notifId));
			setNotifications((prevNotifs) =>
				prevNotifs.filter((notif) => notif.id !== notifId)
			);
		} catch (error) {
			console.error('Error dismissing notification:', error);
		}
	};

	return (
		<div className=''>
			<h3 className='text-sm ml-2 text-gray-600 py-1'>Notifications</h3>
			{notifications.length === 0 ? (
				<p className='text-xs ml-2 text-gray-400 py-1'>No new notifications.</p>
			) : (
				<ul className='border flex flex-col'>
					{notifications.map((notif) => {
						let linkTarget = null;
						if (notif.type === 'friend_request_sent') {
							linkTarget = '/profile/';
						} else if (
							notif.type === 'friend_request_accepted' &&
							notif.fromUid
						) {
							linkTarget = `/profile/`;
						}
						return (
							<li
								key={notif.id}
								className={`text-xs p-2 border-b ${
									notif.read ? 'bg-gray-100' : 'bg-white'
								}`}>
								<div className='flex justify-between items-center'>
									<div>
										{linkTarget ? (
											<Link
												to={linkTarget}
												onClick={() => markAsRead(notif.id)}>
												<p>{notif.message}</p>
											</Link>
										) : (
											<p>{notif.message}</p>
										)}
										<small>
											{notif.timestamp
												? notif.timestamp.toDate().toLocaleString()
												: ''}
										</small>
									</div>
									<button
										onClick={() => dismissNotification(notif.id)}
										className='ml-2 text-red-500 text-xs'
										aria-label='Dismiss notification'>
										&times;
									</button>
								</div>
							</li>
						);
					})}
				</ul>
				// <ul className='border flex flex-col'>
				// 	{notifications.map((notif) => (
				// 		<li
				// 			key={notif.id}
				// 			className={`text-xs p-2 border-b ${
				// 				notif.read ? 'bg-gray-100' : 'bg-white'
				// 			}`}>
				// 			<p>{notif.message}</p>
				// 			<small>
				// 				{notif.timestamp
				// 					? notif.timestamp.toDate().toLocaleString()
				// 					: ''}
				// 			</small>
				// 			{!notif.read && (
				// 				<button
				// 					onClick={() => markAsRead(notif.id)}
				// 					className='ml-2 text-blue-500 text-xs'>
				// 					Mark as read
				// 				</button>
				// 			)}
				// 		</li>
				// 	))}
				// </ul>
			)}
		</div>
	);
}
