import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { useEditRoom } from '@/features/room/api/edit-room';
import { getRoomQueryOptions } from '@/features/room/api/get-room';
import { RoomForm } from '@/features/room/RoomForm';

export const Route = createFileRoute('/rooms/$roomId/edit')({
  params: {
    parse: (params) => ({
      roomId: z.uuid().parse(params.roomId)
    })
  },
  loader: async ({ params, context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData(getRoomQueryOptions(params.roomId));
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw notFound();
      }
      throw error;
    }
  },
  component: RouteComponent
});

function RouteComponent() {
  const { roomId } = Route.useParams();
  const { data: room } = useSuspenseQuery(getRoomQueryOptions(roomId));

  const navigate = useNavigate();

  const { mutate, isPending } = useEditRoom({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Room updated successfully!', { position: 'bottom-right' });
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
          <h3>Edit Room</h3>
          <span className="text-muted-foreground text-sm">Edit the details of the chat room.</span>
        </div>
      </div>
      <RoomForm
        defaultValues={room}
        onSubmit={(data) => {
          mutate({ roomId, data });
        }}
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link to="/rooms">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <LoaderCircle className="animate-spin" />}
            Save changes
          </Button>
        </div>
      </RoomForm>
    </main>
  );
}
