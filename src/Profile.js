import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from './firebase';
import {
	doc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function Profile() {
	const { currentUser } = useAuth();
	const [profileData, setProfileData] = useState(null);
	const [userProjects, setUserProjects] = useState([]);

	useEffect(() => {
		if (currentUser) {
			async function fetchProfile() {
				const docRef = doc(db, 'users', currentUser.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					setProfileData(docSnap.data());
				}
			}
			fetchProfile();

			// Option 1: If you store associated project IDs in the user's profile:
			// async function fetchUserProjects() {
			//   if (profileData && profileData.projects) {
			//     const projectsData = [];
			//     for (let projectId of profileData.projects) {
			//       const projectDoc = await getDoc(doc(db, "projects", projectId));
			//       if (projectDoc.exists()) {
			//         projectsData.push({ id: projectDoc.id, ...projectDoc.data() });
			//       }
			//     }
			//     setUserProjects(projectsData);
			//   }
			// }
			// fetchUserProjects();

			// Option 2: Alternatively, if you tag projects with an owner uid, you can query them:
			async function fetchUserProjects() {
				const q = query(
					collection(db, 'projects'),
					where('owner', '==', currentUser.uid)
				);
				const querySnapshot = await getDocs(q);
				const projectsArr = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setUserProjects(projectsArr);
			}
			fetchUserProjects();
		}
	}, [currentUser]);

	return (
		<div className='max-w-2xl mx-auto p-4'>
			<h2 className='text-2xl font-bold mb-4'>Your Profile</h2>
			{profileData ? (
				<>
					<p>
						<strong>Name:</strong> {profileData.displayName}
					</p>
					<p>
						<strong>Email:</strong> {profileData.email}
					</p>
					<h3 className='mt-4 text-xl font-semibold'>Your Projects</h3>
					{userProjects.length > 0 ? (
						<ul>
							{userProjects.map((proj) => (
								<li
									key={proj.id}
									className='border p-2 my-1 rounded'>
									<Link to={`/project/${proj.id}`}>{proj.name}</Link>
								</li>
							))}
						</ul>
					) : (
						<p>You have no projects yet.</p>
					)}
				</>
			) : (
				<p>Loading profile...</p>
			)}
		</div>
	);
}
