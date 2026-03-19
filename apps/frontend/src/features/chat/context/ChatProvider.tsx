import { useEffect, useState } from 'react';
import { ChatContext } from './chat-context';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { socket } from '@/configs/socket';

type ChatProviderProps = {
  roomId: string;
  children: React.ReactNode;
};

export const ChatProvider = ({ children, roomId }: ChatProviderProps) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) return;
    setIsLoading(true);
    socket.emit('join', { roomId }, () => {
      setIsLoading(false);
    });
  }, [isConnected, roomId]);

  if (!isConnected || isLoading) {
    return <LoadingSpinner className="mx-auto" />;
  }

  return (
    <ChatContext.Provider
      value={{
        isConnected
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
