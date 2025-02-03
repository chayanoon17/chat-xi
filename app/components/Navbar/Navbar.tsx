// components/Navbar.tsx
import React, { useState } from 'react';
import { FiMenu, FiX } from "react-icons/fi";
import { signOut } from "next-auth/react";

interface NavbarProps {
  onToggleSidebar: () => void; // เพิ่ม Prop สำหรับสั่งเปิด-ปิด Sidebar
  isSidebarOpen: boolean; // รับสถานะของ Sidebar

}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  
  return (
    <div className="flex text-white p-1 shadow-md items-center justify-starts ">
     <button onClick={onToggleSidebar} className="p-2 hover:bg-zinc-700 rounded-md">
        {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>
      
      <div className="relative ml-2">
        <button
          onClick={toggleDropdown}
          className="text-white hover:text-white text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
        >
          :::

        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 z-10 bg-black text-white rounded-lg shadow-lg mt-2 w-48">
            <ul className="py-2">
             
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm hover:bg-gray-200"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </a>
              </li>
              
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
