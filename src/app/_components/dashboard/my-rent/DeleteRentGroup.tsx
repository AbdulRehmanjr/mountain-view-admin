"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export const DeleteRentGroup = ({ rentId }: { rentId: string }) => {
  const deleteInfo = api.myrent.deleteGroup.useMutation();

  const confirmDelete = () => {
    deleteInfo.mutate({ myRentId: rentId });
  };

  return (
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
        <Trash className="h-4 w-4" />
      )}
    </Button>
  );
};
