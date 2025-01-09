// Conversation.tsx
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
      let done = false;
      let accumulatedResponse = '';

      if (reader) {
        console.log('Start streaming response');

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunkValue = decoder.decode(value);
            accumulatedResponse += chunkValue;

            console.log('Received chunk:', chunkValue);
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
          }

          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        // เมื่อสตรีมเสร็จสิ้น ต้องอัปเดตสถานะ isLoading เป็น false
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastIndex = updatedMessages.length - 1;

          if (lastIndex >= 0) {
            updatedMessages[lastIndex] = {
              ...updatedMessages[lastIndex],
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

      // อัปเดตข้อความล่าสุดให้ไม่โหลด
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;

        if (lastIndex >= 0) {
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            isLoading: false,
          };
        }

        return updatedMessages;
      });
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
  {/* Message List */}
  <div className="flex-1 overflow-y-auto px-4 py-6 mx-auto max-w-3xl w-full">
    <MessageList messages={messages} error={error} />
    <div ref={endOfMessagesRef} />
  </div>

  {/* Message Input */}
  <MessageInput
    message={message}
    setMessage={setMessage}
    handleSendMessage={handleSendMessage}
    loading={false}
  />
</div>

  );
};

export default Conversation;
