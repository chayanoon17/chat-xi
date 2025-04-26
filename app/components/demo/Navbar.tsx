import React from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { signOut,  } from "next-auth/react";
import { Button } from "@/components/ui/button";
interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {

  return (
    <nav className="text-white bg-neutral-950 flex items-center justify-between px-4 py-3 shadow-md w-full">
      {/* ปุ่ม Sidebar */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className={`p-2 hover:bg-zinc-700 rounded-md transition ${
            isSidebarOpen ? "hidden sm:block" : "block"
          }`}
        >
          {isSidebarOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
        <h1 className="text-lg font-semibold">ChatBotXI</h1>

      </div>

      {/* ปุ่ม Logout อยู่ทางขวา */}
      <div className="ml-auto flex items-center">
      <Button 
        onClick={() => signOut({ callbackUrl: "/" })}
        >Login</Button>
      </div>
    </nav>
  );
};

export default Navbar;
