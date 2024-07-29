/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCClientError } from "@trpc/client";
import { redeemCode } from "~/utils";
import { TRPCError } from "@trpc/server";



export const DiscountRouter = createTRPCRouter({

    getAllDiscounts: protectedProcedure.query(async ({ ctx }) => {
        try {
            const discounts: DiscountProps[] = await ctx.db.discounts.findMany()
            return discounts
        } catch (error) {
            if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new Error(error.message)
            }
            console.error(error)
            throw new Error("Something went wrong")
        }
    }),
    getDiscountById: protectedProcedure.input(z.object({ discountId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const discount: DiscountProps = await ctx.db.discounts.findUniqueOrThrow({
                    where: { discountId: input.discountId }
                })
                return discount
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                console.error(error)
                throw new Error("Something went wrong")
            }
        }),
    createDiscount: protectedProcedure
        .input(z.object({ title: z.string(), discount: z.number(), startDate: z.string(), endDate: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const code = redeemCode(8)
                await ctx.db.discounts.create({
                    data: {
                        title: input.title,
                        discount: input.discount,
                        redeemCode: code,
                        startDate: input.startDate,
                        endDate: input.endDate
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                console.error(error)
                throw new Error("Something went wrong")
            }
        }),
    updateDiscount: protectedProcedure
        .input(z.object({ discountId: z.string(), title: z.string(), discount: z.number(), startDate: z.string(), endDate: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.discounts.update({
                    where: { discountId: input.discountId },
                    data: { title: input.title, discount: input.discount, startDate: input.startDate, endDate: input.endDate }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                console.error(error)
                throw new Error("Something went wrong")
            }
        }),

    deleteDiscountByIds: protectedProcedure.input(z.object({ discountIds: z.string().array() }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.discounts.deleteMany({ where: { discountId: { in: input.discountIds } } })
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
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Something went wrong'
                })
            }
        }),
})