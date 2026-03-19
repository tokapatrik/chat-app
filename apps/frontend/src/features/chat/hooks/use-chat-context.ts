import { use } from 'react';
import { ChatContext } from '../context/chat-context';

export const useChatContext = () => {
  return use(ChatContext);
};
