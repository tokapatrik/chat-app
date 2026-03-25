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
  const { roomId, limit = DEFAULT_LIMIT, cursor } = props;
  return infiniteQueryOptions({
    queryKey: ['messages', roomId, limit],
    queryFn: ({ pageParam }) => {
      return getMessages({
        roomId,
        limit,
        cursor: pageParam
      });
    },
    initialPageParam: cursor,
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
