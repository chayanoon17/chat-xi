"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Conversation from "../components/chatbot/Conversation";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/sidebar";
import { SessionProvider } from "next-auth/react";

const HomePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

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

  if (status === "authenticated" && session?.user) {
    return (
      <SessionProvider session={session}>

        <div className={`flex h-screen bg-neutral-950 transition-all duration-300`}>
          {/* Sidebar */}
          <div
            className={`bg-zinc-900 h-full transition-all duration-300 ${
              isSidebarOpen ? "w-64" : "w-0"
            }`}
          >
            {isSidebarOpen && <Sidebar onSelectChatRoom={handleSelectChatRoom} />}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Navbar */}
            <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-0">
              {selectedRoomId ? (
                <Conversation chatRoomId={selectedRoomId} />
              ) : (
                <div className="flex text-white items-center justify-center h-full text-center">
                  <div className="typewriter">Select a chat room to begin processing.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SessionProvider>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl text-gray-600">You need to be logged in to view this page.</p>
    </div>
  );
};

export default HomePage;
