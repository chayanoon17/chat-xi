import React from 'react';
import { FiSend } from 'react-icons/fi'; // ไอคอนส่งข้อความ
import { FaSpinner } from 'react-icons/fa'; // ไอคอนหมุนสำหรับ loading

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  loading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  handleSendMessage,
  loading,
}) => {
  
  // ฟังก์ชันสำหรับตรวจจับปุ่ม Enter ใน textarea
  // ถ้ากด Enter เฉย ๆ -> ส่งข้อความ
  // ถ้ากด Shift + Enter -> ขึ้นบรรทัดใหม่ (ไม่ส่งข้อความ)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // ป้องกันการขึ้นบรรทัดใหม่
      handleSendMessage()
    }
  }

  return (
    <section className="flex justify-center text-white bg-black sticky bottom-0 z-50">
  <div className="relative w-full max-w-3xl mx-auto px-4 p-4">
    <div className="flex w-full items-center">
      <div className="relative flex w-full">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์ข้อความ (Enter เพื่อส่ง, Shift+Enter เพื่อขึ้นบรรทัดใหม่)..."
          className="w-full h-24 bg-zinc-900 rounded-xl px-4 py-2 pr-12 resize-none"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-12 h-12 bg-blue-900 hover:bg-blue-600 text-white rounded-full"
        >
          {loading ? (
            <FaSpinner className="animate-spin" size={20} />
          ) : (
            <FiSend size={20} />
          )}
        </button>
      </div>
    </div>
  </div>
</section>

  )
}

export default MessageInput;
