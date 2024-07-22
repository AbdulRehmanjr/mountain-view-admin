import { HotelTable } from "~/app/_components/dashboard/hotel/HotelTable";


export default function HotelPage() {

    return (
        <section className="flex flex-col gap-3">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Hotel Details</h1>
            <HotelTable />
        </section>
    )
}