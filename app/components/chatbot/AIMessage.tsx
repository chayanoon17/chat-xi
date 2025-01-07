import React from "react";

const AIMessage: React.FC<{ answer: string; isLoading: boolean }> = ({
  answer,
  isLoading,
}) => (
  <div className="flex flex-col items-start space-y-2">
    {/* รูปภาพ AI แบบ SVG */}
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-blue-500 w-8 h-8"
        >
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM9 10a1 1 0 112 0v4a1 1 0 11-2 0v-4zm4 0a1 1 0 112 0v4a1 1 0 11-2 0v-4z" />
        </svg>
      </div>
      <div className=" text-white px-4 py-2 rounded-lg">
        <p>{isLoading ? `${answer}_` : answer}</p>
      </div>
    </div>

    {/* ปุ่มไลค์ */}
    {/* <div className="flex mt-2">
      <button className="flex items-center justify-center w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 9l-5 5m0 0l5 5m-5-5h12"
          />
        </svg>
      </button>
    </div> */}
  </div>
);

export default AIMessage;
