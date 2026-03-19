import { useCallback, useEffect, useRef } from 'react';
import { useChatContext } from './use-chat-context';
import type { Message } from '../types/message';
import { socket } from '@/configs/socket';

type UseChatMessagesProps = {
  onMessageReceived?: (message: Message) => void;
};

export const useChatMessages = ({ onMessageReceived }: UseChatMessagesProps = {}) => {
  const { isConnected } = useChatContext();

  const handlerRef = useRef(onMessageReceived);

  useEffect(() => {
    handlerRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    const internalHandler = (msg: Message) => {
      handlerRef.current?.(msg);
    };

    socket.on('message', internalHandler);

    return () => {
      socket.off('message', internalHandler);
    };
  }, []);

  const sendMessage = useCallback(
    (message: string) => {
      if (isConnected) {
        socket.emit('message', { text: message }, (ackMessage: Message) => {
          onMessageReceived?.(ackMessage);
        });
      }
    },
    [isConnected, onMessageReceived]
  );

  return { sendMessage };
};
