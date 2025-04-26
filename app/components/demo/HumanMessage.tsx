import React from 'react';

interface HumanMessageProps {
  question: string;
}

const HumanMessage: React.FC<HumanMessageProps> = ({ question }) => {
  return (
    <div className="text-right px-4 py-2  flex justify-end">
       <div className="px-8 py-2 rounded-xl bg-white text-black font-light" >{question}</div>
    </div>
  );
};

export default HumanMessage;
