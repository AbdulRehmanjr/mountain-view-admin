import { HotelTable } from "~/app/_components/dashboard/hotel/HotelTable";

export default function HotelPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-primary md:text-2xl">
          Hotel Details
        </h1>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <HotelTable />
      </div>
    </>
  );
}
