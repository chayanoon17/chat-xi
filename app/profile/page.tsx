// pages/profile.tsx
'use client';

import { useSession,  } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../components/UI/Navbar';
import Footer from '../components/Footer/Footer';
import { BackgroundBeamsDemo } from '../components/UI/BackgroundBeamsDemo';


const Profile: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  return (
    <>
      {status === 'authenticated' && session?.user ? (
        <div className="relative h-screen w-full bg-neutral-950">
          <Navbar/>
          <BackgroundBeamsDemo/>
        </div>
        
      ) : (
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <p className="text-xl text-gray-600">You need to be logged in to view this page.</p>
        </div>
      )}
          <Footer/>
    </>
  );
};

export default Profile;
