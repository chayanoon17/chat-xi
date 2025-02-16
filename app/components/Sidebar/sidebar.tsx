import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";

interface ChatRoom {
  id: string;
  title: string;
  createdAt: string;
}

interface SidebarProps {
  onSelectChatRoom: (roomId: string) => void;
  selectedRoomId: string | null;
  setSelectedRoomId: (roomId: string) => void;
  chatRooms: ChatRoom[]; // ส่ง chatRooms ไปที่ Sidebar
  setChatRooms: (chatRooms: ChatRoom[]) => void; // ฟังก์ชันในการอัปเดต chatRooms
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectChatRoom,
  selectedRoomId,
  setSelectedRoomId,
  chatRooms,
  setChatRooms,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {data: session} = useSession();

  useEffect(() => {
  // ฟังการเปลี่ยนแปลงของ chatRooms และทำให้ Sidebar รีเฟรชเมื่อมีการอัปเดต
  if (chatRooms.length > 0 && !selectedRoomId) {
    setSelectedRoomId(chatRooms[0].id); // เลือกห้องแรกแทน
  }
}, [chatRooms, selectedRoomId, setSelectedRoomId]);


  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const res = await fetch("/api/auth/chatrooms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });

      if (res.ok) {
        // ลบห้องจาก chatRooms
        setSelectedRoomId(""); // รีเซ็ทห้องที่เลือก
        // ไม่จำเป็นต้องเรียก fetchChatRooms ใหม่เพราะเรากำลังจัดการด้วย state
      } else {
        console.error("Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const groupRoomsByDate = (rooms: ChatRoom[]) => {
    const now = new Date();
    const today: ChatRoom[] = [];
    const yesterday: ChatRoom[] = [];
    const last7Days: ChatRoom[] = [];
    const last30Days: ChatRoom[] = [];
    const older: ChatRoom[] = [];

    rooms.forEach((room) => {
      const createdDate = new Date(room.createdAt);
      const timeDiff = now.getTime() - createdDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        today.push(room);
      } else if (daysDiff === 1) {
        yesterday.push(room);
      } else if (daysDiff <= 7) {
        last7Days.push(room);
      } else if (daysDiff <= 30) {
        last30Days.push(room);
      } else {
        older.push(room);
      }
    });

    return { today, yesterday, last7Days, last30Days, older };
  };

  const { today, yesterday, last7Days, last30Days, older } =
    groupRoomsByDate(chatRooms);


    const handleCreateRoom = async () => {
      const roomName = "New Chat"; // ตั้งชื่อห้องเป็น "New Chat" โดยอัตโนมัติ
      
      try {
        // ส่งคำขอสร้างห้องใหม่ไปยัง API
        const res = await fetch("/api/auth/chatrooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: roomName }),
        });
    
        if (res.ok) {
          const newRoom: ChatRoom = await res.json(); // รับข้อมูลห้องแชทใหม่จาก API
          setSelectedRoomId(newRoom.id); // เลือกห้องใหม่ที่สร้างขึ้น
        } else {
          console.error("Failed to create room");
        }
      } catch (error) {
        console.error("Error creating room:", error);
      }
    };
    

  return (
   
    <div className="w-full  p-2 text-white flex flex-col space-y-4 h-screen">
      <div className="flex justify-between">
        <p className="text-lg p-2">Chatbot</p>
        <button className="hover:bg-zinc-800 rounded-lg">
          <IoMdAdd size={30} onClick={handleCreateRoom}/>
        </button>
      </div>
      <ScrollArea>
        <nav className="flex flex-col w-full overflow-y-auto ">
          {loading ? (
            <>
              <Skeleton className="mb-6 h-4 w-[200px] bg-zinc-800" />
              <Skeleton className="mb-6 h-4 w-[180px] bg-zinc-800" />
              <Skeleton className="mb-6 h-4 w-[170px] bg-zinc-800" />
              <Skeleton className="mb-6 h-4 w-[190px] bg-zinc-800" />
              <Skeleton className="mb-6 h-4 w-[150px] bg-zinc-800" />
              <Skeleton className="mb-6 h-4 w-[140px] bg-zinc-800" />
            </>
          ) : chatRooms.length === 0 ? (
            <p className="text-zinc-500 text-center">No chat rooms available</p>
          ) : (
            <>
              {today.length > 0 && (
                <ChatGroup
                  title="Today"
                  rooms={today}
                  onSelectChatRoom={onSelectChatRoom}
                  selectedRoomId={selectedRoomId}
                  onDeleteRoom={handleDeleteRoom}
                />
              )}
              {yesterday.length > 0 && (
                <ChatGroup
                  title="Yesterday"
                  rooms={yesterday}
                  onSelectChatRoom={onSelectChatRoom}
                  selectedRoomId={selectedRoomId}
                  onDeleteRoom={handleDeleteRoom}
                />
              )}
              {last7Days.length > 0 && (
                <ChatGroup
                  title="Last 7 Days"
                  rooms={last7Days}
                  onSelectChatRoom={onSelectChatRoom}
                  selectedRoomId={selectedRoomId}
                  onDeleteRoom={handleDeleteRoom}
                />
              )}
              {last30Days.length > 0 && (
                <ChatGroup
                  title="Last 30 Days"
                  rooms={last30Days}
                  onSelectChatRoom={onSelectChatRoom}
                  selectedRoomId={selectedRoomId}
                  onDeleteRoom={handleDeleteRoom}
                />
              )}
              {older.length > 0 && (
                <ChatGroup
                  title="Older"
                  rooms={older}
                  onSelectChatRoom={onSelectChatRoom}
                  selectedRoomId={selectedRoomId}
                  onDeleteRoom={handleDeleteRoom}
                />
              )}
            </>
          )}
        </nav>
        </ScrollArea>
      <div className="absolute bottom-3 flex justify-center w-60">
  <div className="flex items-center space-x-2 p-3h-14 w-auto rounded-lg">
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <div className="text-white">
      {session?.user.email}
    </div>
  </div>
</div>

    </div>

  );
};

const ChatGroup: React.FC<{
  title: string;
  rooms: ChatRoom[];
  selectedRoomId: string | null;
  onSelectChatRoom: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
}> = ({ title, rooms, selectedRoomId, onSelectChatRoom, onDeleteRoom }) => (
  <div className="mb-4">
    <p className="text-gray-400 text-xs uppercase mb-2 px-2">{title}</p>

    {rooms.map((room) => (
      <ChatRoomItem
        key={`${room.id}-${room.createdAt}`} // เพิ่ม createdAt เพื่อให้ key ไม่ซ้ำ
        room={room}
        selectedRoomId={selectedRoomId}
        onSelectChatRoom={onSelectChatRoom}
        onDeleteRoom={onDeleteRoom}
      />
    ))}
  </div>
);

const ChatRoomItem: React.FC<{
  room: ChatRoom;
  selectedRoomId: string | null;
  onSelectChatRoom: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
}> = ({ room, selectedRoomId, onSelectChatRoom, onDeleteRoom }) => (
  <div
    className={`flex items-center justify-between rounded-lg cursor-pointer text-white px-3 py-2 hover:bg-zinc-800 ${
      room.id === selectedRoomId ? "bg-zinc-800" : ""
    }`}
    onClick={() => onSelectChatRoom(room.id)}
  >
    <p className="text-sm">{room.title}</p>

    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <FiMoreHorizontal
          className="text-gray-400 hover:text-white"
          size={20}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRoom(room.id);
          }}
          className="text-red-500 hover:bg-red-950 rounded-md cursor-pointer"
        >
          <FiTrash2 size={20} className="text-red-500 hover:text-red-700" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export default Sidebar;
