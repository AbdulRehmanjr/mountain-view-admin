import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Provider } from "./provider";

import { Toaster } from "~/components/ui/toaster";
import { type Metadata, type Viewport } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata : Metadata= {
  title: "PMS | Seychelles Property Management System",
  description:
    "Efficient property management system for Seychelles hotels. Streamline operations, enhance guest experiences, and optimize revenue with our comprehensive PMS solution.",
  keywords:
    "Seychelles, hotel management, PMS, property management system, hospitality, booking system, revenue management",
  authors: [{ name: "PMS" }],
  creator: "PMS",
  publisher: "PMS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
  ],
  robots: "index, follow",
  openGraph: {
    title: "PMS | Seychelles Property Management System",
    description:
      "Comprehensive PMS solution for Seychelles hotels. Optimize operations and enhance guest experiences.",
    url: "https://www.pamhoteladmin.com",
    siteName: "Pam Hotel Admin",
    images: [
      {
        url: "https://www.pamhoteladmin.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pam Hotel Admin dashboard preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pam Hotel Admin | Seychelles PMS",
    description:
      "Efficient property management system for Seychelles hotels. Optimize operations and boost revenue.",
    images: ["https://www.pamhoteladmin.com/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <Provider>{children}</Provider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
