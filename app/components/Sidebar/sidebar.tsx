import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { FiTrash2 } from 'react-icons/fi';

declare module 'next-auth' {
  interface User {
    id: string;
  }
  interface Session {
    user: User;
  }
}

interface ChatRoom {
  id: string;
  title: string;
  createdAt: string;
}

interface SidebarProps {
  onSelectChatRoom: (roomId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectChatRoom }) => {
  const { data: session, status } = useSession();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [newRoomTitle, setNewRoomTitle] = useState<string>('');
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);



  useEffect(() => {
    const fetchChatRooms = async () => {
      const res = await fetch('/api/auth/chatrooms');
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('chatRooms', JSON.stringify(data));
        setChatRooms(data);
      } else {
        console.error('Failed to fetch chat rooms');
      }
    };
    // ดึงข้อมูลห้องแชทจาก LocalStorage หากมี
    const storedChatRooms = localStorage.getItem('chatRooms');
    if (storedChatRooms) {
      setChatRooms(JSON.parse(storedChatRooms));
    }

    if (status === 'authenticated') {
      fetchChatRooms(); // ถ้าเข้าสู่ระบบแล้วให้ดึงห้องแชท
    }
  }, [status, session?.user?.id]);



  const handleCreateRoom = async () => {
    if (!newRoomTitle.trim()) {
      console.error('Invalid room title');
      return;
    }
  
    const res = await fetch('/api/auth/chatrooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newRoomTitle }), // ไม่ต้องส่ง userId
    });
  
    if (res.ok) {
      const newRoom = await res.json();
      setChatRooms((prevRooms) => [...prevRooms, newRoom]);
      setNewRoomTitle('');
      setIsCreatingRoom(false);
    } else {
      const errorData = await res.json();
      alert(`Failed to create room: ${errorData.error || 'Unknown error'}`);
    }
  };
  

  const handleDeleteRoom = async (roomId: string,) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    const res = await fetch('/api/auth/chatrooms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId }),
    });

    if (res.ok) {
      const updatedChatRooms = chatRooms.filter((room) => room.id !== roomId);
      // อัปเดตข้อมูลใน LocalStorage และ State
      localStorage.setItem('chatRooms', JSON.stringify(updatedChatRooms));
      setChatRooms(updatedChatRooms);
    } else {
      console.error('Failed to delete room');
    }
  };

  return (
    <div className="w-full  p-2 text-white flex flex-col items-start space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full">
        <p className="text-lg font-bold p-2">Chatbot</p>
        <button
          className="ml-auto flex items-center justify-center p-2  text-white rounded-full shadow-md hover:bg-blue-700"
          onClick={() => setIsCreatingRoom(!isCreatingRoom)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
  
      {/* Create Room Section */}
      {isCreatingRoom && (
        <div className="mt-4 flex flex-col space-y-2">
          <input
            type="text"
            className="p-2 bg-zinc-800 text-white rounded-full"
            placeholder="Enter chat room title"
            value={newRoomTitle}
            onChange={(e) => setNewRoomTitle(e.target.value)}
          />
          <button
            className="text-white p-2 rounded bg-green-600 hover:bg-green-700"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
        </div>
      )}
  
      {/* List of Chat Rooms */}
      <nav className="flex flex-col space-y-4 w-full mt-4">
        {chatRooms.map((room) => (
          <div
            key={room.id}
            className="flex items-center justify-between rounded-xl cursor-pointer text-white px-2 py-2 hover:bg-zinc-800"
            onClick={() => onSelectChatRoom(room.id)}
          >
            <span>{room.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRoom(room.id);
              }}
              className="text-red-500 hover:text-red-700 ml-auto"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
  
};

export default Sidebar;
