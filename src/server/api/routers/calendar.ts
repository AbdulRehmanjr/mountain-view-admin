import { authClient } from "~/server/config/oauth";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { GaxiosError } from "gaxios";
import { TRPCClientError } from "@trpc/client";
import { calendar } from "~/server/config/calendar";



export const CalendarRouter = createTRPCRouter({
    googleOAuth: publicProcedure.mutation(() => {
        try {
            const scope = ['https://www.googleapis.com/auth/calendar']
            const url: string = authClient.generateAuthUrl({
                access_type: "offline",
                scope: scope
            })
            return url
        } catch (error) {
            throw new Error("Something went wrong")
        }
    }),
    getUserInfo: publicProcedure
        .input(z.object({ token: z.string() }))
        .query(async ({ ctx, input }): Promise<GoogleTokenProp | null> => {
            try {
                const response = await authClient.getToken(input.token)
                authClient.setCredentials(response.tokens)
                const googleTokens: GoogleTokenProp = {
                    cg_access_token: response.tokens.access_token ?? "",
                    cg_refresh_token: response.tokens.refresh_token ?? "",
                    cg_scope: response.tokens.scope ?? "",
                    cg_token_type: response.tokens.token_type ?? "",
                    cg_expiry_date: response.tokens.expiry_date ?? 0,
                }
                await ctx.db.googleToken.create({
                    data: { refreshToken: googleTokens.cg_refresh_token }
                })
                return googleTokens
            } catch (error) {

                if (error instanceof GaxiosError) {
                    console.log(error.response)
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    throw new Error(error.response?.data)
                } else if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new Error(error.message)
                }
                throw new Error("Something went wrong")
            }
        }),
    getEvents: protectedProcedure.query(async ({ ctx }) => {
        try {

            const googleToken = await ctx.db.googleToken.findUnique({
                where: { tokenId: 'd17514a9-3fde-4adb-8673-147dfc30b334' }
            })
            authClient.setCredentials({ refresh_token: googleToken?.refreshToken ?? '' })

            const response = await calendar.events.list({
                calendarId: 'primary'
            })
            return response.data.items
        } catch (error) {

            console.log(error)
            if (error instanceof TRPCClientError) {
                console.error(error.message)
                throw new Error(error.message)
            }
            else if (error instanceof GaxiosError) {
                console.error(error.message)
            }
            throw new Error("Something went wrong")
        }
    })
})