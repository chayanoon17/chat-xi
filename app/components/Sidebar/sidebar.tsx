import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { FiTrash2 } from 'react-icons/fi';
import useSWR from 'swr';

interface ChatRoom {
  id: string;
  title: string;
  createdAt: string;
}

interface SidebarProps {
  onSelectChatRoom: (roomId: string) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Sidebar: React.FC<SidebarProps> = ({ onSelectChatRoom }) => {
  const { status } = useSession();
  const { data: chatRooms, error, mutate } = useSWR(
    status === 'authenticated' ? '/api/auth/chatrooms' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const [newRoomTitle, setNewRoomTitle] = useState<string>('');
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);

  const handleCreateRoom = async () => {
    if (!newRoomTitle.trim()) return;

    const res = await fetch('/api/auth/chatrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newRoomTitle }),
    });

    if (res.ok) {
      await mutate();
      setNewRoomTitle('');
      setIsCreatingRoom(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    const res = await fetch('/api/auth/chatrooms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId }),
    });

    if (res.ok) {
      await mutate();
    }
  };

  if (error) return <p>Error loading chat rooms</p>;
  if (!chatRooms) return <p>Loading...</p>;

  return (
    <div className="w-full p-2 text-white flex flex-col items-start space-y-4 h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center w-full">
        <p className="text-lg font-bold p-2">Chatbot</p>
        <button
          className="ml-auto flex items-center justify-center p-2 text-white rounded-full shadow-md hover:bg-blue-700"
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
      <nav className="flex flex-col space-y-4 w-full mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {chatRooms.map((room: ChatRoom) => (
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
