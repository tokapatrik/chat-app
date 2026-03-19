import { createContext } from 'react';

type ChatContext = {
  isConnected: boolean;
};

const DEFAULT_VALUE: ChatContext = {
  isConnected: false
};

export const ChatContext = createContext<ChatContext>(DEFAULT_VALUE);
