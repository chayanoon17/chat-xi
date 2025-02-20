"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Conversation from "../components/chatbot/Conversation";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/sidebar";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

interface ChatRoom {
  id: string;
  title: string;
  createdAt: string;
}

const HomePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ตรวจจับขนาดหน้าจอเพื่อเปิด Sidebar อัตโนมัติบน Desktop และปิดบน Mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // เปิด Sidebar บน Desktop
      } else {
        setIsSidebarOpen(false); // ปิด Sidebar บน Mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSelectChatRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false); // ปิด Sidebar เมื่อเลือกห้องบนมือถือ
    }
  };

  const handleResetChat = () => {
    setSelectedRoomId(null);
    setChatRooms([]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchChatRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/auth/chatrooms`);
        if (res.ok) {
          const data = await res.json();
          setChatRooms(data);
        }
      } catch (error) {
        console.error("Failed to fetch chat rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [selectedRoomId]);

  if (status !== "authenticated") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">You need to be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SessionProvider>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar Overlay สำหรับมือถือ */}
          {isSidebarOpen && window.innerWidth < 1024 && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 bg-zinc-900 h-full transition-all duration-300 ${
              isSidebarOpen ? "w-64 shadow-lg" : "w-0"
            } lg:relative lg:w-64`}
          >
            {isSidebarOpen && (
              <Sidebar
                onSelectChatRoom={handleSelectChatRoom}
                selectedRoomId={selectedRoomId}
                setSelectedRoomId={setSelectedRoomId}
                chatRooms={chatRooms}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1">
            <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="flex-1 overflow-y-auto">
              <Conversation
                chatRoomId={selectedRoomId || ""}
                setSelectedRoomId={setSelectedRoomId}
                setChatRooms={setChatRooms}
                resetChat={handleResetChat}
              />
            </div>
          </div>
        </div>
      </SessionProvider>
    </Suspense>
  );
};

export default HomePage;
