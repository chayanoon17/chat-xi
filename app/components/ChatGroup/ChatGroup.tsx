// ChatGroup.tsx
import React from 'react';
import ChatRoomItem from '../ChatRoomItem/ChatRoomItem';

interface ChatGroupProps {
  title: string;
  rooms: { id: string; title: string }[];
  selectedRoomId: string | null;
  onSelectChatRoom: (roomId: string) => void;
  onDeleteRoom: (roomId: string) => void;
}

const ChatGroup: React.FC<ChatGroupProps> = ({
  title,
  rooms,
  selectedRoomId,
  onSelectChatRoom,
  onDeleteRoom
}) => (
  <div className="mb-4">
    <p className="text-gray-400 text-xs uppercase mb-2 px-2">{title}</p>
    {rooms.map((room) => (
      <ChatRoomItem
        key={`${room.id}-${room.title}`} // ใช้ title เพิ่มเข้ามาด้วยใน key
        room={room}
        selectedRoomId={selectedRoomId}
        onSelectChatRoom={onSelectChatRoom}
        onDeleteRoom={onDeleteRoom}
      />
    ))}
  </div>
);

export default ChatGroup;
