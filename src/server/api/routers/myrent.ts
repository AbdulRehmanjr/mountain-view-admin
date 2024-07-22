import { TRPCClientError } from "@trpc/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";


export const MyRentRouter = createTRPCRouter({

    getMyRentGroups: protectedProcedure.query(async ({ ctx }) => {
        try {
            const data: MyRentGroupProps[] = await ctx.db.myRentGroup.findMany()
            return data
        } catch (error) {
            if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new Error(error.message)
            }
            console.error(error)
            throw new Error("Something went wrong!")
        }
    }),
    createMyRentGroup: protectedProcedure
        .input(z.object({groupId: z.number(),groupName: z.string(),}))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.myRentGroup.create({
                    data: {
                        groupId: input.groupId,
                        groupName: input.groupName
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                console.error(error)
                throw new Error("Something went wrong!")
            }
        }),
    updateRentGroup: protectedProcedure
        .input(z.object({
            id: z.string(),
            groupId: z.number(),
            groupName: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.myRentGroup.update({
                    where: { id: input.id },
                    data: {
                        groupId: input.groupId,
                        groupName: input.groupName
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                console.error(error)
                throw new Error("Something went wrong!")
            }
        }),
    deleteGroup: protectedProcedure
        .input(z.object({
            myRentId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                await ctx.db.myRentGroup.delete({
                    where: {
                        id: input.myRentId
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                console.error(error)
                throw new Error("Something went wrong!")
            }
        })
})