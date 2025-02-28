import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import {
	collection,
	query,
	where,
	getDocs,
	addDoc,
	serverTimestamp,
} from 'firebase/firestore';
import { sendFriendRequestNotification } from '../utils/notifications';

export default function FriendRequestForm() {
	const { currentUser } = useAuth();
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');

	const sendRequest = async () => {
		if (!email) return;
		try {
			const usersRef = collection(db, 'users');
			const q = query(usersRef, where('email', '==', email));
			const snapshot = await getDocs(q);
			if (snapshot.empty) {
				setMessage('No user found with that email.');
				return;
			}
			const recipientDoc = snapshot.docs[0];
			const recipientUid = recipientDoc.id;

			const connectionsRef = collection(db, 'connections');
			await addDoc(connectionsRef, {
				requester: currentUser.uid,
				recipient: recipientUid,
				status: 'pending',
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});

			await sendFriendRequestNotification(recipientUid, {
				uid: currentUser.uid,
				displayName: currentUser.displayName,
				email: currentUser.email,
			});

			setMessage('Friend request sent.');
			setEmail('');
		} catch (error) {
			console.error('Error sending friend request:', error);
			setMessage('Error sending friend request.');
		}
	};

	return (
		<div className='p-4 border rounded mb-4'>
			<h2 className='text-xl font-bold mb-2'>Send Friend Request</h2>
			<input
				type='email'
				placeholder='Enter user email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='border p-2 rounded w-full mb-2'
			/>
			<button
				onClick={sendRequest}
				className='bg-teal-500 text-white px-4 py-2 rounded'>
				Send Request
			</button>
			{message && <p className='mt-2'>{message}</p>}
		</div>
	);
}
