import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import {
	doc,
	getDoc,
	updateDoc,
	collection,
	query,
	where,
	getDocs,
	Timestamp,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function Profile() {
	const { currentUser } = useAuth();
	const [profileData, setProfileData] = useState(null);
	const [userProjects, setUserProjects] = useState([]);
	const sortedProjects = [...userProjects].sort(
		(a, b) => b.updatedAt - a.updatedAt
	);
	const recentProjects = sortedProjects.slice(0, 5);
	const [isEditing, setIsEditing] = useState(false);
	const [bioInput, setBioInput] = useState(profileData?.bio || '');
	const [githubInput, setGithubInput] = useState(profileData?.github || '');

	function handleProfileSave() {
		// Write updates to Firestore:
		updateDoc(doc(db, 'users', currentUser.uid), {
			bio: bioInput,
			github: githubInput,
		});
		setIsEditing(false);
	}

	useEffect(() => {
		console.log('Profile useEffect firing...');
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
					where('allowedUsers', 'array-contains', currentUser.uid)
				);
				const querySnapshot = await getDocs(q);
				const projectsArr = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log('userProjects from Profile: ', projectsArr);
				setUserProjects(projectsArr);
			}

			fetchUserProjects();
		}
	}, [currentUser]);

	return (
		<>
			<div className='p-4 bg-gray-100'>
				{profileData ? (
					<>
						<div>
							<h2 className='text-xl font-bold mb-2'>Your Profile</h2>
							<p>
								<strong>Name:</strong> {profileData.displayName}
							</p>
							<p>
								<strong>Email:</strong> {profileData.email}
							</p>
							<p>
								<strong>Bio:</strong> {profileData.bio}
							</p>
							<p>
								<a
									href={profileData.github}
									target='_blank'>
									<strong>GitHub:</strong>{' '}
									<span className='underline'>{profileData.github}</span>
								</a>
							</p>
							{isEditing ? (
								<div>
									<label>Bio</label>
									<textarea
										value={bioInput}
										onChange={(e) => setBioInput(e.target.value)}
									/>
									<label>GitHub</label>
									<input
										type='text'
										value={githubInput}
										onChange={(e) => setGithubInput(e.target.value)}
									/>
									<button onClick={handleProfileSave}>Save</button>
								</div>
							) : (
								<button
									className='bg-orange-500 text-white text-xl  mt-2 px-2 py-1 rounded shadow hover:shadow-lg'
									onClick={() => setIsEditing(true)}>
									Edit Profile
								</button>
							)}
						</div>
						<div>
							<h2 className='text-xl font-bold my-2'>Recent Activity</h2>
							{recentProjects.map((project) => (
								<div key={project.id}>
									<Link to={`/dashboard/${project.id}`}>
										<strong>{project.name}</strong> |{' '}
										<span className='text-sm text-gray-500'>
											Last updated:{' '}
											{project.updatedAt?.toDate().toLocaleString()}
										</span>
									</Link>
								</div>
							))}
						</div>
						<div className='mt-4'>
							<Link to='/dashboard/'>
								<h2 className='w-48 bg-blue-500 text-white text-center rounded py-2 text-xl font-bold my-2 hover:shadow-lg shadow'>
									See All Projects
								</h2>
							</Link>
						</div>
						<div className='mt-4'>
							<h2 className='text-xl font-bold my-2'>
								Collaborators in Your Projects
							</h2>
							{userProjects.map((project) => (
								<div key={project.id}>
									<strong>{project.name}</strong> |{' '}
									<span className='text-sm text-gray-500'>
										Collaborators:{' '}
										{project.collaborators
											? project.collaborators.join(', ')
											: 'None'}
									</span>
								</div>
							))}
						</div>
					</>
				) : (
					<p>Loading profile...</p>
				)}
			</div>
		</>
	);
}
