"use client";
import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Conversation from "../components/demo/Conversation";
import Navbar from "../components/demo/Navbar";
import Sidebar from "../components/demo/sidebar";

const Demo: React.FC = () => {

  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  return (
      <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      
        <div className=" h-screen  bg-neutral-950">
          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 bg-zinc-900 transition-all duration-300 ${
              isSidebarOpen ? "w-64 shadow-lg" : "w-0"
            }`}
          >
            {isSidebarOpen && (
              
              <Sidebar

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
            <Navbar
             onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              isSidebarOpen={isSidebarOpen} 
              />
            
            {/* Chat Container */}
            <div className="flex flex-1 overflow-auto">
              <Conversation
                chatRoomId={selectedRoomId || ""}
                setSelectedRoomId={setSelectedRoomId}
                resetChat={() => {}}

              />
              <div ref={endOfMessagesRef} />
            </div>
          </div>
        </div>
      </Suspense>
  );
};

export default Demo;
