import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCreateRoom } from '@/features/room/api/create-room';
import { RoomForm } from '@/features/room/RoomForm';

export const Route = createFileRoute('/rooms/new')({
  component: RoomNewPage
});

function RoomNewPage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useCreateRoom({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Room created successfully!', { position: 'bottom-right' });
        navigate({
          to: '/'
        });
      }
    }
  });

  return (
    <main>
      <div className="flex flex-col items-start pb-4">
        <Button variant="link" size="sm" asChild className="px-0">
          <Link to="/rooms">
            <ChevronLeft /> Back to rooms
          </Link>
        </Button>
        <div>
          <h3>Create Room</h3>
          <span className="text-muted-foreground text-sm">
            Create a new chat room and start a conversation with your friends.
          </span>
        </div>
      </div>
      <RoomForm
        onSubmit={(data) => {
          mutate(data);
        }}
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link to="/rooms">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <LoaderCircle className="animate-spin" />}
            Create room
          </Button>
        </div>
      </RoomForm>
    </main>
  );
}
