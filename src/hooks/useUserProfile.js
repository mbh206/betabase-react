import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function useUserProfile(uid) {
	const [profile, setProfile] = useState(null);

	useEffect(() => {
		async function fetchProfile() {
			if (uid) {
				try {
					const docRef = doc(db, 'users', uid);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						setProfile(docSnap.data());
					}
				} catch (error) {
					console.error('Error fetching user profile:', error);
				}
			}
		}
		fetchProfile();
	}, [uid]);

	return profile;
}
