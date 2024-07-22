import { RoomTable } from "~/app/_components/dashboard/room/RoomTable";

export default function RoomPage() {

    return (
        <section className="flex flex-col gap-3">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Room Details</h1>
            <RoomTable />
        </section>
    )
}
