import { MessageCircleOff } from 'lucide-react';
import { RoomItem } from './RoomItem';
import type { RoomForListing } from './types/room';

type ListRoomsProps = {
  rooms: Array<RoomForListing>;
};

export function RoomList({ rooms }: ListRoomsProps) {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      {rooms.length === 0 && (
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-8 text-center">
          <MessageCircleOff />
          <p>No chat rooms available. Create a new room to start a conversation.</p>
        </div>
      )}
      {rooms.map((room) => (
        <RoomItem key={room.id} room={room} />
      ))}
    </div>
  );
}
