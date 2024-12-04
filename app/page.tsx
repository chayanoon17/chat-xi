'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        console.error(result.error)
        alert('Login failed: ' + result.error)
      } else {
        router.push('/profile')
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-neutral-950 text-white">
      <div className="w-full max-w-md  border-gray-200 rounded-lg p-8 ">
        <h1 className="text-3xl font-bold mb-8 text-center ">
          Welcome Back!
        </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold p-2 ">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="bg-zinc-900 w-full border-2 border-gray-300 px-3 py-2 rounded hover:border-black focus:border-black focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold p-2">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your Password"
                className="bg-zinc-900 w-full border-2 border-gray-300 px-3 py-2 rounded hover:border-black focus:border-black focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded mb-4 border-2 border-black"
            >
              Sign In
            </button>
          </form>
        <div className="text-center mt-4">
          <span className="text-sm">Don&#39;t have an account?</span> {/* Escape the single quote */}
          <button
            onClick={() => router.push('/signup')} // นำทางไปยังหน้า SignUp เมื่อคลิก
            className="ml-2 text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
