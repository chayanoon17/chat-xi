// components/Navbar.tsx
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
interface NavbarProps {
  onToggleSidebar: () => void; // เพิ่ม Prop สำหรับสั่งเปิด-ปิด Sidebar
  isSidebarOpen: boolean; // รับสถานะของ Sidebar
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <div className="text-white bg-neutral-950 flex w-full items-center p-2">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-zinc-700 rounded-md"
        >
          {isSidebarOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>

        
      </div>

      {/* ใช้ ml-auto เพื่อผลักปุ่ม Logout ไปทางขวา */}
      <div className="ml-auto flex items-center px-4">
        <Button onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>
      </div>
    </div>
  );
};

export default Navbar;
