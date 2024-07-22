"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useHotelAdmin } from "~/utils/store";
import { ShadcnButton } from "~/app/_components/general/shadcn-button";
import { api } from "~/trpc/react";
import dayjs from "dayjs";

export const BlockDates = () => {
  const { blockDate, blockDialog, setBlockDialog, setBlockDate } =
    useHotelAdmin();
  const createBlockDate = api.price.blockRoomByDate.useMutation({
    onSuccess: () => {
      setBlockDate({ roomId: "none", startDate: null, endDate: null });
      window.location.reload();
    },
  });

  return (
    <AlertDialog open={blockDialog} onOpenChange={setBlockDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will block the room for specific
            dates.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <ShadcnButton
              title="Continue"
              type="button"
              disabled={createBlockDate.isLoading}
              onClick={() =>
                createBlockDate.mutate({
                  startDate: dayjs(blockDate.startDate).format("YYYY-MM-DD"),
                  endDate: dayjs(blockDate.endDate).format("YYYY-MM-DD"),
                  roomId: blockDate.roomId,
                })
              }
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
