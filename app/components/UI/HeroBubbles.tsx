// components/HeroBubbles.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';


const HeroBubbles: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center space-y-8 p-4">

      {/* บับเบิ้ลสีขาวแบบมีหัวกลมทางซ้ายและหางทางขวา */}
      <div className="relative inline-block">
        {/* บับเบิ้ลข้อความ */}
        <div className="relative inline-block bg-gray-200 text-black text-xl font-medium px-6 py-3 rounded-full">
        Start a conversation..
        </div>

        {/* วงกลมทางซ้าย */}
        

        {/* หางบับเบิ้ลทางขวา */}
        <div
          className="absolute bg-gray-200"
          style={{
            width: '10px',      
            height: '10px',
            right: '0',
            bottom: '50%',
            transform: 'translate(50%, 50%)',
            clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)'
          }}
        ></div>
      </div>
      

      {/* บับเบิ้ลสีดำ */}
      <div className="relative max-w-md bg-neutral-900 text-white p-6 rounded-3xl flex flex-col space-y-4">
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">From the creators of Next.js.</span> Where pioneering AI solutions meets superior web performance.
        </p>
        
        <div className="flex space-x-4">
          <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition">
            Try V0.dev
          </button>
          <button 
            className="bg-black text-white border border-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition"
            onClick={() => router.push('/Chat')}
          >
            Get a Chatbot
          </button>
        </div>

        {/* หางบับเบิ้ลที่ด้านซ้ายล่าง */}
        <div
          className="absolute bg-neutral-900"
          style={{
            width: '20px',
            height: '20px',
            left: '-10px',   // ทำให้ยื่นออกมาทางซ้าย
            bottom: '20px',  // ปรับความสูงให้เหมาะกับตำแหน่งที่ต้องการ
            clipPath: 'polygon(0% 100%, 100% 50%, 100% 100%)'
          }}
        ></div>
      </div>


    </div>
  );
}

export default HeroBubbles;
