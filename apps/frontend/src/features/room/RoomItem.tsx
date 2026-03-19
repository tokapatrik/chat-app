import { Link } from '@tanstack/react-router';
import { MessageCircle, Pencil } from 'lucide-react';
import { RoomDelete } from './RoomDelete';
import type { RoomForListing } from './types/room';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@/components/ui/item';

type RoomItemProps = {
  room: RoomForListing;
};

export function RoomItem({ room }: RoomItemProps) {
  return (
    <Item className="border-border shadow">
      <ItemMedia variant="icon">
        <MessageCircle />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{room.name}</ItemTitle>
        <ItemDescription>{room.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <RoomDelete room={room} />
        <Button variant="outline" asChild>
          <Link to={`/rooms/$roomId/edit`} params={{ roomId: room.id }}>
            <Pencil />
          </Link>
        </Button>
        <Button>
          <Link to={`/rooms/$roomId/chat`} params={{ roomId: room.id }}>
            Join room
          </Link>
        </Button>
      </ItemActions>
    </Item>
  );
}
