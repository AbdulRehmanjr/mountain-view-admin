import { createTRPCRouter } from "~/server/api/trpc";
import { SellerRouter } from "./routers/registration";
import { HotelRouter } from "./routers/hotel";
import { RoomRouter } from "./routers/room";
import { PriceRouter } from "./routers/price";
import { BookingRouter } from "./routers/booking";
import { PayPalRouter } from "./routers/paypal";
import { CalendarRouter } from "./routers/calendar";
import { DiscountRouter } from "./routers/discount";
import { RatePlanRouter } from "./routers/rateplan";

export const appRouter = createTRPCRouter({
  registration: SellerRouter,
  hotel: HotelRouter,
  room: RoomRouter,
  price: PriceRouter,
  booking: BookingRouter,
  paypal: PayPalRouter,
  calendar: CalendarRouter,
  discount: DiscountRouter,
  rateplan: RatePlanRouter
})

export type AppRouter = typeof appRouter;
