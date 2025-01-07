import React from 'react';

interface HumanMessageProps {
  question: string;
}

const HumanMessage: React.FC<HumanMessageProps> = ({ question }) => {
  return (
    <div className="text-right px-4 py-2  flex justify-end">
       <div className="px-8 py-2 rounded bg-usermessage " >{question}</div>
    </div>
  );
};

export default HumanMessage;
