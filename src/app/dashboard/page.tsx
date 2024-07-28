import { BookingForm } from "~/app/_components/dashboard/booking/CreateBooking";
import {  Breadcrumb,BreadcrumbItem,  BreadcrumbLink,  BreadcrumbList,} from "~/components/ui/breadcrumb";

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-col justify-center gap-4">
        <Breadcrumb>
          <BreadcrumbList className="text-primary">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-lg font-semibold text-primary md:text-2xl">
          Manual Booking
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed py-10 shadow-sm">
        <BookingForm />
      </div>
    </>
  );
}
