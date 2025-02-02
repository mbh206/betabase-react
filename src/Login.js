import React, { useRef, useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const [error, setError] = useState('');
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setError('');
			await signInWithEmailAndPassword(
				auth,
				emailRef.current.value,
				passwordRef.current.value
			);
			navigate('/profile');
		} catch (err) {
			setError('Failed to sign in: ' + err.message);
		}
	}

	return (
		<div className='max-w-md mx-auto p-4'>
			<h2 className='text-2xl font-bold mb-4'>Login</h2>
			{error && <p className='mb-2 text-red-500'>{error}</p>}
			<form onSubmit={handleSubmit}>
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
				<button
					type='submit'
					className='bg-blue-500 text-white px-4 py-2 rounded w-full'>
					Login
				</button>
			</form>
			<p className='mt-2'>
				Don't have an account?{' '}
				<Link
					to='/signup'
					className='text-blue-500'>
					Sign Up
				</Link>
			</p>
		</div>
	);
}
