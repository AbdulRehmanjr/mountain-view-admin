import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";
import axios, { AxiosError } from "axios";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";

type Room = {
    roomId: string
    roomName: string
    code: string
    quantity: number
    hotel: {
        hotelName: string;
        hotelId: string;
        code: string
    };
}

export const PriceRouter = createTRPCRouter({

    getPriceById: protectedProcedure.input(z.object({ priceId: z.string() }))
        .query(async ({ ctx, input }): Promise<PriceProps | null> => {
            try {
                const prices: PriceProps | null = await ctx.db.roomPrice.findUnique({
                    where: { priceId: input.priceId },
                })
                return prices
            } catch (error) {
                if (error instanceof TRPCClientError)
                    console.log(error.message)
                throw error
            }
        }),

    getAllPrices: protectedProcedure.query(async ({ ctx }): Promise<GroupedRatePriceProps[]> => {
        try {
            const hotels = await ctx.db.hotel.findMany({ where: { sellerInfoSellerId: ctx.session.user.sellerId } });
            const roomsList: Room[] = [];

            for (const hotel of hotels) {
                const rooms = await ctx.db.room.findMany({
                    where: { hotelHotelId: hotel.hotelId },
                    select: {
                        roomId: true,
                        roomName: true,
                        code: true,
                        quantity: true,
                        hotel: {
                            select: {
                                hotelId: true,
                                hotelName: true,
                                code: true,
                            }
                        }
                    }
                });
                roomsList.push(...rooms);
            }

            const roomRatePlans: RatePriceProps[] = await ctx.db.roomRatePlan.findMany({
                where: {
                    roomId: {
                        in: roomsList.map((room) => room.roomId)
                    }
                },
                include: {
                    rate: {
                        select: {
                            ratePlanId: true,
                            name: true,
                            code: true,
                        }
                    },
                    room: {
                        select: {
                            roomId: true,
                            roomName: true,
                            quantity: true
                        }
                    },
                    RoomPrice: {
                        select: {
                            startDate: true,
                            endDate: true,
                            planCode: true,
                            price: true,
                        }

                    }
                }
            })

            const groupedByRoom: Record<string, GroupedRatePriceProps> = {};
            roomRatePlans.forEach(item => {
                const roomId = item.roomId;
                if (!groupedByRoom[roomId]) {
                    groupedByRoom[roomId] = {
                        roomId: item.room.roomId,
                        roomName: item.room.roomName,
                        quantity: item.room.quantity,
                        rates: []
                    };
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { room, ...itemWithoutRoom } = item;
                groupedByRoom[roomId]!.rates.push(itemWithoutRoom);
            });
            const data = Object.values(groupedByRoom);
            return data
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

    createPrice: protectedProcedure
        .input(z.object({
            startDate: z.string(),
            endDate: z.string(),
            roomId: z.string(),
            ratePlan: z.string(),
            rateId: z.string(),
            price: z.number(),
            hotelId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {

            try {
                const hotel = await ctx.db.hotel.findUnique({ where: { hotelId: input.hotelId } })
                const roomDetails = await ctx.db.room.findUnique({ where: { roomId: input.roomId } });

                if (!hotel || !roomDetails) throw new TRPCError({ code: "NOT_FOUND", message: "Data not found" })

                const data = {
                    "hotelid": hotel.code,
                    "room": [{
                        "roomid": roomDetails.code,
                        "date": [{
                            "from": input.startDate,
                            "to": input.endDate,
                            "rate": [{
                                "rateplanid": input.ratePlan
                            }],
                            "roomstosell": roomDetails.quantity,
                            "price": [{
                                "NumberOfGuests": roomDetails.capacity,
                                "value": input.price
                            },
                            ],
                            "closed": "0",
                            "minimumstay": "1",
                            "maximumstay": "14",
                            "closedonarrival": "0",
                            "closedondeparture": "0"
                        }]
                    }]
                }

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${env.API_KEY}`,
                    'app-id': `${env.APP_ID}`
                }

                await axios.post(`https://connect.su-api.com/SUAPI/jservice/availability`, data, { headers })

                const roomRatePlan = await ctx.db.roomRatePlan.findFirst({
                    where: {
                        roomId: input.roomId,
                        rateId: input.rateId,
                    }
                })

                const overlappingRecords = await ctx.db.roomPrice.findMany({
                    where: {
                        OR: [
                            {
                                startDate: { lte: input.endDate },
                                endDate: { gte: input.startDate }
                            }
                        ]
                    }
                });
                let found = false
                let priceId = ''
                for (const overlappingRecord of overlappingRecords) {
                    if (overlappingRecord.startDate === input.startDate && overlappingRecord.endDate === input.endDate) {
                        found = true
                        priceId = overlappingRecord.priceId
                    }
                }

                if (found)
                    await ctx.db.roomPrice.update({
                        where: { priceId: priceId },
                        data: {
                            price: input.price,
                        }
                    });
                else
                    await ctx.db.roomPrice.create({
                        data: {
                            rrpId: roomRatePlan?.rrpId ?? 'none',
                            startDate: input.startDate,
                            endDate: input.endDate,
                            planCode: input.ratePlan,
                            price: input.price,
                        }
                    });


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

    deletePriceById: protectedProcedure
        .input(z.object({
            priceId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.roomPrice.delete({
                    where: {
                        priceId: input.priceId
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                console.error(error)
                throw new Error("Something went wrong.")
            }
        }),

    deletePricesByIds: protectedProcedure
        .input(z.object({ priceIds: z.string().array() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.roomPrice.deleteMany({
                    where: {
                        priceId: {
                            in: input.priceIds
                        }
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                console.error(error)
                throw new Error("Something went wrong.")
            }
        }),

    blockRoomByDate: protectedProcedure
        .input(z.object({ startDate: z.string(), endDate: z.string(), roomId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const existingDates = await ctx.db.blockDate.findMany({
                    where: {
                        roomRoomId: input.roomId,
                        OR: [
                            // New range starts during an existing block
                            {
                                startDate: { lte: input.startDate },
                                endDate: { gte: input.startDate }
                            },
                            // New range ends during an existing block
                            {
                                startDate: { lte: input.endDate },
                                endDate: { gte: input.endDate }
                            },
                            // New range completely encompasses an existing block
                            {
                                startDate: { gte: input.startDate },
                                endDate: { lte: input.endDate }
                            }
                        ]
                    }
                })

                for (const date of existingDates) {
                    if (date.startDate < input.startDate && date.endDate > input.endDate) {
                        // The existing block completely covers the new range, split it
                        await ctx.db.blockDate.update({
                            where: { blockId: date.blockId },
                            data: { endDate: input.startDate }
                        })
                        await ctx.db.blockDate.create({
                            data: {
                                startDate: input.endDate,
                                endDate: date.endDate,
                                roomRoomId: input.roomId
                            }
                        })
                    } else if (date.startDate < input.startDate) {
                        // The existing block starts before the new range, cut its end
                        await ctx.db.blockDate.update({
                            where: { blockId: date.blockId },
                            data: { endDate: input.startDate }
                        })
                    } else if (date.endDate > input.endDate) {
                        // The existing block ends after the new range, cut its start
                        await ctx.db.blockDate.update({
                            where: { blockId: date.blockId },
                            data: { startDate: input.endDate }
                        })
                    } else {
                        // The existing block is completely within the new range, remove it
                        await ctx.db.blockDate.delete({
                            where: { blockId: date.blockId }
                        })
                    }
                }

                if (existingDates.length === 0) {
                    await ctx.db.blockDate.create({
                        data: {
                            startDate: input.startDate,
                            endDate: input.endDate,
                            roomRoomId: input.roomId
                        }
                    })
                }

            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                else if (error instanceof AxiosError) {
                    console.error(error.response?.data)
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    throw new Error(error.response?.data ?? 'Axios Error')
                }
                console.error(error)
                throw new Error("Something went wrong.")
            }
        }),

    getBlockDates: protectedProcedure
        .query(async ({ ctx }) => {
            try {

                const blockDates = await ctx.db.blockDate.findMany()
                const dateMap = new Map<string, { startDate: string, endDate: string }[]>();

                blockDates.forEach((date: {
                    blockId: string;
                    roomRoomId: string;
                    startDate: string;
                    endDate: string;
                }) => {
                    const roomId = date.roomRoomId;
                    if (!dateMap.has(roomId)) {
                        dateMap.set(roomId, []);
                    }
                    dateMap.get(roomId)!.push({ startDate: date.startDate, endDate: date.endDate });
                });
                return dateMap;
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                console.error(error)
                throw new Error("Something went wrong.")
            }
        }),
})
