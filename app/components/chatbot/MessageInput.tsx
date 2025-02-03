import React from 'react';

import { Textarea } from '../UI/textarea';

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
    <>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์ข้อความ (Enter เพื่อส่ง, Shift+Enter เพื่อขึ้นบรรทัดใหม่)..."
          className="w-full items-center justify-center h-24 bg-zinc-900  text-white rounded-xl"  
        />
      </>
  )
}

export default MessageInput;
