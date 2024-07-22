import { Trash } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog"
import { api } from "~/trpc/react"



export const DeleteRoomPopups = ({ roomIds }: { roomIds: string[] }) => {

    const deleteRooms = api.room.deleteRoomsByIds.useMutation({
        onSuccess: () => { window.location.reload() },
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger className={`flex items-center gap-1 ${roomIds.length == 0 ? 'bg-red-400' : 'bg-red-600'} text-white p-[6px] rounded-md shadow-sm`} disabled={roomIds.length == 0}>
                <Trash className="w-4 h-4" /> Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete information
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteRooms.mutate({ roomIds: roomIds })} disabled={deleteRooms.isLoading}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}