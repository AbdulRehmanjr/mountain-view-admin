import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { AxiosError } from "axios";
import { z } from "zod";



export const BookingRouter = createTRPCRouter({

    getAllBookings: protectedProcedure.query(async ({ ctx }) => {
        try {
            const bookings = await ctx.db.roomBooking.findMany({
                select: {
                    roomRoomId: true,
                    type: true,
                    startDate: true,
                    endDate: true
                }
            })
            return bookings
        } catch (error) {
            if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new TRPCError({
                    code: 'BAD_REQUEST',
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

    getAllBookingsWithDetail: protectedProcedure.query(async ({ ctx }) => {
        try {
            const bookings: BookingDetailProps[] = await ctx.db.roomBooking.findMany({
                select: {
                    bookingId: true,
                    startDate: true,
                    endDate: true,
                    price: true,
                    isRefund: true,
                    payPalInfoId: true,
                    roomRoomId: true,
                    bookingDetailId: true,
                    bookingDetails: {
                        select: {
                            bookingDetailId: true,
                            adults: true,
                            children: true,
                            kids: true,
                            city: true,
                            country: true,
                            phone: true,
                            postalCode: true,
                            address: true,
                            fullName: true,
                            surName: true,
                            email: true,
                            arrivalTime: true
                        }
                    },
                    Room: {
                        select: {
                            roomId: true,
                            roomName: true,
                            hotelHotelId: true,
                            roomType: true,
                            hotel: {
                                select: {
                                    hotelName: true
                                }
                            }
                        }
                    },
                    PayPalBoookingInfo: {
                        select: {
                            paypalBoookingId: true,
                            paymentId: true
                        }
                    }
                }
            });
            return bookings
        } catch (error) {
            if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new TRPCError({
                    code: 'BAD_REQUEST',
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

    makeBooking: publicProcedure
        .input(z.object({
            adults: z.number(),
            children: z.number(),
            kids: z.number(),
            roomId: z.string(),
            startDate: z.string(),
            endDate: z.string(),
            price: z.number(),
            name: z.string(),
            surName: z.string(),
            email: z.string().email(),
            phone: z.string(),
            country: z.string(),
            city: z.string(),
            postalCode: z.string(),
            streetName: z.string(),
            arrivalTime: z.string(),
            type: z.string()
        }))
        .mutation(async ({ ctx, input }): Promise<string> => {
            try {

                const bookingInfo: BookingInfoProps = await ctx.db.bookingDetail.create({
                    data: {
                        adults: input.adults,
                        children: input.children,
                        kids: input.kids,
                        fullName: input.name,
                        surName: input.surName,
                        email: input.email,
                        phone: input.phone,
                        country: input.country,
                        city: input.city,
                        arrivalTime: input.arrivalTime,
                        postalCode: input.postalCode,
                        address: input.streetName,
                    }
                })
                const booking = await ctx.db.roomBooking.create({
                    data: {
                        startDate: input.startDate,
                        endDate: input.endDate,
                        price: +input.price,
                        roomRoomId: input.roomId,
                        type: input.type,
                        bookingDetailId: bookingInfo.bookingDetailId,
                        payPalInfoId: 'dsf-sad21-23123-ddf'
                    }

                })
                return booking.bookingId
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
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

    generatePdf: publicProcedure.mutation(async () => {
        try {

            const response = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            const blob = await response.blob();
            return URL.createObjectURL(blob);
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
    })

})