import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import type { Message } from '../types/message';
import { axiosClient } from '@/configs/clinet';
import type { QueryConfig } from '@/configs/query';
import type { CursorPaginatedResponse, CursorPagination } from '@/types/pagination';

const DEFAULT_LIMIT = 20;

type GetMessagesProps = {
  roomId: string;
} & Partial<CursorPagination>;

export const getMessages = async (
  props: GetMessagesProps
): Promise<CursorPaginatedResponse<Message>> => {
  const { roomId, cursor, limit = DEFAULT_LIMIT } = props;
  const response = await axiosClient.get(`/rooms/${roomId}/messages`, {
    params: { cursor, limit }
  });
  return response.data;
};

export const getMessagesQueryOptions = (props: GetMessagesProps) => {
  return infiniteQueryOptions({
    queryKey: ['messages', props.roomId, props.limit],
    queryFn: ({ pageParam }) => {
      return getMessages({
        roomId: props.roomId,
        limit: props.limit,
        cursor: pageParam
      });
    },
    initialPageParam: props.cursor,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });
};

type UseMessagesOptions = {
  props: GetMessagesProps;
  queryConfig?: QueryConfig<typeof getMessagesQueryOptions>;
};

export const useMessages = ({ props, queryConfig }: UseMessagesOptions) => {
  return useSuspenseInfiniteQuery({
    ...getMessagesQueryOptions(props),
    ...queryConfig
  });
};
