import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import {
	collection,
	query,
	where,
	getDocs,
	updateDoc,
	doc,
	getDoc,
	serverTimestamp,
} from 'firebase/firestore';
import { sendFriendRequestAcceptedNotification } from '../utils/notifications';

export default function IncomingFriendRequests() {
	const { currentUser } = useAuth();
	const [requests, setRequests] = useState([]);

	useEffect(() => {
		async function fetchRequests() {
			try {
				const q = query(
					collection(db, 'connections'),
					where('recipient', '==', currentUser.uid),
					where('status', '==', 'pending')
				);
				const snapshot = await getDocs(q);
				const reqs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setRequests(reqs);
			} catch (error) {
				console.error('Error fetching friend requests:', error);
			}
		}
		fetchRequests();
	}, [currentUser]);

	const handleResponse = async (id, accepted, requesterUid) => {
		try {
			const requestRef = doc(db, 'connections', id);
			await updateDoc(requestRef, {
				status: accepted ? 'accepted' : 'rejected',
				updatedAt: serverTimestamp(),
			});
			// Remove the request from local state
			setRequests((prev) => prev.filter((req) => req.id !== id));
			if (accepted) {
				const requesterDoc = await getDoc(doc(db, 'users', requesterUid));
				if (requesterDoc.exists()) {
					const requesterProfile = requesterDoc.data();
					await sendFriendRequestAcceptedNotification(
						requesterUid,
						requesterProfile
					);
				}
			}
		} catch (error) {
			console.error('Error updating friend request:', error);
		}
	};

	return (
		<div className='p-4 border rounded mb-4'>
			<h2 className='text-xl font-bold mb-2'>Incoming Friend Requests</h2>
			{requests.length === 0 ? (
				<p>No pending requests.</p>
			) : (
				<ul>
					{requests.map((req) => (
						<li
							key={req.id}
							className='mb-2'>
							<span className='mr-2'>
								{/* For simplicity, display the requester UID. In production, join with the /users collection. */}
								From: {req.requester}
							</span>
							<button
								onClick={() => handleResponse(req.id, true, req.requester)}
								className='bg-green-500 text-white px-2 py-1 rounded mr-2'>
								Accept
							</button>
							<button
								onClick={() => handleResponse(req.id, false, req.requester)}
								className='bg-red-500 text-white px-2 py-1 rounded'>
								Reject
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
