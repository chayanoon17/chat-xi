// components/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DrawOutlineButton from "./DrawOutlineButton";


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <nav className="bg-black text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* โลโก้ */}
        <div className="text-xl font-bold">
          <Link href="">
            <span className="flex items-center space-x-2">
              {/* ใช้ span ครอบ เพื่อสามารถวาง svg และข้อความได้ง่าย */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 394 80"
                className=" text-white fill-current" // เพิ่ม class ที่นี่
              >
                <path d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z" />
                <path d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z" />
              </svg>
            </span>
            <span>Chatbot</span>
          </Link>
        </div>

        {/* ปุ่มเปิด/ปิดเมนูบนมือถือ */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            {isOpen ? (
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M18.3 5.71A1 1 0 1 0 16.89 4.3L12 9.17 7.11 4.29a1 1 0 0 0-1.42 1.42l5 5a1 1 0 0 0 1.42 0l5-5zM4 15a1 1 0 011-1h14a1 1 0 010 2H5a1 1 0 01-1-1z"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 011 1 1 1 0 01-1 1H4a1 1 0 010-2zm0 6h16a1 1 0 011 1 1 1 0 01-1 1H4a1 1 0 010-2zm16 6H4a1 1 0 010-2h16a1 1 0 010 2z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* เมนูหลักบนจอใหญ่ */}
        <div className="hidden md:flex space-x-6">

          <Link href="/Contact">
          <DrawOutlineButton>Contact</DrawOutlineButton>
          </Link>
          <DrawOutlineButton onClick={() => signOut({ callbackUrl: "/" })}>
    Logout
  </DrawOutlineButton>
        </div>
      </div>

      {/* เมนูบนจอเล็ก แสดงเมื่อคลิกปุ่ม */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-gray-700">
        <div className="px-4 py-3 space-y-2">
          <Link href="/Contact">
            <DrawOutlineButton className="w-full text-left">
              Contact
            </DrawOutlineButton>
          </Link>
          <DrawOutlineButton
            className="w-full text-left"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </DrawOutlineButton>
        </div>
      </div>
      )}
    </nav>
  );
};

export default Navbar;
