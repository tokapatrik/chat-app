import { LoaderCircle, Trash2, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useDeleteRoom } from './api/delete-room';
import type { RoomForListing } from './types/room';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type RoomDeleteProps = {
  room: RoomForListing;
};

export const RoomDelete = ({ room }: RoomDeleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useDeleteRoom({
    mutationConfig: {
      onSuccess: () => {
        setIsOpen(false);
      }
    }
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">
          <Trash2 className="text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Do you really want to delete {room.name} chat room?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat room. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => mutate({ id: room.id })}
            disabled={isPending}
          >
            {isPending && <LoaderCircle className="animate-spin" />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
