/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { api } from "~/trpc/server";
import { compare } from "bcrypt";
import { randomUUID } from "crypto";
import { type SellerInfo } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";


declare module "next-auth" {
  interface Session extends DefaultSession, User {
    user: {
      id: string
      paypal_token: string
      role: string
      sellerId: string
    } & DefaultSession["user"];
  }

  interface User {
    sellerId: string
    paypal_token: string
    role: string;
  }

}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user, token }) {
      const { email, paypal_token, role, sellerId } = token;
      return {
        ...session,
        user: {
          ...session.user,
          email: email,
          role: role,
          sellerId: sellerId,
          paypal_token: paypal_token,
        },
      };
    },
    jwt({ token, user }) {
      if (user) {
        token.paypal_token = user.paypal_token
        token.email = user.email
        token.role = user.role
        token.sellerId = user.sellerId
        return token
      }
      return token
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  secret: "POKOq/ooMmBaUcsKQfOeWkhXzwo5CTQ/vTiCARhS1vQ=",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "Abdul Rehman" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {

          if (!credentials?.email || !credentials?.password) return null;

          const userInfo: SellerInfo | null = await api.registration.sellerInfo.query({ userName: credentials.email })

          if (!userInfo)
            throw new TRPCClientError("User not found.")

          const result: boolean = await compare(credentials.password, userInfo.password)

          if (!result)
            throw new TRPCClientError("Password didn't match.");

          const paypal_token = await api.paypal.getAuthToken.query();

          if (!paypal_token)
            throw new TRPCClientError("PayPal access token creation error.");


          return {
            id: randomUUID.toString(),
            email: userInfo.userName,
            sellerId: userInfo.sellerId,
            role: "Seller",
            paypal_token: paypal_token,
          }

        } catch (error) {
          if (error instanceof TRPCClientError)
            return null
          return null
        }
      },
    }),
    // ... (other providers)
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
