"use client";

import { useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { api } from "~/trpc/react";
import isBetween from "dayjs/plugin/isBetween";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useHotelAdmin } from "~/utils/store";
import { BlockDates } from "~/app/_components/dashboard/calendar/BlockDates";
import { CalendarSkeleton } from "~/app/_components/dashboard/skeletons/CalendarSkeleton";

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
      setBlockDate({ roomId: roomId, hotelId:'none',subRateId:'none', startDate: date, endDate: date });
    else if (blockDate.startDate === null)
      setBlockDate({ ...blockDate, startDate: date, endDate: date });
    else if (!date.isBefore(blockDate.startDate, "day")) {
      setBlockDate({ ...blockDate, endDate: date });
      setBlockDialog(true);
    } else setBlockDate({ roomId: "none",hotelId:'none',subRateId:'none', startDate: null, endDate: null });
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const isBooked = isDateBooked(date, bookings.data ?? [], roomId);
    const isBlocked = isDateBlocked(date, roomId);

    return (
      <Button
        type="button"
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center border-[1px] bg-transparent p-0.5 text-center text-[10px] text-gray-950 hover:cursor-pointer hover:bg-transparent sm:text-xs",
          isSelected &&
            "bg-blue-600 text-white hover:bg-blue-600 hover:text-white",
          isBooked && "bg-yellow-200 text-gray-700 hover:bg-yellow-300",
          className,
        )}
        onClick={() => handleDateClick(date, roomId)}
        disabled={isBooked}
      >
        {date.date()}
        {(isBooked || isBlocked) && (
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
    );
  };

  if (roomData.isLoading) return <CalendarSkeleton />;

  return (
    <>
      <div className="flex h-full w-full flex-col gap-4 p-2 text-gray-900">
        <div className="flex items-center justify-between gap-4">
          <Button type="button" onClick={handlePreviousMonth}>
            Prev
          </Button>
          <p className="text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
            {selectedDate.format("MMMM YYYY")}
          </p>
          <Button type="button" onClick={handleNextMonth}>
            Next
          </Button>
        </div>
        <div className="relative flex-grow overflow-auto">
          <table className="w-full table-fixed border-collapse">
            <thead className="sticky top-0 z-20 bg-white text-[8px] sm:text-xs md:text-sm">
              <tr className="flex">
                <th className="sticky left-0 z-30 flex h-12 w-20 shrink-0 items-center justify-center border-[1px] bg-white sm:h-16 sm:w-24 md:h-20 md:w-32">
                  Rooms
                </th>
                {currentMonth.map((date, index) => (
                  <th
                    key={index}
                    className="flex h-12 w-6 shrink-0 flex-col items-center justify-center border-[1px] sm:h-16 sm:w-8 md:h-20 md:w-[2.75rem]"
                  >
                    <span>{weekdayNames[date.day()]}</span>
                    <span>{date.date()}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roomData.data?.map((room) => (
                <tr key={room.roomId} className="flex">
                  <td className="sticky left-0 z-10 flex h-12 w-20 shrink-0 flex-col items-center justify-center border-[1px] bg-white p-0.5 sm:h-16 sm:w-24 sm:p-1 md:h-20 md:w-32">
                    <span className="text-center text-[8px] sm:text-[10px] md:text-xs">
                      {room.roomName}
                    </span>
                    <span className="text-center text-[6px] sm:text-[8px] md:text-[10px]">
                      {room.hotel.hotelName}
                    </span>
                  </td>
                  {currentMonth.map((date, index) => (
                    <DateTemplate
                      date={date}
                      roomId={room.roomId}
                      key={index}
                      className="h-12 w-6 shrink-0 sm:h-16 sm:w-8 md:h-20 md:w-[2.75rem]"
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