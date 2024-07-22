/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";
import { getServerAuthSession } from "~/server/auth";




export const HotelRouter = createTRPCRouter({

    createHotel: protectedProcedure
        .input(z.object({
            hotelName: z.string(),
            location: z.string(),
            island: z.string(),
            managerName: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const session = await getServerAuthSession()
            if (!session)
                throw new TRPCClientError("Action not allow to current user")
            try {
                await ctx.db.hotel.create({
                    data: {
                        hotelName: input.hotelName,
                        location: input.location,
                        manager: input.managerName,
                        island: input.island,
                        sellerInfoSellerId: session.user.sellerId
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

    getAllHotelBySellerId: protectedProcedure
        .query(async ({ ctx }) => {

            const session = await getServerAuthSession()
            if (!session)
                throw new TRPCClientError("Action not allow to current user")
            try {
                const hotels: HotelProps[] = await ctx.db.hotel.findMany({
                    where: { sellerInfoSellerId: session.user.sellerId }
                })
                return hotels
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                throw new Error("Error")
            }
        }),
    getHotelById: protectedProcedure
        .input(z.object({
            hotelId: z.string()
        }))
        .query(async ({ ctx, input }) => {
            try {
                return await ctx.db.hotel.findUnique({
                    where: {
                        hotelId: input.hotelId
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                throw new Error("Something went wrong.")
            }
        }),
    updateHotelInfoById: protectedProcedure
        .input(z.object({
            hotelId: z.string(),
            hotelName: z.string(),
            manager: z.string(),
            island: z.string(),
            location: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                return await ctx.db.hotel.update({
                    where: {
                        hotelId: input.hotelId
                    },
                    data: {
                        hotelName: input.hotelName,
                        location: input.location,
                        manager: input.manager,
                        island: input.island
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                throw new Error("Something went wrong.")
            }
        }),
    deleteHotelById: protectedProcedure
        .input(z.object({
            hotelId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                await ctx.db.hotel.delete({
                    where: {
                        hotelId: input.hotelId
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
    deleteHotelByIds: protectedProcedure.input(z.object({ hotelIds: z.string().array() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.hotel.deleteMany({ where: { hotelId: { in: input.hotelIds } } })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                throw new Error("Error")
            }
        })


})