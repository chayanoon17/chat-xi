"use client";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";


interface SidebarProps {
  // Define the props for Sidebar here, or leave empty if no props are needed
}

const Sidebar: React.FC<SidebarProps> = ({
}) => {

  return (

    <div className="w-full p-2 text-white flex flex-col space-y-4 h-screen font-light">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-lg p-2">Chatbot</p>
        
        <button
          className="rounded-lg bg-zinc-800 p-2"

        >
          <IoMdAdd size={20} />
        </button>
      </div>

      {/* Chat List */}
      <ScrollArea>
        <nav className="flex flex-col w-full overflow-y-auto">
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center space-x-2 p-3 rounded-lg ">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-sm">HI</span>
      </div>
    </div>

  );
};

export default Sidebar;
