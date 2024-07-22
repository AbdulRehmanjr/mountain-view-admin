"use client";
import { useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import Loading from "~/app/loading";
import { api } from "~/trpc/react";
import isBetween from "dayjs/plugin/isBetween";
import { cn } from "~/lib/utils";
import { ShadcnButton } from "~/app/_components/general/shadcn-button";
import { Button } from "~/components/ui/button";
import { useHotelAdmin } from "~/utils/store";
import { BlockDates } from "~/app/_components/dashboard/calendar/BlockDates";

dayjs.extend(isBetween);

export const BookingCalendar = () => {
  const { blockDate, setBlockDate, setBlockDialog } = useHotelAdmin();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const blockDates = api.price.getBlockDates.useQuery();
  const bookings = api.booking.getAllBookings.useQuery();
  const roomData = api.room.getAllRoomsBySellerId.useQuery();

  const currentMonth: Dayjs[] = useMemo(() => {
    const currentMonth = selectedDate.clone().startOf("month");
    const daysInMonth = currentMonth.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) =>
      currentMonth.clone().date(i + 1),
    );
  }, [selectedDate]);

  const handlePreviousMonth = () => {
    setSelectedDate((prevDate) => prevDate.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setSelectedDate((prevDate) => prevDate.clone().add(1, "month"));
  };

  const handleDateClick = (date: Dayjs, roomId: string) => {
    if (blockDate.roomId !== roomId)
      setBlockDate({ roomId: roomId, startDate: date, endDate: date });
    else if (blockDate.startDate === null)
      setBlockDate({ ...blockDate, startDate: date, endDate: date });
    else if (!date.isBefore(blockDate.startDate, "day")) {
      setBlockDate({ ...blockDate, endDate: date });
      setBlockDialog(true);
    } else setBlockDate({ roomId: "none", startDate: null, endDate: null });
  };

  const isDateBooked = (
    date: Dayjs,
    bookings: {
      type: string;
      startDate: string;
      endDate: string;
      roomRoomId: string;
    }[],
    roomId: string,
  ) => {
    return bookings.some((booking) => {
      const startDate = dayjs(booking.startDate);
      const endDate = dayjs(booking.endDate);
      return (
        booking.roomRoomId === roomId &&
        date.isBetween(startDate, endDate, "day", "[]")
      );
    });
  };

  const isInRange = (date: Dayjs, roomId: string) => {
    if (
      blockDate.roomId !== roomId ||
      !blockDate.startDate ||
      !blockDate.endDate
    )
      return false;
    return date.isBetween(blockDate.startDate, blockDate.endDate, "day", "[]");
  };

  const isDateBlocked = (date: Dayjs, roomId: string) => {
    const data = blockDates.data;

    if (data) {
      const dateMap = data.get(roomId);

      if (!dateMap) return false;

      return dateMap.some(({ startDate, endDate }) => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        return date.isBetween(start, end, "day", "[]");
      });
    }
  };

  const DateTemplate = ({
    date,
    roomId,
    className,
  }: {
    date: Dayjs;
    roomId: string;
    className?: string;
  }) => {
    const isSelected = isInRange(date, roomId);
    const isBooked = isDateBooked(date, bookings.data ?? [], roomId);

    const isBlocked = isDateBlocked(date, roomId);

    return (
      <td>
        <Button
          type="button"
          className={cn(
            "relative flex flex-col items-center justify-center border-[1px] bg-transparent text-center text-xs text-blue-700 hover:cursor-pointer hover:bg-transparent sm:text-sm",
            isSelected &&
              "bg-blue-600 text-white hover:bg-blue-600 hover:text-white",
            isBooked && "bg-yellow-200 text-gray-700 hover:bg-yellow-300",
            className,
          )}
          onClick={() => handleDateClick(date, roomId)}
          disabled={isBooked}
        >
          {date.date()}
          {isBooked && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                stroke="red"
                strokeWidth="3"
              />
              <line
                x1="100"
                y1="0"
                x2="0"
                y2="100"
                stroke="red"
                strokeWidth="3"
              />
            </svg>
          )}
          {isBlocked && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                stroke="red"
                strokeWidth="3"
              />
              <line
                x1="100"
                y1="0"
                x2="0"
                y2="100"
                stroke="red"
                strokeWidth="3"
              />
            </svg>
          )}
        </Button>
      </td>
    );
  };

  if (roomData.isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-2 text-gray-900">
        <div className="flex items-center justify-between gap-4">
          <ShadcnButton
            type="button"
            title="Prev"
            onClick={handlePreviousMonth}
          />
          <p className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
            {selectedDate.format("MMMM YYYY")}
          </p>
          <ShadcnButton type="button" title="Next" onClick={handleNextMonth} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] rounded-md border-2">
            <thead className="border-2 text-xs sm:text-sm md:text-base [&_th]:p-1 sm:[&_th]:p-2">
              <tr className="flex gap-0.5 p-2 sm:gap-1">
                <th className="flex h-16 w-24 items-center justify-center gap-4 border-[1px] text-xs sm:h-20 sm:w-32 sm:text-sm md:w-40">
                  Room details
                </th>
                {currentMonth.map((date, index) => (
                  <th
                    key={index}
                    className="flex h-16 w-8 flex-col items-center justify-center border-[1px] text-xs sm:h-20 sm:w-10 sm:text-sm md:w-12"
                  >
                    <span>{weekdayNames[date.day()]} </span>
                    <span>{date.date()} </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roomData.data?.map((room) => (
                <tr
                  key={room.roomId}
                  className="flex gap-0.5 border-[1px] p-2 sm:gap-1"
                >
                  <td className="flex h-16 w-24 flex-col items-center justify-center gap-0.5 border-r-[1px] p-1 sm:h-20 sm:w-32 sm:p-2 md:w-40">
                    <span className="text-center text-[10px] sm:text-xs">
                      {room.roomName}
                    </span>
                    <span className="text-center text-[8px] sm:text-[10px]">
                      {room.hotel.hotelName}
                    </span>
                  </td>
                  {currentMonth.map((date, index) => (
                    <DateTemplate
                      date={date}
                      roomId={room.roomId}
                      key={index}
                      className="h-16 w-8 sm:h-20 sm:w-10 md:w-12"
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="hidden">
        <BlockDates />
      </div>
    </>
  );
};
