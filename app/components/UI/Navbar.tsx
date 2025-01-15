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
    <nav className="bg-neutral-950 text-white w-full">
      <div className="max-w-7xl mx-auto  px-4 py-4 flex items-center justify-between">
        {/* โลโก้ */}
        <div className="text-xl font-bold">
          <Link href="/profile">
            <span>CHAT XI</span>
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
