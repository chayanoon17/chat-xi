import React, { useState, useRef, useEffect, useCallback } from 'react';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

interface Message {
  question: string;
  answer: string;
  isLoading: boolean;
}

interface ConversationProps {
  chatRoomId: string;
}

interface MessageData {
  sender: string;
  content: string;
}

const Conversation: React.FC<ConversationProps> = ({ chatRoomId }) => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const fetchPreviousMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/auth/chat?chatRoomId=${chatRoomId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch previous messages');
      }

      const data = await res.json();
      const formattedMessages = data.messages.map((msg: MessageData) => ({
        question: msg.sender === 'user' ? msg.content : '',
        answer: msg.sender === 'ai' ? msg.content : '',
        isLoading: false,
      }));

      setMessages(formattedMessages);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถโหลดบทสนทนาเก่าได้');
    }
  }, [chatRoomId]);

  const fetchAIResponse = async (userMessage: string) => {
    try {
      console.log('Start fetchAIResponse');
      setLoading(true);

      const res = await fetch('/api/auth/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, chatRoomId }),
      });

      console.log('User Message Sent:', userMessage);

      if (!res.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedResponse = '';

      if (reader) {
        console.log('Start streaming response');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedResponse += chunk;

          console.log('Received chunk:', chunk);
          console.log('Accumulated Response:', accumulatedResponse);

          // อัปเดตข้อความที่กำลังโหลด
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastIndex = updatedMessages.length - 1;

            if (lastIndex >= 0) {
              updatedMessages[lastIndex] = {
                ...updatedMessages[lastIndex],
                answer: accumulatedResponse,
                isLoading: true, // สถานะยังคงเป็น loading ระหว่างสตรีม
              };
            }

            return updatedMessages;
          });

          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        // เมื่อสตรีมเสร็จสิ้น ต้องอัปเดตสถานะ isLoading เป็น false
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastIndex = updatedMessages.length - 1;

          if (lastIndex >= 0) {
            updatedMessages[lastIndex] = {
              ...updatedMessages[lastIndex],
              answer: accumulatedResponse,
              isLoading: false, // อัปเดตสถานะเป็น false เมื่อคำตอบเสร็จแล้ว
            };
          }

          return updatedMessages;
        });

        console.log('Final Accumulated Response:', accumulatedResponse);
      }
    } catch (err) {
      console.error('Error during fetchAIResponse:', err);
      setError('เกิดข้อผิดพลาดในการส่งข้อความ');
    } finally {
      console.log('End fetchAIResponse');
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { question: message, answer: '', isLoading: true };
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    await fetchAIResponse(message);
  };

  useEffect(() => {
    fetchPreviousMessages();
  }, [chatRoomId, fetchPreviousMessages]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      {/* Message List - Top Section */}
      <div className="flex-1 w-full mx-auto max-w-3xl px-4 p-6 space-y-4">
        <MessageList messages={messages} error={error} />
      </div>

      {/* Message Input - Bottom Section */}
      <div className="sticky bottom-0 w-full">
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          loading={loading}
        />
      </div>

      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Conversation;
