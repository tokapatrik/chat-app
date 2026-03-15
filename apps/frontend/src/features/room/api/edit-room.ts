import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoomsQueryOptions } from './get-rooms';
import type { RoomInput } from '../RoomForm';
import { getRoomQueryOptions } from './get-room';
import type { RoomForListing } from '../types/room';
import { axiosClient } from '@/configs/clinet';
import type { MutationConfig } from '@/configs/query';

type EditRoomProps = {
  roomId: RoomForListing['id'];
  data: RoomInput;
};

export const editRoom = async ({ roomId, data }: EditRoomProps): Promise<RoomForListing> => {
  const response = await axiosClient.patch(`/rooms/${roomId}`, data);
  return response.data;
};

type UseEditRoomOptions = {
  mutationConfig?: MutationConfig<typeof editRoom>;
};

export const useEditRoom = ({ mutationConfig }: UseEditRoomOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: async (data, ...args) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getRoomsQueryOptions().queryKey
        }),
        queryClient.invalidateQueries({
          queryKey: getRoomQueryOptions(data.id).queryKey
        })
      ]);
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: editRoom
  });
};
