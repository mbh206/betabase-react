import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Creates a notification for a friend request sent event.
 * @param {string} recipientUid - The UID of the user receiving the notification.
 * @param {object} requesterProfile - The profile object of the user sending the friend request.
 */
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
			} sent you a friend request.`,
			type: 'friend_request_sent',
			timestamp: serverTimestamp(),
			read: false,
		});
	} catch (error) {
		console.error('Error sending friend request notification:', error);
	}
}
/**
 * Creates a notification when a friend request is accepted.
 * @param {string} recipientUid - UID of the original requester.
 * @param {object} accepterProfile - Object with uid, displayName, and email of the accepter.
 */

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
			} accepted your friend request.`,
			type: 'friend_request_accepted',
			timestamp: serverTimestamp(),
			read: false,
		});
	} catch (error) {
		console.error('Error sending accepted friend request notification:', error);
	}
}
