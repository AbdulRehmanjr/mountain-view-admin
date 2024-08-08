/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "via.placeholder.com" },
      { hostname: "placehold.co" },
      { hostname: "source.unsplash.com" },
    ],
  },
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === "production" ? "/your-prefix" : "",
  webpack(config) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      type: "asset/resource",
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
};

export default config;
