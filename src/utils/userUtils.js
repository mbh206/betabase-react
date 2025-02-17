import { runTransaction, doc } from 'firebase/firestore';
import { db } from '../firebase';

export async function createUserWithUniqueDisplayName(userId, userData) {
	const normalizedDisplayName = userData.displayName.toLowerCase();

	const userDocRef = doc(db, 'users', userId);
	const displayNameDocRef = doc(db, 'displayNames', normalizedDisplayName);

	try {
		await runTransaction(db, async (transaction) => {
			const displayNameDoc = await transaction.get(displayNameDocRef);
			if (displayNameDoc.exists()) {
				throw new Error('Display name is already taken.');
			}
			transaction.set(displayNameDocRef, { uid: userId });
			transaction.set(userDocRef, {
				...userData,
				displayName: normalizedDisplayName,
				createdAt: new Date(),
			});
		});
		console.log('User created successfully with a unique display name.');
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	}
}
