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
    <div className="text-white bg-neutral-950 flex w-full items-center p-2">
    <div className="flex items-center">
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-zinc-700 rounded-md"
      >
        {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>
    </div>

    {/* ใช้ ml-auto เพื่อผลักปุ่ม Logout ไปทางขวา */}
    <div className="ml-auto flex items-center">
      <button
        onClick={toggleDropdown}
        className="w-24  text-white hover:text-white border border-zinc-600 hover:bg-zinc-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Logout
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="bg-black text-white rounded-lg shadow-lg mt-2">
          <ul className="py-2">
            <li>
              <a
                href="#"
                className="px-4 py-2 text-sm hover:bg-zinc-800 rounded-lg"
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
