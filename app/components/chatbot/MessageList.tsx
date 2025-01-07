// MessageList.tsx
import React from 'react';
import AIMessage from './AIMessage';
import HumanMessage from './HumanMessage';

interface Message {
  question: string;
  answer: string;
  isLoading: boolean;
}

interface MessageListProps {
  messages: Message[];
  error: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, error }) => (
  <div className="w-full text-white  px-4 p-6 space-y-4">
    {messages.map((msg, index) => (
  <div key={index}>
    {msg.question && <HumanMessage question={msg.question} />}
    {msg.answer && <AIMessage answer={msg.answer} isLoading={msg.isLoading} />}
  </div>
))}

    {error && <div className="text-red-500 mt-2">{error}</div>}
  </div>
);

export default MessageList;
