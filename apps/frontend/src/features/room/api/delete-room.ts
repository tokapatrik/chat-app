import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoomsQueryOptions } from './get-rooms';
import type { RoomForListing } from '../types/room';
import { axiosClient } from '@/configs/clinet';
import type { MutationConfig } from '@/configs/query';

type DeleteRoomInput = {
  id: string;
};

export const deleteRoom = async ({ id }: DeleteRoomInput): Promise<RoomForListing> => {
  const response = await axiosClient.delete(`/rooms/${id}`);
  return response.data;
};

type UseDeleteRoomOptions = {
  mutationConfig?: MutationConfig<typeof deleteRoom>;
};

export const useDeleteRoom = ({ mutationConfig }: UseDeleteRoomOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: getRoomsQueryOptions().queryKey
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteRoom
  });
};
