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
  selectedRoomId: string | null;
  setSelectedRoomId: (roomId: string) => void;  // เพิ่ม props นี้
}


const Sidebar: React.FC<SidebarProps> = ({ onSelectChatRoom, setSelectedRoomId }) => {
  const { data: session, status } = useSession();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  console.log('Current chatRooms:', chatRooms); // ใน Sidebar

  useEffect(() => {
    const fetchChatRooms = async () => {
      const res = await fetch('/api/auth/chatrooms');
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('chatRooms', JSON.stringify(data));
        setChatRooms(data);
      } else {
        console.error('Failed to fetch chat rooms');
      }
    };

    if (status === 'authenticated') {
      fetchChatRooms(); // ถ้าเข้าสู่ระบบแล้วให้ดึงห้องแชท
    }
  }, [status, session?.user?.id]);

  useEffect(() => {
    const storedChatRooms = sessionStorage.getItem('chatRooms');
    if (storedChatRooms) {
      const parsedRooms = JSON.parse(storedChatRooms);
      setChatRooms(parsedRooms);  // อัปเดต chatRooms เมื่อมีการดึงข้อมูลจาก sessionStorage
    }
  }, []);  // useEffect นี้จะทำงานแค่ครั้งแรกเมื่อ component mount

  
  

  // ฟังก์ชันสำหรับการลบห้อง
  const handleDeleteRoom = async (roomId: string) => {
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

  const handleCreateRoomAutomatically = async () => {
    const res = await fetch('/api/auth/chatrooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'New Chat Room' }),
    });
  
    if (res.ok) {
      const newRoom = await res.json();
      const updatedChatRooms = [...chatRooms, newRoom];
      setChatRooms(updatedChatRooms);
      sessionStorage.setItem('chatRooms', JSON.stringify(updatedChatRooms));
  
      // ตั้งค่า selectedRoomId ให้เป็นห้องที่เพิ่งสร้าง
      setSelectedRoomId(newRoom.id);  // อัปเดต selectedRoomId
      sessionStorage.setItem('selectedRoomId', newRoom.id);  // เก็บค่าห้องที่เลือก
    } else {
      const errorData = await res.json();
      alert(`Failed to create room: ${errorData.error || 'Unknown error'}`);
    }
  };
  
  
  
  return (
    <div className="w-full p-2 text-white flex flex-col items-start space-y-4 h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full">
        <p className="text-lg font-bold p-2">Chatbot</p>
        {/* ปุ่ม "+" สำหรับขอห้องใหม่ */}
        <button
          className="ml-auto flex items-center justify-center p-2 text-white rounded-full shadow-md hover:bg-gray-600"
          onClick={handleCreateRoomAutomatically} // เรียกฟังก์ชันเมื่อคลิก
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

      {/* List of Chat Rooms */}
      <nav className="flex flex-col space-y-4 w-full mt-4 overflow-y-auto">
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