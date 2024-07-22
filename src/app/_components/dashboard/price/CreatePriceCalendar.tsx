"use client";
import { useCallback, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import Loading from "~/app/loading";
import { api } from "~/trpc/react";
import isBetween from "dayjs/plugin/isBetween";
import { cn } from "~/lib/utils";
import { useHotelAdmin } from "~/utils/store";
import { CreatePriceForm } from "~/app/_components/dashboard/price/CreatePriceDialog";
import { ShadcnButton } from "~/app/_components/general/shadcn-button";

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

  const handleDateClick = (date: Dayjs, roomId: string) => {
    if (dateRange.roomId !== roomId)
      setDateRange({ roomId: roomId, startDate: date, endDate: date });
    else if (dateRange.startDate === null)
      setDateRange({ ...dateRange, startDate: date, endDate: date });
    else if (!date.isBefore(dateRange.startDate, "day")) {
      setPriceDialog(true);
      setDateRange({ ...dateRange, endDate: date });
    } else setDateRange({ roomId: "none", startDate: null, endDate: null });
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
    className,
  }: {
    date: Dayjs;
    roomId: string;
    className?: string;
  }) => {
    const isSelected = isInRange(date, roomId);
    const getPrice = (date: Dayjs, roomId: string): number => {
      const roomPrices = priceData.data?.get(roomId);
      if (!roomPrices) return 0;
      
      const dateString = date.format('YYYY-MM-DD');
      const priceEntry = roomPrices.find(entry => entry.date === dateString);
      return priceEntry ? priceEntry.price : 0;
    };
  
    const price = getPrice(date, roomId);
  

    return (
      <td
        className={cn(
          "flex flex-col items-center justify-center border-[1px] text-center text-xs hover:cursor-pointer sm:text-sm",
          isSelected && "bg-blue-600 text-white",
          className,
        )}
        onClick={() => handleDateClick(date, roomId)}
      >
        <span>{date.date()}</span>
        <span>{price ?? 0} €</span>
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
          <ShadcnButton type="button" title="Prev" onClick={handlePreviousMonth} />
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
        <CreatePriceForm onSuccess={refetchData} />
      </div>
    </>
  );
};
