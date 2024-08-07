"use client";
import { useCallback, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { api } from "~/trpc/react";
import isBetween from "dayjs/plugin/isBetween";
import { cn } from "~/lib/utils";
import { useHotelAdmin } from "~/utils/store";
import { CreatePriceForm } from "~/app/_components/dashboard/price/CreatePriceDialog";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { SimpleLoader } from "~/app/_components/dashboard/skeletons/SimpleCalendar";

dayjs.extend(isBetween);

export const CreatePriceCalendar = () => {
  const { dateRange, setDateRange, setPriceDialog } = useHotelAdmin();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const groupedRatePlans = api.price.getAllPrices.useQuery();

  const currentMonth: Dayjs[] = useMemo(() => {
    const currentMonth = selectedDate.clone().startOf("month");
    const daysInMonth = currentMonth.daysInMonth();

    return Array.from({ length: daysInMonth }, (_, i) =>
      currentMonth.clone().date(i + 1),
    );
  }, [selectedDate]);

  const refetchData = useCallback(async () => {
    await groupedRatePlans.refetch();
  }, [groupedRatePlans]);

  const handlePreviousMonth = () => {
    setSelectedDate((prevDate) => prevDate.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setSelectedDate((prevDate) => prevDate.clone().add(1, "month"));
  };

  const handleDateClick = (
    date: Dayjs,
    roomId: string,
    subRateId: string,
    planCode: string,
    hotelId: string,
  ) => {
    if (dateRange.roomId !== roomId || dateRange.rateCode !== planCode)
      setDateRange({
        rateCode: planCode,
        roomId: roomId,
        subRateId: subRateId,
        hotelId: hotelId,
        startDate: date,
        endDate: date,
      });
    else if (dateRange.startDate === null)
      setDateRange({ ...dateRange, startDate: date, endDate: date });
    else if (!date.isBefore(dateRange.startDate, "day")) {
      setPriceDialog(true);
      setDateRange({ ...dateRange, endDate: date });
    } else
      setDateRange({
        rateCode: "none",
        roomId: "none",
        subRateId: "none",
        hotelId: "none",
        startDate: null,
        endDate: null,
      });
  };

  const isInRange = (date: Dayjs, roomId: string, planCode: string) => {
    if (
      dateRange.roomId !== roomId ||
      dateRange.rateCode !== planCode ||
      !dateRange.startDate ||
      !dateRange.endDate
    )
      return false;
    return date.isBetween(dateRange.startDate, dateRange.endDate, "day", "[]");
  };

  const DateTemplate = ({
    date,
    roomId,
    planCode,
    subRateId,
    subPrices,
    hotelId,
    className,
  }: {
    date: Dayjs;
    roomId: string;
    planCode: string;
    subRateId: string;
    hotelId: string;
    subPrices: {
      startDate: string;
      endDate: string;
      price: number;
      planCode: string;
    }[];
    className?: string;
  }) => {
    const isSelected = isInRange(date, roomId, planCode);
    const getPrice = (date: Dayjs): number => {
      const priceEntryIndex = subPrices.findIndex((entry) => {
        const entryStartDate = dayjs(entry.startDate);
        const entryEndDate = dayjs(entry.endDate);
        return (
          date.isBetween(entryStartDate, entryEndDate, "day", "[]") ||
          date.isSame(entryStartDate) ||
          date.isSame(entryEndDate)
        );
      });

      return priceEntryIndex !== -1
        ? subPrices[priceEntryIndex]?.price ?? 0
        : 0;
    };

    const price = getPrice(date);

    return (
      <button
        type="button"
        className={cn(
          "flex flex-col items-center justify-center border-[1px] p-0.5 text-center text-[10px] hover:cursor-pointer sm:text-xs",
          isSelected && "bg-blue-600 text-white",
          className,
        )}
        onClick={() =>
          handleDateClick(date, roomId,  subRateId, planCode,hotelId)
        }
      >
        <span>{price ?? 0} €</span>
      </button>
    );
  };

  if (groupedRatePlans.isLoading)
    return (
      <div className="w-full">
        <SimpleLoader />
      </div>
    );

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
      <div className="relative flex flex-grow flex-col overflow-auto">
        {/* Header Row */}
        <div className="flex w-full bg-primary text-[8px] text-white sm:text-xs md:text-sm">
          <div className="flex h-12 w-20 shrink-0 items-center justify-center border-[1px] sm:h-16 sm:w-24 md:h-20 md:w-32">
            Rooms
          </div>
          {currentMonth.map((date, index) => (
            <div
              key={index}
              className="flex h-12 w-6 shrink-0 flex-col items-center justify-center border-[1px] sm:h-16 sm:w-8 md:h-20 md:w-[2.75rem]"
            >
              <span>{weekdayNames[date.day()]}</span>
              <span>{date.date()}</span>
            </div>
          ))}
        </div>

        {/* Content Rows */}
        {groupedRatePlans.data?.map((groupedRatePlan, index) => (
          <Collapsible key={index}>
            <CollapsibleTrigger className="w-full" asChild>
              <div className="flex">
                <div className="flex h-12 w-20 shrink-0 items-center justify-between border-[1px] bg-white p-2 sm:h-16 sm:w-24 md:h-20 md:w-32">
                  <span className="text-[8px] font-semibold sm:text-[10px] md:text-xs">
                    {groupedRatePlan.roomName}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                {currentMonth.map((_, index) => (
                  <div
                    key={index}
                    className="flex h-12 w-6 shrink-0 items-center justify-center border-[1px] p-0.5 text-center text-[10px] hover:cursor-pointer sm:h-16 sm:w-8 sm:text-xs md:h-20 md:w-[2.75rem]"
                  >
                    {groupedRatePlan.quantity}
                  </div>
                ))}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {groupedRatePlan.rates.map((ratePlan, index) => (
                <div key={`${index}-${ratePlan.rrpId}`} className="flex">
                  <div className="flex h-12 w-20 shrink-0 flex-col items-center justify-center border-[1px] bg-white p-2 sm:h-16 sm:w-24 md:h-20 md:w-32">
                    <span className="text-[8px] sm:text-[10px] md:text-xs">
                      {ratePlan.rate.name}
                    </span>
                    <span className="text-[6px] text-gray-500 sm:text-[8px] md:text-[10px]">
                      {ratePlan.hotelName}
                    </span>
                  </div>
                  {currentMonth.map((date, index) => (
                    <DateTemplate
                      planCode={ratePlan.rate.code}
                      subPrices={ratePlan.RoomPrice}
                      hotelId={ratePlan.hotelId}
                      date={date}
                      roomId={ratePlan.roomId}
                      subRateId={ratePlan.rate.ratePlanId}
                      key={index}
                      className="h-12 w-6 shrink-0 sm:h-16 sm:w-8 md:h-20 md:w-[2.75rem]"
                    />
                  ))}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <div className="hidden">
        <CreatePriceForm onSuccess={refetchData} />
      </div>
    </div>
  );
};
