import { GoBack } from "~/app/_components/dashboard/GoBack"
import { EditRoomForm } from "~/app/_components/dashboard/room/EditRoomForm"



export default function EditHotelPage({ params }: { params: { roomId: string } }) {

    return (
        <section className="flex flex-col gap-3">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Edit Room Information</h1>
            <GoBack />
            <EditRoomForm roomId={params.roomId} />
        </section>
    )
}