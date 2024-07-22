/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-base-to-string */
'use client'

import { type FieldValues, useForm } from "react-hook-form"
import { api } from "~/trpc/react"

import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ReloadIcon, RocketIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";


type FormProps = {
    hotelName: string
    location: string
    manager: string
    island: string
}

export const EditHotelForm = ({ hotelId }: { hotelId: string }) => {


    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormProps>()
    const hotelData = api.hotel.getHotelById.useQuery({ hotelId: hotelId })
    const editHotel = api.hotel.updateHotelInfoById.useMutation({
        onSuccess: async () => {
            reset()
            await hotelData.refetch()
        },
    })

    useEffect(() => {
        const info = hotelData.data
        if (info) {
            setValue('hotelName', info.hotelName)
            setValue('island', info.island)
            setValue('location', info.location)
            setValue('manager', info.manager)
        }
    }, [hotelData.data, setValue])

    const formSubmitted = (data: FieldValues) => {
        editHotel.mutate({ hotelName: data.hotelName, location: data.location, manager: data.manager, island: data.island, hotelId: hotelId })
    }

    return (
        <form onSubmit={handleSubmit(formSubmitted)} className="flex flex-col gap-2 [&_label]:text-white [&_label]:font-bold">
            {
                editHotel.isSuccess &&
                <Alert>
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Sucess!</AlertTitle>
                    <AlertDescription>
                        Hotel added successfully.
                    </AlertDescription>
                </Alert>
            }
            {
                editHotel.isError &&
                <Alert variant={'destructive'}>
                    <RocketIcon className="h-4 w-4" />
                    <AlertTitle>Oop!</AlertTitle>
                    <AlertDescription>
                        Something went wrong.
                    </AlertDescription>
                </Alert>
            }
            <div className="flex flex-col gap-1">
                <Label htmlFor="hotelName" className="text-right">Hotel Name</Label>
                <Input id="hotelName" className="col-span-3" {...register('hotelName', { required: "Field is required." })} placeholder="Enter hotel name" />
                {errors.hotelName?.message && (
                    <small className="text-red-600">{errors.hotelName.message}</small>
                )}
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" className="col-span-3" {...register('location', { required: "Field is required." })} placeholder="Enter location name" />
                {errors.location?.message && (<small className="text-red-600">{errors.location.message}</small>)}
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="manager" className="text-right">Location</Label>
                <Input id="manager" className="col-span-3" {...register('manager', { required: "Field is required." })} placeholder="Enter manager name" />
                {errors.manager?.message && (<small className="text-red-600">{errors.manager.message}</small>)}
            </div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="island" className="text-right">Location</Label>
                <Input id="island" className="col-span-3" {...register('island', { required: "Field is required." })} placeholder="Enter island name" />
                {errors.island?.message && (<small className="text-red-600">{errors.island.message}</small>)}
            </div>
            <div className="flex item-center justify-center">
                <Button type="submit" disabled={editHotel.isLoading}>
                    {
                        editHotel.isLoading ? <> <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Please wait</> : 'Add hotel'
                    }
                </Button>
            </div>
        </form>
    )
}
