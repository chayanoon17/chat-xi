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
  setChatRooms: React.Dispatch<React.SetStateAction<{ id: string; title: string; createdAt: string }[]>>; 
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedRoomId,
  setSelectedRoomId,
  chatRooms,
}) => {
  const { data: session, status } = useSession();
  const [userEmail, setUserEmail] = useState<string>("");

  // ดึง selectedRoomId จาก localStorage เมื่อโหลดหน้า
  useEffect(() => {
    const savedRoomId = localStorage.getItem("selectedRoomId");
    if (savedRoomId) {
      setSelectedRoomId(savedRoomId);
    }
  }, []);

  // ใช้ useEffect เพื่อป้องกันการแสดงค่าซ้ำซ้อน
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setUserEmail(session.user.email);
    } else {
      setUserEmail("Guest");
    }
  }, [session, status]);

  const handleResetChat = () => {
    setSelectedRoomId(""); // รีเซ็ทห้องที่เลือก
    localStorage.removeItem("selectedRoomId"); // ลบห้องที่เลือกจาก localStorage
  };

  const handleSelectChatRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    localStorage.setItem("selectedRoomId", roomId); // เก็บห้องที่เลือกลงใน localStorage
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      const res = await fetch('/api/auth/chatrooms', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });

      if (res.ok) {
        setSelectedRoomId(''); // รีเซ็ทห้องที่เลือก
        localStorage.removeItem("selectedRoomId"); // ลบห้องที่เลือกจาก localStorage
      } else {
        console.error('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
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
                onSelectChatRoom={handleSelectChatRoom} // เปลี่ยนเป็น handleSelectChatRoom
                selectedRoomId={selectedRoomId}
                onDeleteRoom={handleDeleteRoom} // ใช้ฟังก์ชันที่เราเพิ่มเข้ามา
              />
            ))
          )}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center space-x-2 p-3 rounded-lg ">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-sm">{userEmail}</span>
      </div>
    </div>
  );
};

export default Sidebar;
