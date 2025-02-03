'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Label } from "./components/UI/label";
import { Input } from "./components/UI/input";
import { cn } from "@/utils";


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
        router.push('/Chat')
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-6 md:p-8 shadow-input bg-black dark:bg-black ">

      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
      Sign in to Chat-XI
      </h2>
      
          <form onSubmit={handleSubmit} className="my-8">
          <LabelInputContainer className="mb-6">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </LabelInputContainer>
        <LabelInputContainer className="mb-6">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          
        </LabelInputContainer>
        
        <button

          type="submit"
        >
          Sign in &rarr;
          <BottomGradient />
        </button>
            
          </form>
        <div className="text-center mt-4">
          <span className="text-sm text-white">Don&#39;t have an account?</span> {/* Escape the single quote */}
          <button
            onClick={() => router.push('/signup')} // นำทางไปยังหน้า SignUp เมื่อคลิก
            className="ml-2 text-blue-600 font-semibold hover:underline"
          >
            Sign Up
            
          </button>
        </div>
        
      </div>

  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
 
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};