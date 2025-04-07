import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { data: session, status } = useSession();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setUserEmail(session.user.email);
    } else {
      setUserEmail("Guest");
    }
  }, [session, status]);

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
        <h1 className="text-lg font-semibold">ChatBot</h1>

      </div>

      {/* ปุ่ม Logout อยู่ทางขวา */}
      <div className="ml-auto flex items-center">
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Logout</Button>
      </DropdownMenuTrigger >
      <DropdownMenuContent className="w-56 bg-neutral-950 border">
        <DropdownMenuLabel className="h-10 px-4 py-4 bg-neutral-950 ">Hi: {userEmail}</DropdownMenuLabel>
        <DropdownMenuItem className="h-10 px-4 py-4 bg-neutral-950  hover:bg-zinc-800" onClick={() => signOut({ callbackUrl: "/" })}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
