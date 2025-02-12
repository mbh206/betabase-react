import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function sendFriendRequestAcceptedNotification(
	recipientUid,
	accepterProfile
) {
	try {
		await addDoc(collection(db, 'notifications'), {
			recipient: recipientUid,
			message: `${
				accepterProfile.displayName || accepterProfile.email
			} accepted your friend request.`,
			type: 'friend_request_accepted',
			timestamp: serverTimestamp(),
			read: false,
		});
	} catch (error) {
		console.error('Error sending notification:', error);
	}
}
