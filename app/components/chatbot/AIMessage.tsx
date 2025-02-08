import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCopy, FiThumbsUp, FiThumbsDown } from "react-icons/fi";

interface AIMessageProps {
  answer: string;
  isLoading: boolean;
}

// 🔥 **ฟังก์ชันแสดงโค้ดใน Markdown**
const ChatGPTCodeBlock: React.FC<{
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ inline, className, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (inline) {
    return (
      <code className="bg-gray-200 text-red-500 px-1 rounded">{children}</code>
    );
  }

  return (
    <div className="my-4 rounded-md overflow-hidden bg-zinc-900">
      <div className="flex items-center justify-between bg-zinc-800 px-4 py-2">
        <span className="text-xs text-gray-300 font-medium">
          {className?.replace("language-", "") || "Code"}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-300 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <SyntaxHighlighter
        language={className?.replace("language-", "") || ""}
        style={vscDarkPlus}
        showLineNumbers
      >
        {String(children)}
      </SyntaxHighlighter>
    </div>
  );
};

// 🔥 **ฟังก์ชันแสดงข้อความ AI**
const AIMessage: React.FC<AIMessageProps> = ({ answer, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div className="flex flex-col space-x-3 px-4 py-2">
      {/* AI Icon */}
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 border rounded-full flex items-center justify-center">
          <svg
            strokeLinejoin="round"
            viewBox="0 0 16 16"
            width={20}
            style={{ color: "currentcolor" }}
          >
            <path
              d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
              fill="currentColor"
            />
            <path
              d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
              fill="currentColor"
            />
            <path
              d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* ข้อความของ AI */}
        <div className="px-4 py-2 rounded max-w-3xl w-full text-white">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ code: ChatGPTCodeBlock }}
          >
            {answer}
          </ReactMarkdown>
          {isLoading && (
            <div className="text-sm text-gray-400 mt-2">Loading...</div>
          )}
        </div>
      </div>


      <div className="flex space-x-2 mt-2 ml-20">
        <button
          className="p-2 border rounded-md hover:bg-zinc-700 transition"
          onClick={handleCopy}
        >
          <FiCopy
            className={`text-gray-400 ${
              copied ? "text-green-400" : "hover:text-white"
            }`}
            size={16}
          />
        </button>
        <button
          className="p-2 border rounded-md hover:bg-zinc-700 transition"
          onClick={handleLike}
        >
          <FiThumbsUp
            className={`text-gray-400 ${
              liked ? "text-blue-400" : "hover:text-white"
            }`}
            size={16}
          />
        </button>
        <button
          className="p-2 border rounded-md hover:bg-zinc-700 transition"
          onClick={handleDislike}
        >
          <FiThumbsDown
            className={`text-gray-400 ${
              disliked ? "text-red-400" : "hover:text-white"
            }`}
            size={16}
          />
        </button>
      </div>
    </div>
  );
};

export default AIMessage;
