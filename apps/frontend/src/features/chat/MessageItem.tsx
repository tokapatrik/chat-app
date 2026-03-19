import type { Message } from './types/message';
import { Item, ItemTitle, ItemContent } from '@/components/ui/item';

type MessageItemProps = {
  message: Message;
};

export const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <Item className="bg-secondary w-fit rounded-lg px-4 py-2">
      <ItemContent>
        <ItemTitle>{message.text}</ItemTitle>
      </ItemContent>
    </Item>
  );
};
