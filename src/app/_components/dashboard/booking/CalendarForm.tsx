"use client";

import { useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { useHotelAdmin } from "~/utils/store";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export const CalendarForm = ({
  pricesData,
  totalPeople,
}: {
  pricesData: FilteredPricesProps | undefined;
  totalPeople: number;
}) => {
  const { calendar, setCalendar } = useHotelAdmin();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const currentMonth: Dayjs[][] = useMemo(() => {
    const currentMonth = selectedDate || dayjs();
    const firstDay = currentMonth.clone().startOf("month").day();
    const daysInMonth = currentMonth.daysInMonth();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const emptyDaysBefore: Dayjs[] = Array(firstDay).fill(null);
    const currentMonthDays: Dayjs[] = Array.from(
      { length: daysInMonth },
      (_, i) => dayjs(currentMonth).date(i + 1),
    );
    const calendarGrid: Dayjs[] = [...emptyDaysBefore, ...currentMonthDays];
    const weekgrid: Dayjs[][] = [];
    const chunkSize = 7;
    for (let i = 0; i < calendarGrid.length; i += chunkSize)
      weekgrid.push(calendarGrid.slice(i, i + chunkSize));
    return weekgrid;
  }, [selectedDate]);

  const handlePreviousMonth = () => {
    const newDate = selectedDate || dayjs();
    setSelectedDate(newDate.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    const newDate = selectedDate || dayjs();
    setSelectedDate(newDate.clone().add(1, "month"));
  };

  const handleDateChange = (date: Dayjs) => {
    if (calendar.startDate == null)
      setCalendar({ ...calendar, startDate: date });
    else if (
      calendar.endDate == null &&
      !date.isSame(calendar.startDate, "days")
    )
      setCalendar({ ...calendar, endDate: date });
    else if (date.isSame(calendar.startDate, "days"))
      setCalendar({
        totalPeople: 0,
        roomType: "none",
        roomId: "none",
        subRateId: "none",
        quantity: 0,
        startDate: null,
        endDate: null,
      });
  };

  const isBetween = (
    checkDate: Dayjs,
    startDate: Dayjs | null,
    endDate: Dayjs | null,
  ) =>
    checkDate.isSame(startDate, "days") ||
    checkDate.isSame(endDate, "days") ||
    (checkDate.isAfter(startDate, "days") &&
      checkDate.isBefore(endDate, "days"));

  const extractPricesForDates = (
    allDates: string[],
    prices: FilteredPricesProps | undefined,
    totalPeople: number,
  ) => {
    let totalPrice = 0;

    if (prices) {
      allDates.forEach((date) => {
        const priceObj = prices.RoomPrice.find((price) =>
          isBetween(dayjs(date), dayjs(price.startDate), dayjs(price.endDate)),
        );
        if (priceObj) {
          totalPrice +=
            totalPeople > 3
              ? priceObj.price + priceObj.price * (10 / 100)
              : priceObj.price;
        }
      });
    }
    return totalPrice * totalPeople;
  };

  const DateTemplate = ({ date }: { date: Dayjs }) => {
    if (!date) return <td className="relative border p-1 md:p-2"></td>;

    const isPast = date.isBefore(dayjs(), "day");
    const isSelected = isBetween(date, calendar.startDate, calendar.endDate);

    const calculatePrice = (priceEntry: number, incrementPercentage: number) =>
      totalPeople > 3
        ? priceEntry + priceEntry * (incrementPercentage / 100)
        : priceEntry;

    const getPrice = (date: Dayjs): number => {
      if (pricesData) {
        const priceEntry = pricesData.RoomPrice.find((data) =>
          isBetween(date, dayjs(data.startDate), dayjs(data.endDate)),
        );

        return priceEntry ? calculatePrice(priceEntry.price, 10) : 0;
      }
      return 0;
    };

    const price = getPrice(date);

    return (
      <td className="relative border p-1 md:p-2">
        <button
          type="button"
          className={cn(
            "h-full w-full",
            isSelected && "bg-blue-400 text-white",
            isPast ? "cursor-not-allowed" : "cursor-pointer",
          )}
          disabled={isPast}
          onClick={() => handleDateChange(date)}
        >
          <p className={cn("flex flex-col gap-1", isPast && "text-gray-400")}>
            <span className="text-xs md:text-sm">{date.date()}</span>
            {!isPast && price && (
              <span className="text-xs md:text-sm">{price} €</span>
            )}
          </p>
        </button>
      </td>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <Button type="button" onClick={handlePreviousMonth}>
          Prev
        </Button>
        <p className="text-lg font-bold text-gray-900 md:text-xl">
          {selectedDate
            ? selectedDate.format("MMMM YYYY")
            : dayjs().format("MMMM YYYY")}
        </p>
        <Button type="button" onClick={handleNextMonth}>
          Next
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full rounded-md bg-white">
          <thead className="border">
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <th key={day} className="p-1 text-xs md:p-2 md:text-sm">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentMonth?.map((week: Dayjs[], weekIndex: number) => (
              <tr key={weekIndex} className="text-center">
                {week.map((date: Dayjs, dateIndex: number) => (
                  <DateTemplate key={dateIndex} date={date} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
