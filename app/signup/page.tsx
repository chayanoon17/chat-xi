'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError(null);
        setTimeout(() => router.push('/'), 2000); // Redirect to the home page after a short delay
      } else {
        setError(data.error || 'Sign up failed');
      }
    } catch  {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-neutral-950 text-white">
      <div className="w-full max-w-md border-gray-200 rounded-lg p-8 ">
        <h1 className="text-3xl font-bold mb-8 text-center">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              className="w-full bg-zinc-900 border-2 border-gray-300 px-3 py-2 rounded hover:border-black focus:border-black focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="w-full bg-zinc-900 border-2 border-gray-300 px-3 py-2 rounded hover:border-black focus:border-black focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full bg-zinc-900 border-2 border-gray-300 px-3 py-2 rounded hover:border-black focus:border-black focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded border-2 border-black hover:bg-gray-800"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')} // Redirect to the Sign In page when clicked
            className="text-blue-600 font-semibold hover:underline"
          >
            Already have an account? Sign In
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mt-4">
            Account created successfully! Redirecting to Sign In...
          </p>
        )}
      </div>
    </div>
  );
}
