// src/Signup.jsx
import React, { useRef, useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserWithUniqueDisplayName } from './utils/userUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
	const displayNameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();
	const [error, setError] = useState('');
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError('Passwords do not match');
		}
		try {
			setError('');
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				emailRef.current.value,
				passwordRef.current.value
			);

			// Build the user data object.
			const userData = {
				displayName: displayNameRef.current.value,
				email: emailRef.current.value,
				projects: [],
			};
			// Use our helper function to create the user with a unique display name.
			await createUserWithUniqueDisplayName(userCredential.user.uid, userData);
			navigate('/profile');
		} catch (err) {
			console.error(err);
			setError('Failed to create account: ' + err.message);
		}
	}

	return (
		<div className='max-w-md mx-auto p-4'>
			<h2 className='text-2xl font-bold mb-4'>Sign Up</h2>
			{error && <p className='mb-2 text-red-500'>{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Display Name'
					ref={displayNameRef}
					required
					className='border p-2 w-full mb-2'
					minLength='3'
					maxLength='30'
				/>
				<input
					type='email'
					placeholder='Email'
					ref={emailRef}
					required
					className='border p-2 w-full mb-2'
				/>
				<input
					type='password'
					placeholder='Password'
					ref={passwordRef}
					required
					className='border p-2 w-full mb-2'
				/>
				<input
					type='password'
					placeholder='Confirm Password'
					ref={passwordConfirmRef}
					required
					className='border p-2 w-full mb-2'
				/>
				<button
					type='submit'
					className='bg-blue-500 text-white px-4 py-2 rounded w-full'>
					Sign Up
				</button>
			</form>
			<p className='mt-2'>
				Already have an account?{' '}
				<Link
					to='/login'
					className='text-blue-500'>
					Login
				</Link>
			</p>
			<p className='text-gray-400 text-xs'>
				If you don't want to signup, use this demo account to login
			</p>
			<p className='text-gray-400 text-xs'>Email: demo@demo.com</p>
			<p className='text-gray-400 text-xs'>Password: 123123</p>
		</div>
	);
}
