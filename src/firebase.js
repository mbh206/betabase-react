import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyDArfBB6T7BPmakhW3-6ZvE_lo7PzSgJ2A',
	authDomain: 'betabase-77ad9.firebaseapp.com',
	projectId: 'betabase-77ad9',
	storageBucket: 'betabase-77ad9.firebasestorage.app',
	messagingSenderId: '931264582349',
	appId: '1:931264582349:web:29928175f9169b6a144f84',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
