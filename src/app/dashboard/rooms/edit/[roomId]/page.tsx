import { EditRoomForm } from "~/app/_components/dashboard/room/EditRoomForm";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";

export default function EditHotelPage({
  params,
}: {
  params: { roomId: string };
}) {
  return (
    <>
      <div className="flex flex-col justify-center gap-4">
        <Breadcrumb>
          <BreadcrumbList className="text-primary">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/rooms">Rooms</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Room</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-lg font-semibold text-primary md:text-2xl">
          Edit room
        </h1>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <EditRoomForm roomId={params.roomId} />
      </div>
    </>
  );
}
