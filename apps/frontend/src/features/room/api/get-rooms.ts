import { queryOptions, useQuery } from '@tanstack/react-query';
import type { RoomForListing } from '../types/room';
import { axiosClient } from '@/configs/clinet';
import type { QueryConfig } from '@/configs/query';

export const getRooms = async (): Promise<RoomForListing[]> => {
  const response = await axiosClient.get(`/rooms`);
  return response.data;
};

export const getRoomsQueryOptions = () => {
  return queryOptions({
    queryKey: ['rooms'],
    queryFn: () => getRooms()
  });
};

type UseRoomsOptions = {
  queryConfig?: QueryConfig<typeof getRoomsQueryOptions>;
};

export const useRooms = ({ queryConfig }: UseRoomsOptions) => {
  return useQuery({
    ...getRoomsQueryOptions(),
    ...queryConfig
  });
};
