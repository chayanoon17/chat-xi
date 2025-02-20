import React from 'react';
import { Textarea } from '../UI/textarea';
import { FaArrowUp } from "react-icons/fa";

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  handleSendMessage,
}) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // ป้องกันการขึ้นบรรทัดใหม่
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full"> 
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message..."
        className="w-full h-28 border bg-zinc-800 text-lg rounded-xl pr-12 pl-4 pt-4"  
      />

      <button
        onClick={handleSendMessage}
        className="absolute bottom-3 right-3 bg-gray-500 text-white p-2 rounded-full transition"
      >
        <FaArrowUp size={14} />
      </button>
    </div>
  );
};

export default MessageInput;
