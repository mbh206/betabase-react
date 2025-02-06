import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import {
	doc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Profile({ selectedProject, handleSelectProject }) {
	const { currentUser } = useAuth();
	const [profileData, setProfileData] = useState(null);
	const [userProjects, setUserProjects] = useState([]);

	const navigate = useNavigate();

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

	const handleProjectClick = (proj) => {
		handleSelectProject(proj);
		navigate('/');
	};

	return (
		<>
			<div className='max-w-2xl mx-auto p-4 bg-gray-100'>
				<h2 className='text-2xl font-bold mb-4'>Your Profile</h2>
				{profileData ? (
					<>
						<p>
							<strong>Name:</strong> {profileData.displayName}
						</p>
						<p>
							<strong>Email:</strong> {profileData.email}
						</p>
						{/* <h3 className='mt-4 text-xl font-semibold'>Your Projects</h3>
						{userProjects.length > 0 ? (
							<ul>
								{userProjects.map((proj) => (
									<li
										key={proj.id}
										className={`cursor-pointer m-1 p-2 rounded ${
											selectedProject?.id === proj.id
												? 'bg-gray-600'
												: 'hover:bg-gray-700'
										}`}
										onClick={() => handleProjectClick(proj)}>
										{proj.name}
									</li>
								))}
							</ul>
						) : (
							<p>You have no projects yet.</p>
						)} */}
					</>
				) : (
					<p>Loading profile...</p>
				)}
			</div>
		</>
	);
}
