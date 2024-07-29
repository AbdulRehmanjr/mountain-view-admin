import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "~/components/ui/card";

export const CalendarSkeleton = () => {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daysInMonth = 31;

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {weekdays.map((day) => (
            <div key={day} className="text-center font-medium">
              <Skeleton className="mx-auto h-6 w-12" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: daysInMonth }).map((_, index) => (
            <div key={index} className="h-10 w-14">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
