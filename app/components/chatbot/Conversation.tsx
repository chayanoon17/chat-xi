import React, { useState, useRef, useEffect, useCallback } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

interface Message {
  question: string;
  answer: string;
  isLoading: boolean;
}

interface ConversationProps {
  chatRoomId: string | null; // ✅ รองรับ null ตอนเริ่มต้น
  setSelectedRoomId: (roomId: string) => void;
}

interface MessageData {
  sender: string;
  content: string;
}

const Conversation: React.FC<ConversationProps> = ({ chatRoomId, setSelectedRoomId }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  //  โหลดข้อความเก่า เฉพาะเมื่อ chatRoomId มีค่า (ไม่ใช่ null)
  const fetchPreviousMessages = useCallback(async () => {
    if (!chatRoomId) return; //  หยุดโหลดถ้าไม่มี chatRoomId

    try {
      const res = await fetch(`/api/auth/chat?chatRoomId=${chatRoomId}`);
      if (!res.ok) throw new Error("Failed to fetch previous messages");

      const data = await res.json();
      const formattedMessages = data.messages.map((msg: MessageData) => ({
        question: msg.sender === "user" ? msg.content : "",
        answer: msg.sender === "ai" ? msg.content : "",
        isLoading: false,
      }));

      setMessages(formattedMessages);
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถโหลดบทสนทนาเก่าได้");
    }
  }, [chatRoomId]);

  //  ฟังก์ชันส่งข้อความ และสร้างห้องอัตโนมัติ
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { question: message, answer: "", isLoading: true }]);
    setMessage("");

    try {
      const res = await fetch("/api/auth/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, chatRoomId }), // chatRoomId อาจเป็น null (API จะสร้างให้)
      });

      if (!res.ok) throw new Error("Failed to fetch AI response");

      // ✅ ถ้า chatRoomId เป็น null → ดึงค่าจาก response headers
      if (!chatRoomId) {
        const newChatRoomId = res.headers.get("chatRoomId");
        if (newChatRoomId) {
          setSelectedRoomId(newChatRoomId); // ✅ อัปเดต chatRoomId ใหม่
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
          updated[updated.length - 1] = { ...updated[updated.length - 1], isLoading: false };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการส่งข้อความ");
    }
  };

  // ✅ โหลดข้อความเก่าเมื่อ chatRoomId เปลี่ยน (แต่ต้องไม่เป็น null)
  useEffect(() => {
    fetchPreviousMessages();
  }, [chatRoomId, fetchPreviousMessages]);

  // ✅ เลื่อนลงไปข้อความล่าสุด
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full mx-auto bg-neutral-950">
      {/* Message List Section */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-neutral-900">
        <div className="mx-auto max-w-3xl justify-center items-center">
          <MessageList messages={messages} error={error} />
          <div ref={endOfMessagesRef} />
        </div>
      </div>

      {/* Message Input Section */}
      <div className="flex mx-auto px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          loading={messages[messages.length - 1]?.isLoading || false}
        />
      </div>
    </div>
  );
};

export default Conversation;
