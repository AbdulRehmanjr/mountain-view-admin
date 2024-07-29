import { getAuthAssertionValue } from "~/utils";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCClientError } from "@trpc/client";
import { AxiosError } from "axios";
import { z } from "zod";
import { env } from "~/env";



export const BookingRouter = createTRPCRouter({

    getAllBookings: protectedProcedure.query(async ({ ctx }) => {
        try {
            const bookings = await ctx.db.roomBooking.findMany({
                select: {
                    roomRoomId: true,
                    type: true,
                    startDate:true,
                    endDate:true
                }
            })
            return bookings
        } catch (error) {
            if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new Error(error.message)
            }
            console.error(error)
            throw new Error("Something went wrong")
        }
    }),

    getAllBookingsDetail: protectedProcedure.query(async ({ ctx }) => {
        try {
            const bookings = await ctx.db.roomBooking.findMany({
                include: {
                    Room: true,
                    bookingDetails: true
                }
            })
            return bookings
        } catch (error) {
            if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new Error(error.message)
            }
            console.error(error)
            throw new Error("Something went wrong")
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
                        streetName: input.streetName,
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
                    throw new Error(error.message)
                }
                console.error(error)
                throw new Error("Error")
            }
        }),

    makeRefund: protectedProcedure.input(z.object({ captureId: z.string(), paymentId: z.string() }))
        .mutation(async ({ ctx, input }) => {

            try {
                const BN_CODE = env.BN_CODE
                const clientId = env.PAYPAL_CLIENT

                const sellerInfo = await ctx.db.sellerPayPal.findUnique({
                    where: {
                        email: 'abdulrehman2020white@gmail.com'
                    }
                })

                if (!sellerInfo) throw new TRPCClientError("Seller not found")
                const authAssertion = getAuthAssertionValue(clientId, sellerInfo.merchantId);
                const paypalApiUrl = `${env.PAYPAL_API}/v2/payments/captures/${input.paymentId}/refund`;
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ctx.session?.user.paypal_token}`,
                    'PayPal-Auth-Assertion': authAssertion,
                    'Paypal-Partner-Attribution-Id': BN_CODE
                };
                // axios.post(paypalApiUrl, {}, { headers })
                //     .then(async (_response: AxiosResponse) => {
                //         await ctx.db.payPalBoookingInfo.update({
                //             where: {
                //                 captureId: input.captureId
                //             },
                //             data: {
                //                 : true
                //             }
                //         })
                //     })
                //     .catch((error: AxiosError) => console.log(error.response?.data))
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                else if (error instanceof AxiosError) {
                    console.log(error.message)
                    throw new Error(error.message)
                }
            }

        }),


})