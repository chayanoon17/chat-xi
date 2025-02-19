// ChatRoomItem.tsx
import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { FiMoreHorizontal } from 'react-icons/fi';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ChatRoomItemProps {
  room: { id: string; title: string };
  selectedRoomId: string | null;
  onSelectChatRoom: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
}

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({
  room,
  selectedRoomId,
  onSelectChatRoom,
  onDeleteRoom
}) => (
  <div
    className={`flex items-center justify-between rounded-lg cursor-pointer text-white px-3 py-2 hover:bg-zinc-800 ${
      room.id === selectedRoomId ? 'bg-zinc-800' : ''
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

export default ChatRoomItem;
