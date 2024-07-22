'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"

import { type calendar_v3 } from 'googleapis/build/src/apis/calendar/v3'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'


type EventInfo = {
    name: string
    phone: string
    email: string
    country: string
    city: string
    postalcode: string
    address: string
    arrivalTime: string
    adults: number
    children: number
    kids: number
    price: string
    startDate: string
    endDate: string
}
export const EventDialog = ({ events }: { events: calendar_v3.Schema$Event[] }) => {

    const [datas, setData] = useState<EventInfo[]>([])

    useEffect(() => {
        const parsedData = events.map((event) => {
            const dataObject: Record<string, string> = {}
            const dataLines = event.description?.split('\n') ?? []

            dataLines.forEach((line) => {
                if (line.trim() === '') return

                const [key, value] = line.split(':')
                if (key && value) {
                    dataObject[key.trim()] = value.trim()
                }
            })

            return {
                name: dataObject.Name ?? '',
                phone: dataObject.Phone ?? '',
                email: dataObject.Email ?? '',
                country: dataObject.Country ?? '',
                city: dataObject.City ?? '',
                postalcode: dataObject['Postal Code'] ?? '',
                address: dataObject['Street Address'] ?? '',
                arrivalTime: dataObject['Arrival Time'] ?? '',
                adults: dataObject['Number of Adults'] ? +dataObject['Number of Adults'] : 0,
                children: dataObject['Number of Children'] ? +dataObject['Number of Children'] : 0,
                kids: dataObject['Number of kids'] ? +dataObject['Number of kids'] : 0,
                price: dataObject.Price ?? '',
                startDate: dataObject['Start Date'] ?? '',
                endDate: dataObject['End Date'] ?? '',
            }
        })

        setData(parsedData)
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button >{events.length} events</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw]">
                <DialogHeader>
                    <DialogTitle>MyRent Information</DialogTitle>
                    <DialogDescription>
                        Information regarding myrent for integration.
                    </DialogDescription>
                </DialogHeader>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Start date</TableHead>
                            <TableHead>End date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Postalcode</TableHead>
                            <TableHead className="w-[px]">Address</TableHead>
                            <TableHead>Adults</TableHead>
                            <TableHead>Children</TableHead>
                            <TableHead>Kids</TableHead>
                            <TableHead>Price (€)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            datas.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.startDate}</TableCell>
                                    <TableCell>{data.endDate}</TableCell>
                                    <TableCell>{data.name}</TableCell>
                                    <TableCell>{data.phone}</TableCell>
                                    <TableCell>{data.email}</TableCell>
                                    <TableCell>{data.country}</TableCell>
                                    <TableCell>{data.city}</TableCell>
                                    <TableCell>{data.postalcode}</TableCell>
                                    <TableCell>{data.address}</TableCell>
                                    <TableCell>{data.adults}</TableCell>
                                    <TableCell>{data.children}</TableCell>
                                    <TableCell>{data.kids}</TableCell>
                                    <TableCell>{data.price}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>

            </DialogContent>
        </Dialog>
    )
}