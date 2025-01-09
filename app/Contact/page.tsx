// components/ContactUs.tsx

import React from 'react';
import { FaGithub, FaFacebook, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const ContactUs: React.FC = () => {


  return (
    
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
       
      {/* Header Section */}
      <div className="text-center mt-16 mb-12">
        <div className="text-xl md:text-3xl font-bold px-8 py-4 rounded-full inline-block shadow-md">
          Contact Developer.
        </div>
      </div>
      <div className="">
  <Link href="/profile">
  <button className="glow-on-hover" type="button">
          Go back
          </button></Link>
</div>
      {/* Card Section */}
      <div className="flex flex-col items-center  p-6 rounded-lg shadow-lg mb-12 w-full max-w-3xl text-center">
      <Image
    src="/images/profile.png" // รูปภาพต้องอยู่ในโฟลเดอร์ public/images/
    alt="Profile"
    width={128} // ความกว้างในพิกเซล
    height={128} // ความสูงในพิกเซล
    className="rounded-full mb-4"
  />
  <h2 className="text-2xl font-bold mb-2">Ken Chayanoon</h2>
  <p className="text-gray-400 mb-4">Fullstack Developer</p>
  <p className="text-gray-400">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id lorem nec urna ultrices commodo.
  </p>
</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-6">
        {/* GitHub Card */}
        <div className="p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FaGithub size={30} className="text-white mr-4" />
            <h3 className="text-xl font-bold">Join our community.</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Get help from the community. If you&apos;re on a paid plan, submit a
            ticket to our support team.
          </p>
          <div className="flex items-center space-x-4">
          <a href="https://github.com/chayanoon17"><button className="glow-on-hover" type="button">
          Visit Github
          </button></a>
          
          </div>
        </div>

        {/* Facebook Card */}
        <div className="p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FaFacebook size={30} className="text-blue-600 mr-4" />
            <h3 className="text-xl font-bold">Connect with us on Facebook.</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Stay updated with our latest news and updates on our official Facebook page.
          </p>
          <a href="https://www.facebook.com/ken.sakura.3950?locale=th_TH"><button className="glow-on-hover" type="button">
          Visit Facebook
    </button></a>
          
        </div>

        {/* Instagram Card */}
        <div className="p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ">
          <div className="flex items-center mb-4 ">
            <FaInstagram size={30} className="text-pink-500 mr-4" />
            <h3 className="text-xl font-bold ">Follow us on Instagram.</h3>
          </div>
          <p className="text-gray-400 mb-6">
          Stay updated with our latest news and updates on our official Instagram.
          </p>
          <a href="https://www.instagram.com/ken.chayanoon/"><button className="glow-on-hover" type="button">
          Visit Instagram
    </button></a>
          
        </div>
      </div>
      
    </div>
  );
};

export default ContactUs;
