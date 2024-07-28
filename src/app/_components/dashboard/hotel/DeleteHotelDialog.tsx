import { ReloadIcon } from "@radix-ui/react-icons";
import { Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { api } from "~/trpc/react";

export const DeleteHotelDialog = ({ hotelIds }: { hotelIds: string[] }) => {
  const deleteInfo = api.hotel.deleteHotelByIds.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const confirmDelete = () => {
    deleteInfo.mutate({ hotelIds: hotelIds });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={hotelIds.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Information</DialogTitle>
          <DialogDescription>
            This action will delete the information
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant={"outline"}>
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={"destructive"}
            onClick={confirmDelete}
            disabled={deleteInfo.isLoading}
          >
            {deleteInfo.isLoading ? (
              <>
                {" "}
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
