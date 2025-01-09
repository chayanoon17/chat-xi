'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const HeroBubbles: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative w-[90%] h-screen bg-black flex flex-col items-center justify-center space-y-12 p-4 border-dashed border border-zinc-800 ">
      
      {/* Header Section */}
      <div className="text-center text-white mb-12">
        <h1 className="text-6xl font-bold mb-4">Welcome to AI Chatbot by Ken.</h1>
        <p className="text-2xl text-gray-400 ">
          Experience seamless interaction with my custom-built Chatbot powered by cutting-edge AI technology. 
        </p>
      </div>
      

      {/* บับเบิ้ลสีขาวแบบมีหัวกลมทางซ้ายและหางทางขวา */}
      <div className="w-full px-96 space-y-12 ">
      <div className="relative flex justify-end items-center w-full ">
        <div className="relative inline-block bg-gray-200 text-black text-2xl font-medium px-8 py-4 rounded-full">
          Start a conversation.....
        </div>
        <div
          className="absolute bg-gray-200"
          style={{
            width: '12px',
            height: '12px',
            right: '0',
            bottom: '50%',
            transform: 'translate(50%, 50%)',
            clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
          }}
        ></div>
      </div>

      <div className="relative flex justify-end items-center w-full ">
        <div className="relative inline-block bg-gray-200 text-black text-2xl font-medium px-8 py-4 rounded-full">
          Hello AI
        </div>
        <div
          className="absolute bg-gray-200"
          style={{
            width: '12px',
            height: '12px',
            right: '0',
            bottom: '50%',
            transform: 'translate(50%, 50%)',
            clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
          }}
        ></div>
      </div>

      {/* บับเบิ้ลสีดำ */}
      <div className="relative flex justify-start items-center w-full px-8">
        <div className="relative max-w-2xl bg-neutral-900 text-white p-8 rounded-3xl flex flex-col space-y-4">
          <p className="text-lg leading-relaxed">
            <span className="font-semibold">
              Hello! How can I assist you today?
            </span>
          </p>
          <div
            className="absolute bg-neutral-900"
            style={{
              width: '24px',
              height: '24px',
              left: '-12px',
              bottom: '24px',
              clipPath: 'polygon(0% 100%, 100% 50%, 100% 100%)',
            }}
          ></div>
        </div>
      </div>
      </div>

      <div className="relative max-w-2xl text-white p-8 rounded-3xl flex flex-col space-y-4">
        <div className="flex space-x-6">
          <button
            className="bg-white text-black border border-white px-6 py-3 rounded-full text-lg font-medium hover:bg-white hover:text-black transition"
            onClick={() => router.push('/Chat')}
          >
            Go To Chatbot
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBubbles;
