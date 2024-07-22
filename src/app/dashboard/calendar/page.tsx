import { BookingCalendar } from "~/app/_components/dashboard/calendar/BookingCalendar";
import { PageTitle } from "~/app/_components/general/page-title";


export default function CalendarPage() {

    return (
        <section className="flex flex-col gap-3">
            <PageTitle title="Calendar"/>
            <BookingCalendar />
        </section>
    )
}