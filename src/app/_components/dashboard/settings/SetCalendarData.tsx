'use client'

import Link from "next/link"
import { useEffect } from "react"
import { setCalendarData } from "~/app/_actions/CalendarAction"
import { api } from "~/trpc/react"


export const SetCalendarData = ({ token }: { token: string }) => {

    const calendarInfo = api.calendar.getUserInfo.useQuery({ token: token })

    useEffect(() => {
        if (calendarInfo.data) {
            void setCalendarData(calendarInfo.data)
            localStorage.setItem('google_token', JSON.stringify(calendarInfo.data))
        }
    }, [calendarInfo.data])
    return (
        <Link href={'/dashboard'} className="bg-blue-500 text-white p-2" aria-disabled={calendarInfo.isFetching}> Go to Dashboard</Link>
    )
}