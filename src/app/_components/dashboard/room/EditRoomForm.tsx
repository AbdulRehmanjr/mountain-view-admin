'use client'

import { useForm } from "react-hook-form"
import { api } from "~/trpc/react"
import { useEffect, useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "~/components/ui/use-toast";
import { MultiSelect } from "react-multi-select-component";
import Image from 'next/image'
import { Check, Trash } from "lucide-react";


type FeatureProps = {
    label: string
    value: string
}

type FormProps = {
    roomName: string
    price: number
    hotel: string
    beds: string
    people: string
    roomArea: string
    quantity: string
    roomType: string
    description: string
}

const features: FeatureProps[] = [
    { label: "Balcony", value: "Balcony" },
    { label: "Garden view", value: "Garden view" },
    { label: "Pool view", value: "Pool view" },
    { label: "Mountain view", value: "Mountain view" },
    { label: "Air condition", value: "Air condition" },
    { label: "Own bathroom(ensuite)", value: "Own bathroom(ensuite)" },
    { label: "Flat - screen TV", value: "Flat - screen TV" },
    { label: "Terrace", value: "Terrace" },
    { label: "Minibar", value: "Minibar" },
    { label: "Safe", value: "Safe" },
    { label: "Free Wifi", value: "Free Wifi" },
    { label: "Hairdryer", value: "Hairdryer" },
    { label: "Tea & coffee", value: "Tea & coffee" }
]

export const EditRoomForm = ({ roomId }: { roomId: string }) => {

    const toast = useToast()
    const [primary, setPrimary] = useState<string>('')
    const [images, setImages] = useState<string[]>([])
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormProps>()
    const [selected, setSelected] = useState<FeatureProps[]>([])

    const roomData = api.room.getRoomById.useQuery({ roomId: roomId })
    const hotelData = api.hotel.getAllHotelBySellerId.useQuery()

    useEffect(() => {

        const info = roomData.data
        if (info) {
            setValue('roomName', info.roomName)
            setValue('description', info.description)
            setValue('beds', info.beds+"")
            setValue('roomArea', info.area + "")
            setValue('people', info.capacity + "")
            setValue('hotel', info.hotelHotelId)
            setValue('roomType', info.roomType)
            // setValue('quantity', info.quantity + "")
            setImages(info.pictures ?? [])
            setPrimary(() => (info?.dp ?? ""))
            setSelected(() => info.features.map((feature) => ({ label: feature, value: feature })))
        }
    }, [roomData.data, setValue])

    const updateRoom = api.room.editRoom.useMutation({
        onSuccess: () => {
            toast.toast({
                title: 'Success!',
                description: 'Room added successfully.'
            })
        },
        onError: () => {
            toast.toast({
                variant: 'destructive',
                title: 'Oop!',
                description: 'Something went wrong.'
            })
        },
    })


    const removeImage = (index: number) => {
        if (roomData.data?.pictures) {
            const newImages = [...roomData.data.pictures.slice(0, index), ...roomData.data.pictures.slice(index + 1)];
            setImages(() => newImages)
            roomData.data?.pictures.splice(index, 1)
        }
    }

    const formSubmitted = (data: FormProps) => {
        updateRoom.mutate({
            roomId: roomId,
            roomName: data.roomName,
            description: data.description,
            price: data.price+"",
            beds: +data.beds,
            capacity: +data.people,
            features: selected.map((feature: FeatureProps) => feature.value),
            dp: primary,
            area: +data.roomArea,
            roomType: data.roomType,
            images: images,
            quantity: +data.quantity,
        })
    }

    return (
        <form onSubmit={handleSubmit(formSubmitted)} className="grid grid-cols-2 gap-2">
            <div className="col-span-1 flex flex-col gap-1">
                <Label htmlFor="roomName" >Hotel Name</Label>
                <Input id="roomName" className="col-span-3" {...register('roomName', { required: "Field is required." })} type="text" placeholder="Enter room name" />
                {errors.roomName?.message && (<small className="text-red-600">{errors.roomName.message}</small>)}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
                <Label htmlFor="price" >Price per day</Label>
                <Input id="price" className="col-span-3" {...register('price', { required: "Field is required." })} type="number" placeholder="Enter price" />
                {errors.price?.message && (<small className="text-red-600">{errors.price.message}</small>)}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
                <Label htmlFor="price" >Hotel Name</Label>
                <select className="border-[1px] p-[6px] rounded-md text-sm" {...register('hotel', { required: "Field is required." })} >
                    <option value="">Select the Hotel</option>
                    {hotelData.data?.map((hotel) => (
                        <option value={hotel.hotelId} key={hotel.hotelId}>{hotel.hotelName}</option>
                    ))}
                </select>
                {errors.hotel?.message && (<small className="text-red-600">{errors.hotel.message}</small>)}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
                <Label htmlFor="beds" >No. of beds</Label>
                <Input id="beds" className="col-span-3" {...register('beds', { required: "Filed is Required.", pattern: { value: /^[1-9]\d*$/, message: 'Value must be a positive integer greater than 0' } })} type="number" placeholder="Enter no. of beds" />
                {errors.beds?.message && (<small className="text-red-600">{errors.beds.message}</small>)}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
                <Label htmlFor="people" >No. of people</Label>
                <Input id="people" className="col-span-3" {...register('people', { required: "Filed is Required.", pattern: { value: /^[1-9]\d*$/, message: 'Value must be a positive integer greater than 0' } })} type="number" placeholder="Enter no. of people" />
                {errors.people?.message && (<small className="text-red-600">{errors.people.message}</small>)}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
                <Label htmlFor="roomArea" >Room Area m<sup>2</sup></Label>
                <Input id="roomArea" className="col-span-3" {...register('roomArea', { required: "Filed is Required.", pattern: { value: /^[1-9]\d*$/, message: 'Value must be a positive integer greater than 0' } })} type="number" placeholder="Enter room area" />
                {errors.roomArea?.message && (<small className="text-red-600">{errors.roomArea.message}</small>)}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
                <Label htmlFor="quantity" >Room quantity</Label>
                <Input id="quantity" className="col-span-3" {...register('quantity', { required: "Filed is Required.", pattern: { value: /^[1-9]\d*$/, message: 'Value must be a positive integer greater than 0' } })} type="number" placeholder="Enter room name" />
                {errors.quantity?.message && (<small className="text-red-600">{errors.quantity.message}</small>)}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
                <Label htmlFor="roomType" >Room Type</Label>
                <select className="border-[1px] p-[6px] rounded-md text-sm" {...register('roomType', { required: "Field is required." })} >
                    <option value="">Select the type</option>
                    <option value="deluxe" >Deluxe Room</option>
                    <option value="superior" >Superior Room</option>
                    <option value="family" >Family Room</option>
                </select>
                {errors.roomType?.message && (<small className="text-red-600">{errors.roomType.message}</small>)}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
                <Label htmlFor="features" >Room Features</Label>
                <MultiSelect
                    options={features}
                    value={selected}
                    onChange={setSelected}
                    labelledBy="Select"
                />
            </div>
            <div className="col-span-2 flex flex-col gap-1">
                <Label htmlFor="description" >Room Type</Label>
                <Textarea placeholder="Type description here." id="message-2" {...register('description', { required: "Hotel Name is Required." })} />
                {errors.description?.message && (<small className="text-red-600">{errors.description.message}</small>)}
            </div>
            <div className="col-span-2 flex flex-col gap-1 ">
                <Label  >Images</Label>
                <menu className="flex flex-wrap h-[12rem] overflow-hidden overflow-y-scroll gap-2">
                    {
                        images.length != 0 && images.map((url: string, index: number) => (
                            <li key={index} className="flex flex-col items-center gap-2 border-2  p-3">
                                <Image src={url ?? 'https://placehold.co/600x400.png'} className="aspect-square" width={100} height={100} alt="product image" priority />
                                <div className="flex gap-3">
                                    <button title="remove-image" type="button" className={`${primary == url ? "border-2 bg-green-600 text-white" : "border-2 border-green=600 text-green-600"} px-2 py-2`} onClick={() => setPrimary(() => url)}>
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button title="remove-image" type="button" className="bg-red-600 text-white px-2 py-2" onClick={() => removeImage(index)}>
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </li>
                        ))
                    }
                </menu>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
                <label htmlFor="room">Room Pictures</label>
                <CldUploadWidget
                    options={{ sources: ['local'] }}
                    uploadPreset="pam101"
                    onSuccess={(result: CloudinaryUploadWidgetResults) => {
                        const info = result.info
                        if (typeof info != 'string')
                            setImages((prev) => {
                                const flag = prev.every((image) => image != info?.secure_url)
                                if (flag)
                                    prev.push(info?.secure_url ?? "")
                                return prev

                            })
                    }}
                >
                    {({ open }) => {
                        function handleOnClick() {
                            open()
                        }
                        return (
                            <button type="button" className="bg-gray-900 text-white w-fit p-2 rounded-md" onClick={handleOnClick}>
                                Upload Image
                            </button>
                        );
                    }}
                </CldUploadWidget>
            </div>
            <div className="col-span-2 flex item-center justify-center">
                <Button type="submit" disabled={updateRoom.isLoading}>
                    {
                        updateRoom.isLoading ? <> <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Please wait</> : 'Update Room'
                    }
                </Button>
            </div>
        </form>
    )
}
