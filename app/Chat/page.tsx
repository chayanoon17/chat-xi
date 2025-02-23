"use client";
import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Conversation from "../components/chatbot/Conversation";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/sidebar";
import { SessionProvider } from "next-auth/react";

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
  const [loading, setLoading] = useState<boolean>(false);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatRooms]);

  if (status !== "authenticated") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">You need to be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <SessionProvider>
      <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
        <div className="flex h-screen overflow-hidden bg-neutral-950">
          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 bg-zinc-900 transition-all duration-300 ${
              isSidebarOpen ? "w-64 shadow-lg" : "w-0"
            }`}
          >
            {isSidebarOpen && (
              <Sidebar
                onSelectChatRoom={setSelectedRoomId}
                selectedRoomId={selectedRoomId}
                chatRooms={chatRooms}
                setChatRooms={setChatRooms}
                setSelectedRoomId={setSelectedRoomId}
              />
            )}
          </div>

          {/* Overlay to close Sidebar */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* Main Content */}
          <div className="flex flex-col flex-1 w-full h-full">
            {/* Navbar */}
            <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
            
            {/* Chat Container */}
            <div className="flex flex-1 overflow-auto">
              <Conversation
                chatRoomId={selectedRoomId || ""}
                setSelectedRoomId={setSelectedRoomId}
                resetChat={() => {}}
                setChatRooms={setChatRooms}
              />
              <div ref={endOfMessagesRef} />
            </div>
          </div>
        </div>
      </Suspense>
    </SessionProvider>
  );
};

export default HomePage;
