// components/ContactUs.tsx
"use client"
import React from 'react';
import { AnimatedPinDemo } from '../components/UI/AnimatedPinDemo';
import Navbar from '../components/UI/Navbar';

const ContactUs: React.FC = () => {

  return (
    <div className="bg-neutral-950 min-h-screen text-white flex flex-col items-center">
      <Navbar/>
      <AnimatedPinDemo/>
    </div>
  );
};

export default ContactUs;
