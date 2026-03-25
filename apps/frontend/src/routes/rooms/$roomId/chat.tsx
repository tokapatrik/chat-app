import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { ChevronLeft } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import z from 'zod';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { getMessagesQueryOptions } from '@/features/chat/api/get-messages';
import { useChat } from '@/features/chat/hooks/use-chat';
import { MessageCreate } from '@/features/chat/MessageForm';
import { MessageList } from '@/features/chat/MessageList';
import { getRoomQueryOptions, useRoom } from '@/features/room/api/get-room';

export const Route = createFileRoute('/rooms/$roomId/chat')({
  params: {
    parse: (params) => ({
      roomId: z.uuid().parse(params.roomId)
    })
  },
  loader: async ({ params, context: { queryClient } }) => {
    try {
      await Promise.all([
        queryClient.ensureQueryData(getRoomQueryOptions(params.roomId)),
        queryClient.ensureInfiniteQueryData(getMessagesQueryOptions({ roomId: params.roomId }))
      ]);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw notFound();
      }
      throw error;
    }
  },
  component: ChatPage
});

function ChatPage() {
  const { roomId } = Route.useParams();
  const { data: room } = useRoom({ roomId });
  const { messages, fetchNextPage, hasNextPage, sendMessage } = useChat({ roomId });

  const allRows = messages.pages.flatMap((d) => d.items);

  return (
    <main className="space-y-4">
      <div className="flex flex-col items-start">
        <Button variant="link" size="sm" asChild className="px-0">
          <Link to="/rooms">
            <ChevronLeft /> Back to rooms
          </Link>
        </Button>
        <div>
          <h3 className="font-bold">{room.name}</h3>
          <p className="text-muted-foreground text-sm">{room.description}</p>
        </div>
      </div>

      <div
        id="scrollableDiv"
        className="bg-background flex h-96 flex-col-reverse overflow-y-auto rounded-lg border p-4"
      >
        <InfiniteScroll
          dataLength={allRows.length}
          next={fetchNextPage}
          hasChildren={allRows.length > 0}
          className="flex flex-col-reverse gap-2"
          inverse={true}
          hasMore={hasNextPage}
          loader={<LoadingSpinner />}
          scrollableTarget="scrollableDiv"
        >
          <MessageList messages={allRows} />
        </InfiniteScroll>
      </div>
      <MessageCreate onSubmit={(messageInput) => sendMessage(messageInput.text)} />
    </main>
  );
}
