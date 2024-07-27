import { BookingForm } from "~/app/_components/dashboard/booking/CreateBooking";

export default function DashboardPage() {

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-primary md:text-2xl">Manual Booking</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-10"
      >
        <BookingForm />
      </div>
    </>
  );
}
