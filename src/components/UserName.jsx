import React from 'react';
import useUserProfile from '../hooks/useUserProfile';

export function UserName({ uid }) {
	const profile = useUserProfile(uid);
	return (
		<span>{profile ? profile.displayName || profile.email : 'Loading...'}</span>
	);
}
