// components/ContactUs.tsx
"use client"
import React from 'react';
import { AnimatedPinDemo } from '../components/UI/AnimatedPinDemo';
import Navbar from '../components/UI/Navbar';
import { TextGenerateEffectDemo } from '../components/UI/TextGenerateEffectDemo';
import Footer from '../components/Footer/Footer';



const ContactUs: React.FC = () => {


  return (
    <>
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
      <Navbar/>
      <div className=''></div>
      <TextGenerateEffectDemo/>
      <AnimatedPinDemo/>
    </div>
    <Footer/>
    </>
    
  );
};

export default ContactUs;
