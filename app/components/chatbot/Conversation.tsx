"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { motion } from "framer-motion";
import { Suspense } from "react";

interface Message {
  question: string;
  answer: string;
  isLoading: boolean;
}

interface ChatRoom {
  id: string;
  title: string;
  createdAt: string;
}

interface ConversationProps {
  chatRoomId: string | null;
  setSelectedRoomId: (roomId: string) => void;
  resetChat: () => void; // เพิ่ม resetChat props

  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>; // ส่ง setChatRooms ไปที่นี้
}

interface MessageData {
  sender: string;
  content: string;
}

const Conversation: React.FC<ConversationProps> = ({
  chatRoomId,
  setSelectedRoomId,
  setChatRooms,
}) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const suggestedPrompts = [
    "What are the advantages of using Next.js?",
    "Write code to demonstrate Dijkstra's algorithm",
    "Help me write an essay about Silicon Valley",
    "What is the weather in San Francisco?",
  ];

  const handleSuggestedPromptClick = (prompt: string) => {
    setMessage(prompt); // ตั้งค่าข้อความใหม่
    handleSendMessage(); // ส่งข้อความไปยังบอท
  };

  useEffect(() => {
    if (!chatRoomId) {
      setMessages([]); // ล้างบทสนทนาเมื่อออกจากห้องแชท
    }
  }, [chatRoomId]);

  const fetchPreviousMessages = useCallback(async () => {
    if (!chatRoomId) return; //  ป้องกันการโหลดเมื่อไม่มีห้อง
    setLoading(true);
    try {
      setLoading(true);
      const res = await fetch(`/api/auth/chat?chatRoomId=${chatRoomId}`);
      if (!res.ok) throw new Error("Failed to fetch previous messages");

      const data = await res.json();
      setMessages(
        data.messages.map((msg: MessageData) => ({
          question: msg.sender === "user" ? msg.content : "",
          answer: msg.sender === "ai" ? msg.content : "",
          isLoading: false,
        }))
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถโหลดบทสนทนาเก่าได้");
    } finally {
      setLoading(false);
    }
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setMessages((prev: Message[]) => [
      ...prev,
      { question: message, answer: "", isLoading: true },
    ]);
    setMessage("");

    try {
      setLoading(true);
      const res = await fetch("/api/auth/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, chatRoomId }),
      });

      if (!res.ok) throw new Error("Failed to fetch AI response");

      if (!chatRoomId) {
        const newChatRoomId = res.headers.get("chatRoomId");
        if (newChatRoomId) {
          setSelectedRoomId(newChatRoomId);

          // เพิ่มห้องใหม่ลงใน state (chatRooms) ทันที
          const newRoom = {
            id: newChatRoomId,
            title: message,
            createdAt: new Date().toISOString(),
          }; // เพิ่ม createdAt
          setChatRooms((prev: ChatRoom[]) => [...prev, newRoom]); // กำหนดประเภทให้ตรงกับ `ChatRoom`
        }
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedResponse = "";
      let done = false;

      if (reader) {
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            accumulatedResponse += decoder.decode(value);
            setMessages((prev: Message[]) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                answer: accumulatedResponse,
                isLoading: true,
              };
              return updated;
            });
          }
        }

        setMessages((prev: Message[]) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            isLoading: false,
          };
          return updated;
        });
      }
    } catch (err) {
      setLoading(false)
      console.error(err);
      setError("เกิดข้อผิดพลาดในการส่งข้อความ");
    }
  };

  useEffect(() => {
    setMessages([]);
    if (chatRoomId) {
      fetchPreviousMessages();
    }
  }, [chatRoomId, fetchPreviousMessages]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <motion.div
        key={chatRoomId} // ใช้ key เพื่อให้ animation ทำงานเมื่อเปลี่ยนห้อง
        initial={{ opacity: 0, y: 20 }} // เริ่มจากซ่อน
        animate={{ opacity: 1, y: 0 }} // ค่อย ๆ แสดงขึ้นมา
        exit={{ opacity: 0, y: -20 }} // ออกจากหน้าจอแบบเลื่อนขึ้น
        transition={{ duration: 0.4, ease: "easeInOut" }} // ตั้งค่าความเร็ว
        className=" w-full mx-auto bg-neutral-950"
      >
        <div className="flex flex-col h-full w-full mx-auto bg-neutral-950">
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-neutral-900">
            <div className="mx-auto max-w-3xl justify-center items-center">
              
              <MessageList messages={messages} error={error} />
              <div ref={endOfMessagesRef} />
            </div>
          </div>

          {!chatRoomId && (
            
            <div className="lex mx-auto px-4 p-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
              <div className="lex mx-auto px-4 p-4 pb-4 md:pb-16 gap-2 w-full md:max-w-3xl">
                <div className="text-2xl ">Hello there!</div>
                <div className="text-2xl text-zinc-500">
                  How can I help you today?
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 ">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPromptClick(prompt)}
                    className="border px-4 py-2 rounded-lg text-sm hover:bg-zinc-700 transition h-20"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex mx-auto px-4 p-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
            <MessageInput
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </motion.div>
    </Suspense>
  );
};

export default Conversation;
