import { GoBack } from "~/app/_components/dashboard/GoBack"
import { EditHotelForm } from "~/app/_components/dashboard/hotel/EditHotelForm"


export default function EditHotelPage({ params }: { params: { hotelId: string } }) {

    return (
        <section className="flex flex-col gap-3">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Edit Hotel Information</h1>
            <GoBack/>
            <EditHotelForm hotelId={params.hotelId} />
        </section>
    )
}