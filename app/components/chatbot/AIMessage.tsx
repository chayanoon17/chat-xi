// AIMessage.tsx
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
// ใช้ไอคอนจาก react-icons
import { FaRobot } from 'react-icons/fa'

interface AIMessageProps {
  answer: string
  isLoading: boolean
}

// CodeBlock สำหรับโค้ด Markdown + ย่อ/ขยาย + Copy (เหมือนเดิม)
const ChatGPTCodeBlock: React.FC<{
  inline?: boolean
  className?: string
  children?: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any
}> = ({ inline, className, children, node }) => {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // จำนวนบรรทัดที่ให้โชว์ก่อน (เช่น 13)
  const linesToShow = 13
  const codeText = String(children || '')
  const lines = codeText.split('\n')

  let language = ''
  if (className) {
    const match = /language-(\w+)/.exec(className)
    language = match ? match[1] : ''
  }

  let title = ''
  const metastring = node?.properties?.metastring as string | undefined
  if (metastring) {
    const titleMatch = metastring.match(/title="([^"]+)"/)
    if (titleMatch) {
      title = titleMatch[1]
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // inline code (backtick เดียว)
  if (inline) {
    return (
      <code className="bg-gray-200 text-red-500 px-1 rounded">
        {children}
      </code>
    )
  }

  const isLongCode = lines.length > linesToShow
  const visibleLines = expanded ? lines : lines.slice(0, linesToShow)

  return (
    <div className="my-4 rounded-md overflow-hidden rounded-xl">
      <div className="flex items-center justify-between bg-[#2f3031] px-4 py-2">
        <span className="text-xs text-gray-300 font-medium">
          {title || language || 'Untitled'}
        </span>

        <div className="flex items-center space-x-2">
          {isLongCode && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-gray-300 bg-[#3c3c3c] px-2 py-1 rounded hover:bg-[#5e5e5e]"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="text-xs text-gray-300 bg-[#3c3c3c] px-2 py-1 rounded hover:bg-[#5e5e5e]"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#1e1e1e'
        }}
        lineNumberStyle={{
          minWidth: '2rem',
          paddingRight: '8px',
          fontSize: '0.8rem',
          opacity: 0.7
        }}
      >
        {visibleLines.join('\n')}
      </SyntaxHighlighter>

      {!expanded && isLongCode && (
        <div className="px-4 py-2 text-xs text-gray-500 bg-[#2f3031]">
          ...บางส่วน (expand เพื่อดูเพิ่มเติม)
        </div>
      )}
    </div>
  )
}

const AIMessage: React.FC<AIMessageProps> = ({ answer, isLoading }) => {
  return (
    <div className="flex items-start space-x-3 px-4 py-2">
      {/* ส่วนไอคอน AI (FaRobot) แทนรูป */}
      <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
        <FaRobot className="text-white" size={20} />
      </div>

      {/* ส่วนข้อความ/โค้ด */}
      <div className="px-4 py-2 rounded max-w-3xl w-full  text-white">
      {isLoading && <div className="text-sm text-gray-400">Loading...</div>}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: ChatGPTCodeBlock
          }}
        >
          {answer}
        </ReactMarkdown>

      </div>
    </div>
  )
}

export default AIMessage
