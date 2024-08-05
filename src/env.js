import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL"
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url()
    ),
    CLOUD_NAME: z.string(),
    CLOUD_KEY: z.string(),
    CLOUD_SECERT: z.string(),
    PAYPAL_CLIENT: z.string(),
    PAYPAL_SECERT: z.string(),
    PAYPAL_ID: z.string(),
    PAYPAL_API: z.string(),
    BN_CODE: z.string(),
    ZOHO_MAIL: z.string(),
    ZOHO_PASSWORD: z.string(),
    GOOGLE_CLIENT:z.string(),
    GOOGLE_SECERT:z.string(),
    USER_GUID:z.string(),
    B2B_GUID:z.string(),
    ACCESS_KEY:z.string(),
    API_KEY:z.string(),
    APP_ID:z.string(),
    SU_USER:z.string(),
    SU_PASS:z.string(),
  },
  client: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string()
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_KEY: process.env.CLOUD_KEY,
    CLOUD_SECERT: process.env.CLOUD_SECERT,
    PAYPAL_CLIENT: process.env.PAYPAL_CLIENT,
    PAYPAL_ID: process.env.PAYPAL_ID,
    PAYPAL_API: process.env.PAYPAL_API,
    PAYPAL_SECERT: process.env.PAYPAL_SECERT,
    BN_CODE: process.env.BN_CODE,
    ZOHO_MAIL: process.env.ZOHO_MAIL,
    ZOHO_PASSWORD: process.env.ZOHO_PASSWORD,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    GOOGLE_CLIENT:process.env.GOOGLE_CLIENT,
    GOOGLE_SECERT:process.env.GOOGLE_SECERT,
    USER_GUID:process.env.USER_GUID,
    B2B_GUID:process.env.B2B_GUID,
    ACCESS_KEY:process.env.ACCESS_KEY,
    API_KEY:process.env.API_KEY,
    APP_ID:process.env.APP_ID,
    SU_USER:process.env.SU_USER,
    SU_PASS:process.env.SU_PASS,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
