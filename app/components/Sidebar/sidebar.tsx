"use client";
import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatGroup from "../ChatGroup/ChatGroup";

interface SidebarProps {
  onSelectChatRoom: (roomId: string) => void;
  selectedRoomId: string | null;
  setSelectedRoomId: (roomId: string) => void;
  chatRooms: { id: string; title: string; createdAt: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedRoomId,
  setSelectedRoomId,
  chatRooms,
}) => {
  const { data: session, status } = useSession();
  const [userEmail, setUserEmail] = useState<string>("");

  // ใช้ useEffect เพื่อป้องกันการแสดงค่าซ้ำซ้อน
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setUserEmail(session.user.email);
    } else {
      setUserEmail("Guest");
    }
  }, [session, status]);

  const handleResetChat = () => {
    setSelectedRoomId(""); 
  };

  

  return (
    <div className="w-full p-2 text-white flex flex-col space-y-4 h-screen font-light">
  {/* Header */}
  <div className="flex justify-between items-center">
    <p className="text-lg p-2">Chatbot</p>
    <button
      className="rounded-lg bg-zinc-800 p-2"
      onClick={handleResetChat}
    >
      <IoMdAdd size={20} />
    </button>
  </div>

  {/* Chat List */}
  <ScrollArea>
    <nav className="flex flex-col w-full overflow-y-auto">
      {chatRooms.length === 0 ? (
        <p className="text-zinc-500 text-center">No chat rooms available</p>
      ) : (
        chatRooms.map((room) => (
          <ChatGroup
            key={room.id}
            title={room.title}
            rooms={[room]}
            onSelectChatRoom={setSelectedRoomId}
            selectedRoomId={selectedRoomId}
            onDeleteRoom={() => console.log("Delete Room", room.id)}
          />
        ))
      )}
    </nav>
  </ScrollArea>

  {/* User Info */}
  <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center space-x-2 max-w-auto p-3 rounded-lg bg-neutral-950">
    <Avatar className="h-8 w-8">
      <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <span className="text-sm">{session?.user.email}</span>
  </div>
</div>

  );
};

export default Sidebar;
