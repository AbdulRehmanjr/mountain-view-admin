import { EditRoomForm } from "~/app/_components/dashboard/room/EditRoomForm";

export default function EditHotelPage({
  params,
}: {
  params: { roomId: string };
}) {
  return (
    <>
      <div className="flex items-center">
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
