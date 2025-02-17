import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function sendFriendRequestNotification(
	recipientUid,
	requesterProfile
) {
	try {
		await addDoc(collection(db, 'notifications'), {
			recipient: recipientUid,
			fromUid: requesterProfile.uid || '',
			message: `${
				requesterProfile.displayName || requesterProfile.email
			} sent you a friend request`,
			type: 'friend_request_sent',
			timestamp: serverTimestamp(),
			read: false,
		});
	} catch (error) {
		console.error('Error sending friend request notification:', error);
	}
}

export async function sendFriendRequestAcceptedNotification(
	recipientUid,
	accepterProfile
) {
	try {
		await addDoc(collection(db, 'notifications'), {
			recipient: recipientUid,
			fromUid: accepterProfile.uid || '',
			message: `${
				accepterProfile.displayName || accepterProfile.email
			} has accepted your friend request`,
			type: 'friend_request_accepted',
			timestamp: serverTimestamp(),
			read: false,
		});
	} catch (error) {
		console.error('Error sending accepted friend request notification:', error);
	}
}
