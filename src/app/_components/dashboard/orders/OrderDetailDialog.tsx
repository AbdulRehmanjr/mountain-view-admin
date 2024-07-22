
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"


export const OrderDetailDialog = ({ order }: { order: BookingDetailProps }) => {

    return (
        <Dialog>
            <DialogTrigger  asChild>
                <Button >
                    Show
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[50rem]">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Order complete details
                    </DialogDescription>
                    <div className="flex justify-center gap-2">
                        <div className="flex flex-col gap-3 border-2 rounded-md p-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Label htmlFor="email">Payment email:</Label>
                                <p>{order.paymentEmail}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Label htmlFor="email">Payer Id:</Label>
                                <p>{order.payerId}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Label htmlFor="email">Payment Id:</Label>
                                <p>{order.paymentId}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Label htmlFor="email">Capture Id:</Label>
                                <p>{order.captureId}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 border-2 rounded-md p-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Label htmlFor="email">Room name:</Label>
                                <p>{order.Room.roomName}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Label htmlFor="email">Room type:</Label>
                                <p>{order.Room.roomType}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Label htmlFor="email">Capacity:</Label>
                                <p>{order.Room.capacity}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Label htmlFor="email">Area:</Label>
                                <p>{order.Room.area} sqm</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Label htmlFor="email">Features:</Label>
                                <p className="text-wrap">{order.Room.features}</p>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

