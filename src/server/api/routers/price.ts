import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";
import dayjs from "dayjs";
import axios, { AxiosError } from "axios";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";

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

    getAllPrices: protectedProcedure
        .query(async ({ ctx }): Promise<Map<string, {
            date: string;
            price: number;
            Inc: number
        }[]>> => {
            try {
                const prices: PriceProps[] = await ctx.db.roomPrice.findMany();
                const priceMap = new Map<string, { date: string, price: number, Inc: number }[]>();

                prices.forEach((price) => {
                    if (!priceMap.has(price.roomId))
                        priceMap.set(price.roomId, []);
                    const datesInRange = getDateList(price.startDate, price.endDate)
                    datesInRange.forEach(date => {
                        const existingEntry = priceMap.get(price.roomId)!.find(entry => entry.date === date);
                        if (!existingEntry)
                            priceMap.get(price.roomId)!.push({ date: date, price: price.price, Inc: price.percentInc });
                        else
                            existingEntry.price = price.price;
                    });
                });

                return priceMap
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

    createPrice: protectedProcedure
        .input(z.object({
            startDate: z.string(),
            endDate: z.string(),
            roomId: z.string(),
            percentInc: z.number(),
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
                                "rateplanid": "BAR"
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

                await axios.post(`https://connect.su-api.com/SUAPI/jservice/OTA_HotelRoom`, data, { headers })


                const overlappingRecords = await ctx.db.roomPrice.findMany({
                    where: {
                        roomId: input.roomId,
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
                            percentInc: input.percentInc,
                            price: input.price,
                        }
                    });
                else
                    await ctx.db.roomPrice.create({
                        data: {
                            startDate: input.startDate,
                            endDate: input.endDate,
                            roomId: input.roomId,
                            roomType: roomDetails?.roomType ?? 'none',
                            percentInc: input.percentInc,
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

function getDateList(startDate: string, endDate: string, format = 'YYYY-MM-DD'): string[] {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const dateList: string[] = [];

    let currentDate = start;

    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
        dateList.push(currentDate.format(format));
        currentDate = currentDate.add(1, 'day');
    }

    return dateList;
}