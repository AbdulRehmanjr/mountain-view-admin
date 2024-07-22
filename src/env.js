import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
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
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
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
  },
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
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
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
