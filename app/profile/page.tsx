// pages/profile.tsx
'use client';

import { useSession,  } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import HeroBubbles from '../components/UI/HeroBubbles';
import Navbar from '../components/UI/Navbar';
import Footer from '../components/Footer/Footer';



const Profile: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  return (
    <div className="relative h-screen w-full">
      <Navbar/>
      {status === 'authenticated' && session?.user ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative z-10 bg-black">
      <HeroBubbles/>

          {/* <div className="p-8 rounded-lg shadow-lg w-full max-w-xl bg-opacity-80">
            <h1 className="text-3xl font-semibold text-white text-center mb-4">Next Js Typescript Prsima MongoDB</h1>
            <p className="text-white text-lg font-medium mb-2">Welcome, {session.user.name}!</p>
            <p className="text-white text-base mb-4">Email: {session.user.email}</p>

          </div> */}
        </div>
        
      ) : (
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <p className="text-xl text-gray-600">You need to be logged in to view this page.</p>
        </div>
      )}
          <Footer/>

    </div>
  );
};

export default Profile;
