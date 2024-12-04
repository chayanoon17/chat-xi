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
  <div className="flex-1 overflow-x-auto text-white w-full mx-auto max-w-3xl px-4 p-6 space-y-4">
    {messages.map((msg, index) => (
  <div key={index}>
    <HumanMessage question={msg.question} />
    <AIMessage answer={msg.answer} isLoading={msg.isLoading} />
  </div>
))}
    {error && <div className="text-red-500 mt-2">{error}</div>}
  </div>
);

export default MessageList;
