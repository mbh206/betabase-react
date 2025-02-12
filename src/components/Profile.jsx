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
import FriendRequestForm from './FriendRequestForm';
import IncomingFriendRequests from './IncomingFriendRequests';
import ConnectionsList from './ConnectionsList';
import { UserName } from './UserName';

export default function Profile() {
	const { currentUser } = useAuth();
	const [profileData, setProfileData] = useState(null);
	const [userProjects, setUserProjects] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const sortedProjects = [...userProjects].sort(
		(a, b) => b.updatedAt - a.updatedAt
	);
	const recentProjects = sortedProjects.slice(0, 5);
	const [isEditing, setIsEditing] = useState(false);
	const [bioInput, setBioInput] = useState(profileData?.bio || '');
	const [githubInput, setGithubInput] = useState(profileData?.github || '');
	const [displayNameInput, setDisplayNameInput] = useState(
		profileData?.displayname || ''
	);

	const projectsNotOwned = userProjects.filter(
		(project) => project.owner !== currentUser.uid
	);

	async function fetchProfile() {
		if (currentUser) {
			try {
				const docRef = doc(db, 'users', currentUser.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data();
					setProfileData(data);
					console.log(data);
					setDisplayNameInput(data.displayName || '');
					setBioInput(data.bio || '');
					setGithubInput(data.github || '');
				}
			} catch (error) {
				console.error('Error fetching profile:', error);
			}
		}
	}

	function handleProfileSave() {
		updateDoc(doc(db, 'users', currentUser.uid), {
			displayName: displayNameInput,
			bio: bioInput,
			github: githubInput,
		})
			.then(() => {
				fetchProfile();
				setIsEditing(false);
			})
			.catch((error) => {
				console.error('Error updating profile:', error);
			});
	}

	useEffect(() => {
		async function fetchAllUsers() {
			try {
				const usersSnapshot = await getDocs(collection(db, 'users'));
				const usersData = usersSnapshot.docs.map((doc) => ({
					uid: doc.id,
					...doc.data(),
				}));
				setAllUsers(usersData);
			} catch (error) {
				console.error('Error fetching all users:', error);
			}
		}
		fetchAllUsers();
	}, []);

	useEffect(() => {
		if (currentUser) {
			fetchProfile();

			async function fetchUserProjects() {
				const ownerQuery = query(
					collection(db, 'projects'),
					where('owner', '==', currentUser.uid)
				);
				const ownerSnapshot = await getDocs(ownerQuery);
				const ownerProjects = ownerSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				const collabQuery = query(
					collection(db, 'projects'),
					where('collaborators', 'array-contains', currentUser.uid)
				);
				const collabSnapshot = await getDocs(collabQuery);
				const collabProjects = collabSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				const mergedProjects = [
					...ownerProjects,
					...collabProjects.filter(
						(proj) => !ownerProjects.find((p) => p.id === proj.id)
					),
				];
				setUserProjects(mergedProjects);
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
							<div className='flex flex-col gap-2 p-4 border rounded mb-4'>
								<h2 className='text-xl font-bold mb-2'>Your Profile</h2>
								<p>
									<strong>Email:</strong> {profileData.email}
								</p>
								{!isEditing ? (
									<>
										<p>
											<strong>Username:</strong> {profileData.displayName}
										</p>
										<p>
											<a
												href={profileData.github}
												target='_blank'>
												<strong>GitHub:</strong>{' '}
												<span className='underline'>{profileData.github}</span>
											</a>
										</p>
										<p>
											<strong>Bio:</strong> {profileData.bio}
										</p>
									</>
								) : (
									''
								)}
								{isEditing ? (
									<div className='flex flex-col gap-2 rounded mb-4'>
										<div className='flex flex-col'>
											<label className='text-sm text-gray-500'>Username</label>
											<input
												className='p-1 rounded-lg'
												type='text'
												value={displayNameInput}
												onChange={(e) => setDisplayNameInput(e.target.value)}
											/>
										</div>
										<div className='flex flex-col'>
											<label className='text-sm text-gray-500'>GitHub</label>
											<input
												className='p-1 rounded-lg'
												type='text'
												value={githubInput}
												onChange={(e) => setGithubInput(e.target.value)}
											/>
										</div>
										<div className='flex flex-col'>
											<label className='text-sm text-gray-500'>Bio</label>
											<textarea
												className='px-2 py-1 rounded-lg'
												value={bioInput}
												onChange={(e) => setBioInput(e.target.value)}
											/>
										</div>
										<div className='flex gap-2'>
											<button
												className='w-32 bg-orange-500 text-white text-lg  mt-2 px-2 py-1 rounded shadow hover:shadow-lg'
												onClick={handleProfileSave}>
												Save
											</button>
											<button
												onClick={() => {
													// Reset inputs to the current profile values and cancel editing.
													setBioInput(profileData.bio || '');
													setGithubInput(profileData.github || '');
													setIsEditing(false);
												}}
												className='w-32 bg-gray-400 text-white text-lg  mt-2 px-2 py-1 rounded shadow hover:shadow-lg'>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<button
										className='w-32 bg-orange-500 text-white text-xl  mt-2 px-2 py-1 rounded shadow hover:shadow-lg'
										onClick={() => setIsEditing(true)}>
										Edit Profile
									</button>
								)}
							</div>
						</div>
						<FriendRequestForm />
						<IncomingFriendRequests />
						<ConnectionsList />
						<div className='flex flex-col gap-2 p-4 border rounded my-4'>
							<h2 className='text-xl font-bold my-2'>Recent Activity</h2>
							{recentProjects.map((project) => (
								<div key={project.id}>
									<Link to={`/dashboard/${project.id}`}>
										<strong>{project.name}</strong> |{' '}
										<span className='text-sm text-gray-500'>
											Last updated:{' '}
											{project.updatedAt
												? project.updatedAt.toDate().toLocaleString()
												: 'Unknown'}
										</span>
									</Link>
								</div>
							))}
						</div>
						<div className='flex flex-col gap-2 p-4 border rounded mb-4'>
							<div className='mt-2'>
								<Link to='/dashboard/'>
									<h2 className='w-32 bg-teal-500 text-white text-center rounded py-2 text-lg hover:shadow-lg shadow'>
										See Projects
									</h2>
								</Link>
							</div>
							<div>
								<h2 className='text-xl font-bold my-2'>
									Projects You're a Collaborator On
								</h2>
								{projectsNotOwned.length === 0 ? (
									<p>No projects with collaborator.</p>
								) : (
									projectsNotOwned.map((project) => (
										<div key={project.id}>
											<Link to={`/dashboard/${project.id}`}>
												<strong>{project.name}</strong>
											</Link>{' '}
											|{' '}
											<span className='text-sm text-gray-500'>
												Collaborators:{' '}
												{project.collaborators &&
												project.collaborators.length > 0
													? project.collaborators.map((uid, index) => (
															<React.Fragment key={uid}>
																<UserName uid={uid} />
																{index < project.collaborators.length - 1 &&
																	', '}
															</React.Fragment>
													  ))
													: 'None'}
											</span>
										</div>
									))
								)}
							</div>
							<div className='mt-4'>
								<h2 className='text-xl font-bold my-2'>Your Projects</h2>
								{userProjects
									.filter((project) => project.owner === currentUser.uid)
									.map((project) => (
										<div key={project.id}>
											<Link to={`/dashboard/${project.id}`}>
												<strong>{project.name}</strong>
											</Link>{' '}
											|{' '}
											<span className='text-sm text-gray-500'>
												Owner: <UserName uid={project.owner} />
											</span>
										</div>
									))}
							</div>
						</div>
					</>
				) : (
					<p>Loading profile...</p>
				)}
			</div>
		</>
	);
}
