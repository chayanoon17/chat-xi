"use client";
import React, { useState, useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { motion } from "framer-motion";
import { Suspense } from "react";

interface Message {
  question: string;
  answer: string;
  isLoading: boolean;
}

interface ConversationProps {
  chatRoomId: string | null;
  setSelectedRoomId: (roomId: string) => void;
  resetChat: () => void;
}

const Conversation: React.FC<ConversationProps> = ({
  chatRoomId,
}) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPrompts, setShowPrompts] = useState(true); // 👈 เพิ่ม state ควบคุมการแสดง prompt
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = [
    "What are the advantages of using Next.js?",
    "Write code to demonstrate algorithms",
    "Help me write an essay about Silicon Valley",
    "I need a spaghetti recipe.",
  ];

  const handleSendMessage = async (inputMessage: string) => {
    if (!inputMessage.trim()) return;
    setShowPrompts(false); // 👈 ซ่อน prompt เมื่อเริ่มส่งข้อความ
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { question: inputMessage, answer: "", isLoading: true },
    ]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log("API URL:", apiUrl);
      if (!apiUrl) {
        console.error("API URL is not defined!");
        setError("API URL ยังไม่ได้ตั้งค่า");
        setLoading(false);
        return;
      }
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: inputMessage, chatRoomId }),
      });

      if (!res.ok) throw new Error("Failed to fetch AI response");

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
            setMessages((prev) => {
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

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            isLoading: false,
          };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการส่งข้อความ");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPromptClick = (prompt: string) => {

    handleSendMessage(prompt);
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <motion.div
        key={chatRoomId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full mx-auto bg-neutral-950"
      >
        <div className="flex flex-col h-full w-full mx-auto bg-neutral-950">
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-neutral-900">
            <div className="mx-auto max-w-3xl">
              <MessageList messages={messages} error={error} />
              <div ref={endOfMessagesRef} />
            </div>
          </div>

          {showPrompts && (
            <div className="lex mx-auto px-4 p-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
              <div className="lex mx-auto px-4 p-4 pb-4 md:pb-16 gap-2 w-full md:max-w-3xl">
                <div className="text-2xl">Hello there!</div>
                <div className="text-2xl text-zinc-500">
                  How can I help you today?
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              handleSendMessage={() => {
                handleSendMessage(message);
                setMessage("");
              }}
            />
          </div>
        </div>
      </motion.div>
    </Suspense>
  );
};

export default Conversation;
