import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRoomsQueryOptions } from '@/features/room/api/get-rooms';
import { RoomList } from '@/features/room/RoomList';

export const Route = createFileRoute('/rooms/')({
  component: RoomsPage
});

function RoomsPage() {
  const rooms = useSuspenseQuery(getRoomsQueryOptions());

  return (
    <main>
      <div className="flex items-center justify-between gap-2 pb-4">
        <div>
          <h3>Rooms</h3>
          <span className="text-muted-foreground text-sm">
            Join a conversation in one of the available chat rooms.
          </span>
        </div>
        <Button asChild>
          <Link to="/rooms/new">
            <Plus /> Create room
          </Link>
        </Button>
      </div>
      <RoomList rooms={rooms.data} />
    </main>
  );
}
