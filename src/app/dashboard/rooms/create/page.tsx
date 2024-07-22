import { GoBack } from "~/app/_components/dashboard/GoBack"
import { CreateRoomForm } from "~/app/_components/dashboard/room/CreateRoomForm"


export default function CreateRoom() {

    return (
        <section className="grid  gap-4">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Add Room Information</h1>
            <GoBack />
            <CreateRoomForm />
        </section>
    )
}