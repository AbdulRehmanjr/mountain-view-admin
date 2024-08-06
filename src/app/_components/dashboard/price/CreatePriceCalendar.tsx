'use client'

import React, { useCallback, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { api } from "~/trpc/react";
import isBetween from "dayjs/plugin/isBetween";
import { cn } from "~/lib/utils";
import { useHotelAdmin } from "~/utils/store";
import { CreatePriceForm } from "~/app/_components/dashboard/price/CreatePriceDialog";
import { Button } from "~/components/ui/button";
import { CalendarSkeleton } from "~/app/_components/dashboard/skeletons/CalendarSkeleton";

dayjs.extend(isBetween);

export const CreatePriceCalendar = () => {
  const { dateRange, setDateRange, setPriceDialog } = useHotelAdmin();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const priceData = api.price.getAllPrices.useQuery();
  const roomData = api.room.getAllRoomsBySellerId.useQuery();

  const currentMonth: Dayjs[] = useMemo(() => {
    const currentMonth = selectedDate.clone().startOf("month");
    const daysInMonth = currentMonth.daysInMonth();

    return Array.from({ length: daysInMonth }, (_, i) =>
      currentMonth.clone().date(i + 1),
    );
  }, [selectedDate]);

  const refetchData = useCallback(async () => {
    await priceData.refetch();
    await roomData.refetch();
  }, [priceData, roomData]);

  const handlePreviousMonth = () => {
    setSelectedDate((prevDate) => prevDate.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setSelectedDate((prevDate) => prevDate.clone().add(1, "month"));
  };

  const handleDateClick = (date: Dayjs, roomId: string,hotelId:string) => {
    if (dateRange.roomId !== roomId)
      setDateRange({ roomId: roomId,hotelId:hotelId, startDate: date, endDate: date });
    else if (dateRange.startDate === null)
      setDateRange({ ...dateRange, startDate: date, endDate: date });
    else if (!date.isBefore(dateRange.startDate, "day")) {
      setPriceDialog(true);
      setDateRange({ ...dateRange, endDate: date });
    } else setDateRange({ roomId: "none",hotelId:hotelId ,startDate: null, endDate: null });
  };

  const isInRange = (date: Dayjs, roomId: string) => {
    if (
      dateRange.roomId !== roomId ||
      !dateRange.startDate ||
      !dateRange.endDate
    )
      return false;
    return date.isBetween(dateRange.startDate, dateRange.endDate, "day", "[]");
  };

  const DateTemplate = ({
    date,
    roomId,
    hotelId,
    className,
  }: {
    date: Dayjs
    roomId: string
    hotelId:string
    className?: string
  }) => {
    const isSelected = isInRange(date, roomId);
    const getPrice = (date: Dayjs, roomId: string): number => {
      const roomPrices = priceData.data?.get(roomId);
      if (!roomPrices) return 0;

      const dateString = date.format("YYYY-MM-DD");
      const priceEntry = roomPrices.find((entry) => entry.date === dateString);
      return priceEntry ? priceEntry.price : 0;
    };

    const price = getPrice(date, roomId);

    return (
      <td
        className={cn(
          "flex flex-col items-center justify-center border-[1px] p-0.5 text-center text-[10px] hover:cursor-pointer sm:text-xs",
          isSelected && "bg-blue-600 text-white",
          className,
        )}
        onClick={() => handleDateClick(date, roomId,hotelId)}
      >
        <span>{price ?? 0} €</span>
      </td>
    );
  };

  if (roomData.isLoading) return <CalendarSkeleton />;

  return (
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
                    hotelId={room.hotelHotelId}
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
      <div className="hidden">
        <CreatePriceForm onSuccess={refetchData} />
      </div>
    </div>
  );
};