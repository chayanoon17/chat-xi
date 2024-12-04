import React from 'react';
import { FiSend } from 'react-icons/fi'; // ไอคอนส่งข้อความ
import { FaSpinner } from 'react-icons/fa'; // ไอคอนหมุนสำหรับ loading

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  loading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ message, setMessage, handleSendMessage, loading }) => (
  <section className="flex justify-center text-white">
    <div className="relative w-full max-w-3xl mx-auto px-4 "> {/* ให้มันอยู่ตรงกลาง */}
      <div className="flex w-full items-center ">
        <div className="relative flex w-full ">
        <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            className="w-full h-24 bg-zinc-900 rounded-xl px-4 py-2 pr-12 resize-none" // ป้องกันการขยาย textarea
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-12 h-12 bg-blue-900 hover:bg-blue-600 text-white rounded-full"
          >
            {/* แสดงไอคอนตามสถานะ */}
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
);

export default MessageInput;
