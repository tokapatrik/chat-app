import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { getMessagesQueryOptions, useMessages } from '../api/get-messages';
import type { Message } from '../types/message';
import { socket } from '@/configs/socket';

type UseChatProps = {
  roomId: string;
};

export const useChat = ({ roomId }: UseChatProps) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.disconnect();
    };
  }, []);

  const handleNewMessage = useCallback(
    (message: Message) => {
      queryClient.setQueryData(getMessagesQueryOptions({ roomId }).queryKey, (oldData) => {
        if (!oldData) {
          return oldData;
        }
        return {
          ...oldData,
          pages: oldData.pages.map((page, index: number) => {
            if (index === 0) {
              return {
                ...page,
                items: [message, ...page.items]
              };
            }
            return page;
          })
        };
      });
    },
    [roomId, queryClient]
  );

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    socket.emit('join', { roomId });
    socket.on('message', handleNewMessage);

    return () => {
      socket.emit('leave', { roomId });
      socket.off('message', handleNewMessage);
    };
  }, [roomId, isConnected, handleNewMessage]);

  const {
    data: messages,
    fetchNextPage,
    hasNextPage
  } = useMessages({
    props: { roomId }
  });

  const sendMessage = useCallback(
    (text: string) => {
      if (!isConnected) {
        return;
      }

      socket.emit('message', { text }, handleNewMessage);
    },
    [isConnected, handleNewMessage]
  );

  return { isConnected, messages, fetchNextPage, hasNextPage, sendMessage };
};
