import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoomsQueryOptions } from './get-rooms';
import type { RoomInput } from '../RoomForm';
import type { RoomForListing } from '../types/room';
import { axiosClient } from '@/configs/clinet';
import type { MutationConfig } from '@/configs/query';

export const createRoom = async (data: RoomInput): Promise<RoomForListing> => {
  const response = await axiosClient.post(`/rooms`, data);
  return response.data;
};

type UseCreateRoomOptions = {
  mutationConfig?: MutationConfig<typeof createRoom>;
};

export const useCreateRoom = ({ mutationConfig }: UseCreateRoomOptions = {}) => {
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
    mutationFn: createRoom
  });
};
