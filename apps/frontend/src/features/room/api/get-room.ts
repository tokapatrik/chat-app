import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import type { RoomForListing } from '../types/room';
import { axiosClient } from '@/configs/clinet';
import type { QueryConfig } from '@/configs/query';

export const getRoom = async (roomId: RoomForListing['id']): Promise<RoomForListing> => {
  const response = await axiosClient.get(`/rooms/${roomId}`);
  return response.data;
};

export const getRoomQueryOptions = (roomId: RoomForListing['id']) => {
  return queryOptions({
    queryKey: ['room', roomId],
    queryFn: () => getRoom(roomId)
  });
};

type UseRoomOptions = {
  roomId: RoomForListing['id'];
  queryConfig?: QueryConfig<typeof getRoomQueryOptions>;
};

export const useRoom = ({ roomId, queryConfig }: UseRoomOptions) => {
  return useSuspenseQuery({
    ...getRoomQueryOptions(roomId),
    ...queryConfig
  });
};
