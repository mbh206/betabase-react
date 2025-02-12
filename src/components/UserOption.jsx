import React from 'react';
import useUserProfile from '../hooks/useUserProfile';

export default function UserOption({ uid }) {
	const profile = useUserProfile(uid);
	return (
		<option value={uid}>
			{profile ? profile.displayName || profile.username || profile.email : uid}
		</option>
	);
}
