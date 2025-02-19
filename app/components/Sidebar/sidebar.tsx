// Sidebar.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import ChatGroup from '../ChatGroup/ChatGroup';

interface SidebarProps {
  onSelectChatRoom: (roomId: string) => void;
  selectedRoomId: string | null;
  setSelectedRoomId: (roomId: string) => void;
  chatRooms: { id: string; title: string; createdAt: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectChatRoom,
  selectedRoomId,
  setSelectedRoomId,
  chatRooms,
}) => {
  const [loading] = useState<boolean>(false);
  const { data: session } = useSession();

  // ใช้ useEffect ในการดึงข้อมูล room ที่เลือกจาก localStorage
  useEffect(() => {
    const savedRoomId = localStorage.getItem('selectedRoomId');
    if (savedRoomId) {
      setSelectedRoomId(savedRoomId);
    }
  }, [setSelectedRoomId]);

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
      } else {
        console.error('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const groupRoomsByDate = (rooms: { id: string; title: string; createdAt: string }[]) => {
    const now = new Date();
    const today: any[] = [];
    const yesterday: any[] = [];
    const last7Days: any[] = [];
    const last30Days: any[] = [];
    const older: any[] = [];

    rooms.forEach((room) => {
      const createdDate = new Date(room.createdAt);
      const timeDiff = now.getTime() - createdDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        today.push(room);
      } else if (daysDiff === 1) {
        yesterday.push(room);
      } else if (daysDiff <= 7) {
        last7Days.push(room);
      } else if (daysDiff <= 30) {
        last30Days.push(room);
      } else {
        older.push(room);
      }
    });

    return { today, yesterday, last7Days, last30Days, older };
  };

  const { today, yesterday, last7Days, last30Days, older } = groupRoomsByDate(chatRooms);

  // ฟังก์ชันที่จะถูกเรียกเมื่อเลือกห้องใหม่
  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    localStorage.setItem('selectedRoomId', roomId);  // บันทึกห้องที่เลือกลง localStorage
    onSelectChatRoom(roomId);
  };

  return (
    <div className="w-full p-2 text-white flex flex-col space-y-4 h-screen">
      <div className="flex justify-between">
        <p className="text-lg p-2">Chatbot</p>
        <button
          className=" rounded-lg"
        >
          <IoMdAdd size={20} />
        </button>
      </div>

      <ScrollArea>
        <nav className="flex flex-col w-full overflow-y-auto">
          {loading ? (
            <>
              <Skeleton className="mb-6 h-4 w-[200px] bg-zinc-800" />
              <Skeleton className="mb-6 h-4 w-[180px] bg-zinc-800" />
            </>
          ) : chatRooms.length === 0 ? (
            <p className="text-zinc-500 text-center">No chat rooms available</p>
          ) : (
            <>
              {today.length > 0 && (
                <ChatGroup
                  title="Today"
                  rooms={today}
                  onSelectChatRoom={handleSelectRoom}  // เปลี่ยนให้เรียกใช้ handleSelectRoom
                  selectedRoomId={selectedRoomId}
                  onDeleteRoom={handleDeleteRoom}
                />
              )}
              {yesterday.length > 0 && (
                <ChatGroup
                  title="Yesterday"
                  rooms={yesterday}
                  onSelectChatRoom={handleSelectRoom}  // เปลี่ยนให้เรียกใช้ handleSelectRoom
                  selectedRoomId={selectedRoomId}
                  onDeleteRoom={handleDeleteRoom}
                />
              )}
            </>
          )}
        </nav>
      </ScrollArea>

      <div className="absolute bottom-3 flex justify-between w-60">
        <div className="flex items-center space-x-2 p-3 w-auto rounded-lg">
          <Avatar>
            <AvatarImage src="https://github.com/nextauthjs.png" alt="avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p>{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
