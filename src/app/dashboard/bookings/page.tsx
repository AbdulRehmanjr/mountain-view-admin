import { BookingForm } from "~/app/_components/dashboard/booking/CreateBooking";
import { PageTitle } from "~/app/_components/general/page-title";



export default function ManualBookingPage() {


    return (
        <section className="flex flex-col gap-4 h-full">
            <PageTitle title="Manual Booking"/>
            <BookingForm />
        </section>
    )
}