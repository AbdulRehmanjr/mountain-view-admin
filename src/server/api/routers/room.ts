import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";

export const RoomRouter = createTRPCRouter({

    createRoom: protectedProcedure
        .input(z.object({
            roomName: z.string(),
            description: z.string(),
            beds: z.number(),
            capacity: z.number(),
            area: z.number(),
            roomType: z.string(),
            features: z.string().array(),
            images: z.string().array(),
            hotelId: z.string(),
            quantity: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.room.create({
                    data: {
                        roomName: input.roomName,
                        description: input.description,
                        area: input.area,
                        beds: input.beds,
                        capacity: input.capacity,
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
                    throw new Error(error.message)
                }
                throw new Error("Error")
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
                const roomsList: RoomDetailProps[] = []
                for (const hotel of hotels) {
                    const rooms = await ctx.db.room.findMany({
                        where: { hotelHotelId: hotel.hotelId },
                        include: { hotel: true }
                    })
                    if (rooms.length != 0)
                        for (const room of rooms)
                            roomsList.push(room)
                }
                return roomsList
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                throw new Error("Error")
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

