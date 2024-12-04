'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')  
    }
  }, [status, router])

  return (
    status === 'authenticated' && session?.user ? (
      <div className="flex flex-col items-center justify-center h-screen p-6 bg-neutral-950">
        <div className=" p-8 rounded-lg shadow-lg w-full max-w-xl">
          <h1 className="text-3xl font-semibold text-white text-center text-gray-800 mb-4">Hello</h1>
          <p className="text-white text-lg font-medium text-gray-700 mb-2">Welcome, {session.user.name}!</p>
          <p className="text-white text-base  text-gray-600 mb-4">Email: {session.user.email}</p>
          <button
          className="w-full bg-black text-white py-2 rounded-lg border-2 border-black hover:bg-gray-800 transition duration-300"
          type="button" onClick={() => router.push('/Chat')}>
       Go to Chatbot Nextjsx
    </button>
          <button
            className="w-full bg-black text-white mt-4 py-2 rounded-lg border-2 border-black hover:bg-gray-800 transition duration-300"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Logout
          </button>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">You need to be logged in to view this page.</p>
      </div>
    )
  )
}


