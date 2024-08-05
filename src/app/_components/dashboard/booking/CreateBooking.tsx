"use client";
import { useForm } from "react-hook-form";
import { CalendarForm } from "~/app/_components/dashboard/booking/CalendarForm";
import { api } from "~/trpc/react";
import { useMemo, useState } from "react";
import { useHotelAdmin } from "~/utils/store";
import { extractPricesForDates, getAllDatesBetween } from "~/utils";
import dayjs, { type Dayjs } from "dayjs";
import { Button } from "~/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const formSchema = z.object({
  room: z.string({ required_error: "Field is required" }),
  quantity: z.number({ required_error: "Field is required" }),
  adults: z.number({ required_error: "Field is required" }),
  children: z.optional(z.number({ required_error: "Field is required" })),
  infants: z.optional(z.number({ required_error: "Field is required" })),
  firstName: z.string({ required_error: "Field is required" }),
  lastName: z.string({ required_error: "Field is required" }),
  email: z.string({ required_error: "Field is required" }),
  phone: z.string({ required_error: "Field is required" }),
  city: z.string({ required_error: "Field is required" }),
  country: z.string({ required_error: "Field is required" }),
  arrivalTime: z.optional(z.string({ required_error: "Field is required" })),
  postalCode: z.string({ required_error: "Field is required" }),
  address: z.string({ required_error: "Field is required" }),
});

export const BookingForm = () => {
  const pricesData = api.price.getAllPrices.useQuery();
  const rooms = api.room.getAllRoomsBySellerId.useQuery();

  const [roomQuantity, setQuantity] = useState<number>(0);
  const { dateRange, calendar, setCalendar, resetStore } = useHotelAdmin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const createBooking = api.booking.makeBooking.useMutation({
    onSuccess: () => {
      resetStore();
      form.reset();
    },
  });

  useMemo(() => {
    const roomData = rooms.data?.find(
      (room) => room.roomName === calendar.roomType,
    );
    if (roomData) setQuantity(roomData.quantity);
  }, [calendar.roomType, rooms.data]);

  const calculatePriceSum = (startDate: Dayjs, endDate: Dayjs) => {
    const allDates: string[] = getAllDatesBetween(startDate, endDate);
    const price = extractPricesForDates(
      allDates,
      pricesData.data?.get(calendar.roomId),
      calendar.totalPeople,
    );
    return price;
  };

  const formSubmited = (data: z.infer<typeof formSchema>) => {
    if (dateRange.endDate == null || dateRange.startDate == null) return;
    const price = calculatePriceSum(dateRange.startDate, dateRange.endDate);
    createBooking.mutate({
      adults: data.adults,
      children: data.children ?? 0,
      kids: data.infants ?? 0,
      name: data.firstName,
      surName: data.lastName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      country: data.country,
      type: "manual",
      startDate: dayjs(dateRange.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(dateRange.endDate).format("YYYY-MM-DD"),
      arrivalTime: data.arrivalTime ?? "none",
      postalCode: data.postalCode,
      streetName: data.address,
      price: price,
      roomId: calendar.roomId,
    });
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-6"
        onSubmit={form.handleSubmit(formSubmited)}
      >
        <Card className="col-span-1">
          <CardHeader className="text-primary">
            <CardTitle>Occupancy Information</CardTitle>
            <CardDescription>Occupancy information for room</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="adults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. of adults</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter no. of adults"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const eventValue = e.target.value;
                        if (eventValue === "") {
                          field.onChange("");
                        } else {
                          const value = Number(e.target.value);
                          if (value > 0) {
                            field.onChange(Number(value));
                            const children = form.getValues('children')
                            setCalendar({
                              ...calendar,
                              totalPeople:
                                value + (children ? children : 0),
                            });
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="children"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. of children</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter no. of children"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const eventValue = e.target.value;
                        if (eventValue === "") {
                          field.onChange("");
                        } else {
                          const value = Number(e.target.value);
                          if (value > 0) {
                            field.onChange(Number(value));
                            setCalendar({
                              ...calendar,
                              totalPeople:
                                value + +form.getValues("adults"),
                            });
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="infants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. of infants</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter no. of infants"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const eventValue = e.target.value;
                        if (eventValue === "") {
                          field.onChange("");
                        } else {
                          const value = Number(e.target.value);
                          if (value > 0) {
                            field.onChange(Number(value));
                            setCalendar({
                              ...calendar,
                              totalPeople:
                                value + +form.getValues("adults"),
                            });
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select room type</FormLabel>
                  <Select
                    defaultValue={field.value ?? ""}
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const spliting = value.split("_");
                      setCalendar({
                        ...calendar,
                        roomType: spliting[0] ?? "none",
                        roomId: spliting[1] ?? "none",
                      });
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.data?.map((room, index) => (
                        <SelectItem
                          key={index}
                          value={`${room.roomName}_${room.roomId}`}
                        >
                          {room.roomName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Quantity</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quantity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: roomQuantity }, (_, i) => (
                        <SelectItem key={i} value={`${i + 1}`}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="arrivalTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival time</FormLabel>
                  <FormControl>
                    <Input
                      className="grid"
                      {...field}
                      type="time"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="text-primary">
            <CardTitle>Booking Information</CardTitle>
            <CardDescription>Boarding information for room</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone no.</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone no."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email address"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter city name"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter country name"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter postal code"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the address"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="text-primary">
            <CardTitle>Select booking dates</CardTitle>
            <CardDescription>Booking date selection for room</CardDescription>
          </CardHeader>
          <CardContent className="grid">
            <CalendarForm
              pricesData={pricesData.data}
              roomId={calendar.roomId}
              totalPeople={calendar.totalPeople}
            />
          </CardContent>
        </Card>
        <div className="col-span-2 flex justify-center">
          <Button
            type="submit"
            disabled={createBooking.isLoading}
    
          >
            {createBooking.isLoading ? (
              <>
                {" "}
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Book"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
