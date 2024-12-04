import React from 'react';

const AIMessage: React.FC<{ answer: string; isLoading: boolean }> = ({ answer, isLoading }) => (
  <div className="flex justify-start">
    <div className="">
    <p>{isLoading ? `${answer}_` : answer}</p>
    </div>
  </div>
);

export default AIMessage;
