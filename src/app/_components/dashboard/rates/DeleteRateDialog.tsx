import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export const DeleteRatesPopup = ({ ratePlanCodes }: { ratePlanCodes: string[] }) => {

  const deleteRooms = api.rateplan.deleteRatePlan.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={ratePlanCodes.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            information and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteRooms.mutate({ rateCodes: ratePlanCodes })}
            disabled={deleteRooms.isLoading}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
