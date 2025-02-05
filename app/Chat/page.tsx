"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const Sidebar = React.lazy(() => import("../components/Sidebar/sidebar"));
const Navbar = React.lazy(() => import("../components/Navbar/Navbar"));
const Conversation = React.lazy(() => import("../components/chatbot/Conversation"));

// ประกาศชนิดข้อมูล ChatRoom ก่อนใช้งาน
interface ChatRoom {
  id: string;
  title: string;
  createdAt: string;
}

const HomePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    // เมื่อหน้าโหลด, ดึงข้อมูลห้องแชทจาก sessionStorage
    const storedRoomId = sessionStorage.getItem("selectedRoomId");
    if (storedRoomId) {
      setSelectedRoomId(storedRoomId);
    }
  }, []);

  useEffect(() => {
    // เรียกใช้ฟังก์ชันดึงข้อมูลห้องแชทล่าสุด
    const fetchChatRooms = async () => {
      const res = await fetch("/api/auth/chatrooms");
      const data = await res.json();
      setChatRooms(data);  // อัปเดตข้อมูลห้องแชท
    };

    fetchChatRooms();
  }, []);

  const handleSelectChatRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    sessionStorage.setItem("selectedRoomId", roomId); // เก็บค่า selectedRoomId ใน sessionStorage
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-zinc-900 h-full transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        }`}
      >
        {isSidebarOpen && (
          <Sidebar
            onSelectChatRoom={handleSelectChatRoom}
            selectedRoomId={selectedRoomId} // ส่ง selectedRoomId ไปยัง Sidebar
            setSelectedRoomId={setSelectedRoomId}  // ส่ง setSelectedRoomId ไปยัง Sidebar
            />
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 overflow-y-auto">
          <Conversation
            chatRoomId={selectedRoomId || ''}
            setSelectedRoomId={setSelectedRoomId}


          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
