import React from 'react';
import { Textarea } from '../UI/textarea';
import { IoIosSend } from "react-icons/io";
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
          placeholder="Send a message..."
          className="w-full items-center justify-center h-28 border bg-zinc-800 text-lg  rounded-xl"  
        />
        <button
        onClick={handleSendMessage}>
          <IoIosSend
          className=' rounded-full hover:bg-zinc-600'
          size={30}
          />
        </button>
      </>
  )
}

export default MessageInput;
