import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";
import { randomCode } from "~/utils";
import { env } from "~/env";
import axios, { AxiosError } from "axios";
import { TRPCError } from "@trpc/server";

export const RoomRouter = createTRPCRouter({

    createRoom: protectedProcedure
        .input(z.object({
            roomName: z.string(),
            description: z.string(),
            beds: z.number(),
            capacity: z.number(),
            price: z.number(),
            area: z.number(),
            roomType: z.string(),
            features: z.string().array(),
            images: z.string().array(),
            hotelId: z.string(),
            quantity: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                const hotel = await ctx.db.hotel.findUnique({ where: { hotelId: input.hotelId } })
                if (!hotel) throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Hotel not found.'
                })
                const roomCode = randomCode(6, 'R')
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${env.API_KEY}`,
                    'app-id': `${env.APP_ID}`
                }
                const roomJson = {
                    "SellableProducts": {
                        "hotelid": `${hotel.code}`,
                        "SellableProduct": [
                            {
                                "InvStatusType": "Initial",
                                "GuestRoom": {
                                    "Occupancy": {
                                        "MaxOccupancy": `${input.capacity}`,
                                        "MaxChildOccupancy": `${input.capacity}`,
                                    },
                                    "Room": {
                                        "roomid": roomCode,
                                        "RoomRate": `${input.price}`,
                                        "Quantity": `${input.quantity}`,
                                        "RoomType": `${input.roomType}`,
                                        "SizeMeasurement": `${input.capacity}`,
                                        "SizeMeasurementUnit": "sqm"
                                    },
                                    "Facilities": {
                                        "Facility": input.features.map((feature) => (
                                            {
                                                "Group": "Amenities",
                                                "name": `${feature}`
                                            }
                                        ))
                                    },
                                    "Position": {
                                        "Latitude": "49.4092",
                                        "Longitude": "1.0900"
                                    },
                                    "Address": {
                                        "AddressLine": "15 Station Street",
                                        "CityName": "London",
                                        "CountryName": "GB",
                                        "PostalCode": "M16JD"
                                    },
                                    "Description": {
                                        "Text": `${input.roomName}`,
                                        "RoomDescription": `${input.description}`
                                    }
                                }
                            }
                        ]
                    }
                }

                await axios.post(`https://connect.su-api.com/SUAPI/jservice/OTA_HotelRoom`, roomJson, { headers })

                await ctx.db.room.create({
                    data: {
                        roomName: input.roomName,
                        description: input.description,
                        area: input.area,
                        beds: input.beds,
                        capacity: input.capacity,
                        price: input.price,
                        code: roomCode,
                        features: input.features,
                        pictures: input.images,
                        roomType: input.roomType,
                        quantity: input.quantity,
                        hotelHotelId: input.hotelId,
                        dp: input.images[0]
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof AxiosError) {
                    console.error(error.response?.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof TRPCError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),
    editRoom: protectedProcedure
        .input(z.object({
            roomId: z.string(),
            roomName: z.string(),
            description: z.string(),
            beds: z.number(),
            capacity: z.number(),
            features: z.string().array(),
            dp: z.string(),
            area: z.number(),
            roomType: z.string(),
            quantity: z.number(),
            images: z.string().array(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.room.update({
                    where: {
                        roomId: input.roomId
                    },
                    data: {
                        roomName: input.roomName,
                        description: input.description,
                        area: input.area,
                        beds: input.beds,
                        features: input.features,
                        dp: input.dp,
                        capacity: input.capacity,
                        roomType: input.roomType,
                        quantity: input.quantity,
                        pictures: input.images,
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                throw new Error("Error")
            }
        }),
    getRoomById: protectedProcedure
        .input(z.object({
            roomId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            try {
                return await ctx.db.room.findUnique({
                    where: {
                        roomId: input.roomId
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                throw new Error("Error")
            }
        }),

    getAllRoomsBySellerId: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const hotels = await ctx.db.hotel.findMany({ where: { sellerInfoSellerId: ctx.session.user.sellerId } })
                const roomsList : RoomTableProps[] = []
                for (const hotel of hotels) {
                    const rooms = await ctx.db.room.findMany({
                        where: { hotelHotelId: hotel.hotelId },
                        include: {
                            hotel: {
                                select: {
                                    hotelId: true,
                                    hotelName: true,
                                    phone:true,
                                    island:true,
                                    sellerInfoSellerId: true,
                                }
                            }
                        }
                    })
                    if (rooms.length != 0)
                        for (const room of rooms)
                            roomsList.push(room)
                }
                return roomsList
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof AxiosError) {
                    console.error(error.response?.data)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: error.message
                    })
                } else if (error instanceof TRPCError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: error.message
                    })
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),
        
    deleteRoomById: protectedProcedure
        .input(z.object({ roomId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {

                await ctx.db.room.delete({
                    where: {
                        roomId: input.roomId
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                throw new Error("Error")
            }
        }),

    deleteRoomsByIds: protectedProcedure.input(z.object({ roomIds: z.string().array() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.room.deleteMany({ where: { roomId: { in: input.roomIds } } })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                throw new Error("Error")
            }
        }),


})

