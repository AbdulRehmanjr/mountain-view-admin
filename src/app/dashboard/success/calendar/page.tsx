import { SetCalendarData } from "~/app/_components/dashboard/settings/SetCalendarData";



export default function CalendarSuccessPage({ searchParams }: { searchParams: { code: string } }) {

    console.log('code',searchParams.code)

    return (
        <section className="flex flex-col items-center gap-2">
            <h1 className="text-5xl">Calendar Connectivity done</h1>
            <SetCalendarData token={searchParams.code} />
        </section>
    )
}