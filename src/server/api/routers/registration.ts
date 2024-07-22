
import { hash } from "bcrypt";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import z from 'zod'
import { TRPCClientError } from "@trpc/client";
import { getServerAuthSession } from "~/server/auth";

export const SellerRouter = createTRPCRouter({

    sellerInfo: publicProcedure.input(z.object({ userName: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                const seller = await ctx.db.sellerInfo.findUnique({
                    where: { userName: input.userName }
                })
                return seller
            } catch (error) {
                return null
            }
        }),
    createSeller: publicProcedure.input(z.object({ email: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const encyrptedPassword = await hash(input.password, 10)
            try {
                await ctx.db.sellerInfo.create({
                    data: {
                        userName: input.email,
                        password: encyrptedPassword
                    }
                })
            } catch (error) {
                if (error instanceof TRPCClientError)
                    console.log(error.message)
                throw error
            }
        }),
    updatePassword: protectedProcedure.input(z.object({ updatedPassword: z.string() }))
        .mutation(async ({ ctx, input }) => {

            try {
                const session = await getServerAuthSession()
                if (!session) throw new TRPCClientError("Session not found")

                const username = session.user.email ?? ''
                const encyrptedPassword = await hash(input.updatedPassword, 10)
                await ctx.db.sellerInfo.update({
                    where: { userName: username },
                    data: { password: encyrptedPassword }
                })
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                console.error("Something went wrong")
            }
        })
})