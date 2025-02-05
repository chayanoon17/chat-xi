'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Label } from "../components/UI/label";
import { Input } from "../components/UI/input";
import { cn } from "@/utils";

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
    <>
    <div className="flex h-dvh w-full items-start pt-12 md:pt-0 md:items-center justify-center">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold text-zinc-50">Sign Up
          </h3>
          <p className="text-sm text-zinc-400">
          Create an account with your email and password
          </p>
          <form onSubmit={handleSubmit} className="my-8 text-white">

          <LabelInputContainer>
            <Label htmlFor="firstname">Fill name</Label>
            <Input id="name" placeholder="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}/>
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Email</Label>
            <Input id="email" placeholder="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
          </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </LabelInputContainer>
        <button
          className="bg-white w-full py-2 rounded-md text-black font-semibold hover:bg-zinc-100 hover:text-white"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')} // Redirect to the Sign In page when clicked
            className="text-zinc-50 font-semibold hover:underline"
          >
            Already have an account? Sign In
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mt-4">
            Account created successfully! Redirecting to Sign In...
          </p>
        )}
        </div>
        </form>
        
          </div>
          </div>
          </div>
 

    </>
  );
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