import { createTRPCRouter } from "~/server/api/trpc";
import { SellerRouter } from "./routers/registration";
import { HotelRouter } from "./routers/hotel";
import { RoomRouter } from "./routers/room";
import { PriceRouter } from "./routers/price";
import { BookingRouter } from "./routers/booking";
import { PayPalRouter } from "./routers/paypal";
import { CalendarRouter } from "./routers/calendar";
import { MyRentRouter } from "./routers/myrent";
import { DiscountRouter } from "./routers/discount";

export const appRouter = createTRPCRouter({
  registration: SellerRouter,
  hotel: HotelRouter,
  room: RoomRouter,
  price: PriceRouter,
  booking: BookingRouter,
  paypal: PayPalRouter,
  calendar: CalendarRouter,
  myrent: MyRentRouter,
  discount:DiscountRouter
})

export type AppRouter = typeof appRouter;
