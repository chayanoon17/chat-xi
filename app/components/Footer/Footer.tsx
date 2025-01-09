// components/Footer/Footer.tsx
import React from 'react';
import { FaFacebook,  FaInstagram, FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} Chayanoon Aphaowpng software developer.</p>
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://www.facebook.com/ken.sakura.3950?locale=th_TH" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaFacebook size={20} />
          </a>
         
          <a href="https://www.instagram.com/ken.chayanoon/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaInstagram size={20} />
          </a>
          <a href="https://github.com/chayanoon17" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
