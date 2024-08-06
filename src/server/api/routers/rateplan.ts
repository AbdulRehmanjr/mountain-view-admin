import { randomCode } from "~/utils";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { TRPCClientError } from "@trpc/client";


export const RatePlanRouter = createTRPCRouter({

    getRateById: protectedProcedure.
        input(z.object({ rateId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {

                const data: RatePlanProps | null = await ctx.db.ratePlan.findUnique({
                    where: { ratePlanId: input.rateId }
                })
                if (!data) throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Rate plan not found'
                })
                return data
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
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

    getRatePlanBySellerId: protectedProcedure
        .query(async ({ ctx }) => {
            try {

                const hotels = await ctx.db.hotel.findMany({ where: { sellerInfoSellerId: ctx.session.user.sellerId } })
                
                const rateList: RatePlanDetailProps[] = []
                for (const hotel of hotels) {
                    const rates: RatePlanDetailProps[] = await ctx.db.ratePlan.findMany({
                        where: { hotelHotelId: hotel.hotelId },
                        include: {
                            hotelId: {
                                select: {
                                    hotelId: true,
                                    hotelName: true,
                                    code: true,
                                    sellerInfoSellerId: true
                                }
                            }
                        }
                    })
                    if (rates.length != 0)
                        for (const rate of rates)
                            rateList.push(rate)
                }
                return rateList
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

    createRatePlan: protectedProcedure
        .input(z.object({
            rateName: z.string(),
            description: z.string(),
            hotelId: z.string(),
            mealId: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                const hotel = await ctx.db.hotel.findUnique({ where: { hotelId: input.hotelId } })
                if (!hotel) throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Hotel not found.'
                })

                const rateplanid = randomCode(4, 'RA')
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${env.API_KEY}`,
                    'app-id': `${env.APP_ID}`
                }
                const rateJson = {
                    "RatePlans": {
                        "hotelid": hotel.code,
                        "RatePlan": [{
                            "RatePlanNotifType": "New",
                            "rateplanid": rateplanid,
                            "MealPlanID": input.mealId,
                            "Description": {
                                "Name": input.rateName,
                                "Text": input.description
                            }
                        }
                        ]
                    }
                }

                await axios.post(`https://connect.su-api.com/SUAPI/jservice/OTA_HotelRatePlan`, rateJson, { headers })

                await ctx.db.ratePlan.create({
                    data: {
                        name: input.rateName,
                        description: input.description,
                        code: rateplanid,
                        mealId: +input.mealId,
                        hotelHotelId: input.hotelId,
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
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    updateRatePlan: protectedProcedure
        .input(z.object({
            rateId: z.string(),
            rateName: z.string(),
            code: z.string(),
            description: z.string(),
            hotelId: z.string(),
            mealId: z.number()
        }))
        .mutation(async ({ ctx, input }) => {
            try {

                const hotel = await ctx.db.hotel.findUnique({ where: { hotelId: input.hotelId } })
                if (!hotel) throw new TRPCError({
                    code: "NOT_FOUND",
                    message: 'Hotel not found.'
                })

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${env.API_KEY}`,
                    'app-id': `${env.APP_ID}`
                }
                const rateJson = {
                    "RatePlans": {
                        "hotelid": hotel.code,
                        "RatePlan": [{
                            "RatePlanNotifType": "Overlay",
                            "rateplanid": input.code,
                            "MealPlanID": input.mealId,
                            "Description": {
                                "Name": input.rateName,
                                "Text": input.description
                            }
                        }
                        ]
                    }
                }

                await axios.post(`https://connect.su-api.com/SUAPI/jservice/OTA_HotelRatePlan`, rateJson, { headers })

                await ctx.db.ratePlan.update({
                    where: { ratePlanId: input.rateId },
                    data: {
                        name: input.rateName,
                        description: input.description,
                        mealId: +input.mealId,
                        hotelHotelId: input.hotelId,
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
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),

    deleteRatePlan: protectedProcedure
        .input(z.object({ rateCodes: z.string().array() }))
        .mutation(async ({ ctx, input }) => {
            try {

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${env.API_KEY}`,
                    'app-id': `${env.APP_ID}`
                }

                for (const rateCode of input.rateCodes) {

                    const ratePlan = await ctx.db.ratePlan.findUnique({
                        where: { code: rateCode },
                        include: {
                            hotelId: {
                                select: {
                                    code: true
                                }
                            }
                        }
                    })

                    const rateJson = {
                        "RatePlans": {
                            "hotelid": ratePlan?.hotelId.code,
                            "RatePlan": [{
                                "RatePlanNotifType": "Delete",
                                "rateplanid": rateCode
                            }]
                        }
                    }

                    await axios.post(`https://connect.su-api.com/SUAPI/jservice/OTA_HotelRatePlan`, rateJson, { headers })
                }

                await ctx.db.ratePlan.deleteMany({
                    where: {
                        code: {
                            in: input.rateCodes
                        }
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
                }
                console.error(error)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Something went wrong"
                })
            }
        }),
})