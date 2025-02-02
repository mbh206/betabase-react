import React, { useRef, useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

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
			// Save extra profile info in Firestore
			await setDoc(doc(db, 'users', userCredential.user.uid), {
				displayName: displayNameRef.current.value,
				email: emailRef.current.value,
				projects: [], // This array can be updated later with project IDs
			});
			navigate('/profile');
		} catch (err) {
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
		</div>
	);
}
