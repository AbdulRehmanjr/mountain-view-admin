/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { useMemo, useState } from "react"
import dayjs, { type Dayjs } from 'dayjs'
import { api } from "~/trpc/react"
import { EventDialog } from "~/app/_components/dashboard/calendar/EventDialog"
import { Button } from "~/components/ui/button"


export const EventCalendar = () => {

    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
    const eventData = api.calendar.getEvents.useQuery()

    const currentMonth: Dayjs[][] = useMemo(() => {
        const currentMonth = selectedDate || dayjs()
        const firstDay = currentMonth.clone().startOf('month').day()
        const daysInMonth = currentMonth.daysInMonth()
        const emptyDaysBefore: Dayjs[] = Array(firstDay).fill(null)
        const currentMonthDays: Dayjs[] = Array.from({ length: daysInMonth }, (_, i) => dayjs(currentMonth).date(i + 1));
        const calendarGrid: Dayjs[] = [...emptyDaysBefore, ...currentMonthDays]
        const weekgrid: Dayjs[][] = []
        const chunkSize = 7
        for (let i = 0; i < calendarGrid.length; i += chunkSize)
            weekgrid.push(calendarGrid.slice(i, i + chunkSize))
        return weekgrid
    }, [selectedDate])

    const handlePreviousMonth = () => {
        const newDate = selectedDate || dayjs()
        setSelectedDate(newDate.clone().subtract(1, 'month'));
    }

    const handleNextMonth = () => {
        const newDate = selectedDate || dayjs()
        setSelectedDate(newDate.clone().add(1, 'month'));
    }

    const isBetween = (checkDate: Dayjs, startDate: Dayjs | null, endDate: Dayjs | null) => checkDate.isSame(startDate, 'days') || checkDate.isSame(endDate, 'days') || checkDate.isAfter(startDate, 'days') && checkDate.isBefore(endDate, 'days')

    const DateTemplate = ({ date }: { date: Dayjs }) => {

        if (!date) return <td className=''></td>

        const events = eventData.data?.filter((event) => {
            const startDate = dayjs(event.start?.date ?? event.start?.dateTime, 'YYYY-MM-DD')
            const endDate = dayjs(event.end?.date ?? event.end?.dateTime, 'YYYY-MM-DD')
            return isBetween(date, startDate, endDate)
        })

        return (
            <td>
                <p className={`text-base md:text-xl`}>{date.date()}</p>
                {events?.length != 0 && <EventDialog events={events ?? []} />}
            </td>
        )
    }

    return (
        <div className="flex flex-col gap-4 p-2 text-gray-900">
            <div className="flex justify-between items-center gap-4">
                <Button onClick={handlePreviousMonth}>Prev</Button>
                <p className="text-2xl font-bold text-gray-900">{selectedDate ? selectedDate.format('MMMM YYYY') : dayjs().format('MMMM YYYY')}</p>
                <Button onClick={handleNextMonth}>Next</Button>
            </div>
            <table className='rounded-md font-bold w-full h-fit [&_tr]:border-2 [&_tr]:border-gray-900 [&_td]:border-2 [&_td]:border-gray-900 [&_td]:w-[5rem] md:[&_td]:w-[10rem] [&_td]:h-[5rem] md:[&_td]:h-[10rem] overflow-x-scroll' >
                <thead className="border-2">
                    <tr className='text-sm md:text-xl [&_th]:p-2'>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentMonth?.map((data: Dayjs[], index: number) => (
                            <tr key={index} className='text-center hover:cursor-pointer'>
                                {
                                    data.map((date: Dayjs, index: number) => (
                                        <DateTemplate key={index} date={date} />
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}