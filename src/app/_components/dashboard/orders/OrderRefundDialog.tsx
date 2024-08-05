import { ReloadIcon } from "@radix-ui/react-icons"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"

import { api } from "~/trpc/react"

export const OrderRefundDialog = ({ order }: { order: BookingDetailProps }) => {

    // const makeRefund = api.booking.makeRefund.useMutation({
    //     onSuccess: () => { window.location.reload() }
    // })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'outline'} >
                    Refund
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle >Refund Payment</DialogTitle>
                    <DialogDescription>
                        This action will refund the order payment
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant={'outline'}>
                            Close
                        </Button>
                    </DialogClose>
                    {/* <Button type="button" onClick={() => makeRefund.mutate({ captureId: order.captureId, paymentId: order.paymentId })} disabled={makeRefund.isLoading}>
                        {
                            makeRefund.isLoading ? <> <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Please wait</> : 'Confirm'
                        }
                    </Button> */}
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
