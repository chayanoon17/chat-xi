"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Conversation from "../components/chatbot/Conversation";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/sidebar";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";


const HomePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [chatRooms, setChatRooms] = useState<{ id: string; title: string }[]>([]);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSelectChatRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const refreshChatRooms = async () => {
    try {
      const res = await fetch("/api/auth/chatrooms");
      if (res.ok) {
        const data = await res.json();
        setChatRooms(data);
      }
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    }
  };

  

  if (status !== "authenticated") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">
          You need to be logged in to view this page.
        </p>
      </div>
    );
  }
  return (
    <Suspense fallback={<p>Loading chat rooms...</p>}>
      <SessionProvider>
      <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-zinc-900 h-full transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        {isSidebarOpen && (
          <Sidebar
            onSelectChatRoom={handleSelectChatRoom} selectedRoomId={selectedRoomId}/>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 overflow-y-auto">
          <Conversation
            refreshChatRooms={refreshChatRooms}
            chatRoomId={selectedRoomId || ''}
            setSelectedRoomId={setSelectedRoomId}
          />
        </div>
      </div>
    </div>
    </SessionProvider>
</Suspense>

    
  );
};

export default HomePage;
