import { MessageItem } from './MessageItem';
import type { Message } from './types/message';

type MessageListProps = {
  messages: Message[];
};

export const MessageList = ({ messages }: MessageListProps) => {
  if (messages.length === 0) {
    return <p className="text-muted-foreground text-center text-sm">No messages yet</p>;
  }

  return messages.map((message) => <MessageItem key={message.id} message={message} />);
};
