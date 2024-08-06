import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";
import dayjs from "dayjs";
import axios, { AxiosError } from "axios";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";




type RoomPrice = {
    priceId: string;
    startDate: string;
    endDate: string;
    roomId: string;
    planCode: string;
    price: number;
};

type Room = {
    roomId: string;
    roomName: string;
    hotel: {
        hotelId: string;
        hotelName: string;
    };
};

type RatePlan = {
    code: string;
    name: string;
    hotelHotelId: string;
};

type ResultEntry = {
    roomId: string;
    roomName: string;
    hotelName: string;
    hotelId: string;
    ratePlans: {
        planCode: string;
        planName: string;
        prices: {
            date: string;
            price: number;
        }[];
    }[];
};

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

    getAllPrices: protectedProcedure.query(async ({ ctx }) => {
        try {
            const hotels = await ctx.db.hotel.findMany({ where: { sellerInfoSellerId: ctx.session.user.sellerId } })
            const roomsList = []
            for (const hotel of hotels) {
                const rooms = await ctx.db.room.findMany({
                    where: { hotelHotelId: hotel.hotelId },
                    include: {
                        hotel: {
                            select: {
                                hotelId: true,
                                hotelName: true,
                            }
                        }
                    }
                })
                if (rooms.length != 0)
                    for (const room of rooms)
                        roomsList.push(room)
            }
            // Fetch room prices
            const prices = await ctx.db.roomPrice.findMany();

            // Fetch all rooms with their hotel information
            const rooms = await ctx.db.room.findMany({
                where: {},
                include: {
                    hotel: {
                        select: {
                            hotelId: true,
                            hotelName: true,
                        },
                    },
                },
            });

            // Create a map for quick room lookups
            const roomMap = new Map<string, Room>(rooms.map(room => [room.roomId, room]));

            // Create a set of unique hotel IDs
            const hotelIds = new Set<string>(rooms.map(room => room.hotel.hotelId));

            // Fetch rate plans for all relevant hotels
            const ratePlans: RatePlan[] = await ctx.db.ratePlan.findMany({
                where: {
                    hotelHotelId: {
                        in: Array.from(hotelIds),
                    },
                },
            });

            // Create a map for quick rate plan lookups, grouped by hotel
            const ratePlanMap = new Map<string, Map<string, RatePlan>>();
            ratePlans.forEach(plan => {
                if (!ratePlanMap.has(plan.hotelHotelId)) {
                    ratePlanMap.set(plan.hotelHotelId, new Map());
                }
                ratePlanMap.get(plan.hotelHotelId)!.set(plan.code, plan);
            });

            const result: ResultEntry[] = [];

            prices.forEach((price) => {
                const room = roomMap.get(price.roomId);
                if (!room) {
                    console.warn(`Room not found for roomId: ${price.roomId}`);
                    return; // Skip this price entry if room not found
                }

                let roomEntry = result.find((entry) => entry.roomId === price.roomId);

                if (!roomEntry) {
                    roomEntry = {
                        roomId: price.roomId,
                        roomName: room.roomName,
                        hotelName: room.hotel.hotelName,
                        hotelId: room.hotel.hotelId,
                        ratePlans: [],
                    };
                    result.push(roomEntry);
                }

                let ratePlanEntry = roomEntry.ratePlans.find(
                    (plan) => plan.planCode === price.planCode
                );

                if (!ratePlanEntry) {
                    const hotelRatePlans = ratePlanMap.get(room.hotel.hotelId);
                    const ratePlan = hotelRatePlans ? hotelRatePlans.get(price.planCode) : undefined;
                    ratePlanEntry = {
                        planCode: price.planCode,
                        planName: ratePlan ? ratePlan.name : "Unknown Plan",
                        prices: [],
                    };
                    roomEntry.ratePlans.push(ratePlanEntry);
                }

                const datesInRange = getDateList(price.startDate, price.endDate);
                datesInRange.forEach((date) => {
                    const existingPrice = ratePlanEntry.prices.find(
                        (p) => p.date === date
                    );
                    if (existingPrice) {
                        existingPrice.price = price.price;
                    } else {
                        ratePlanEntry.prices.push({ date, price: price.price });
                    }
                });
            });

            console.log(result)
            return result;
        } catch (error) {
            console.error("Error in getAllPrices:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred",
            });
        }
    }),

    createPrice: protectedProcedure
        .input(z.object({
            startDate: z.string(),
            endDate: z.string(),
            roomId: z.string(),
            ratePlan: z.string(),
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

                await ctx.db.roomPrice.create({
                    data: {
                        startDate: input.startDate,
                        endDate: input.endDate,
                        roomId: input.roomId,
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