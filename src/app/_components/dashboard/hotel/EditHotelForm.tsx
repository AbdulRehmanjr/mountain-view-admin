"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "~/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "~/components/ui/select";
import { useEffect } from "react";

const hotels = [
  { value: 1, label: "Hotel" },
  { value: 2, label: "Motel" },
  { value: 3, label: "Vacational Rental" },
];

const formSchema = z.object({
  hotelName: z.string({ required_error: "Field is required" }),
  island: z.string({ required_error: "Field is required" }),
  address: z.string({ required_error: "Field is required" }),
  hotelType: z.string({ required_error: "Field is required" }),
  longitude: z.number({ required_error: "Field is required" }),
  latitude: z.number({ required_error: "Field is required" }),
  description: z.string({ required_error: "Field is required" }),
  firstName: z.string({ required_error: "Field is required" }),
  lastName: z.string({ required_error: "Field is required" }),
  email: z.string({ required_error: "Field is required" }),
  phone: z.string({ required_error: "Field is required" }),
  checkIn: z.string({ required_error: "Field is required" }),
  checkOut: z.string({ required_error: "Field is required" }),
});

export const EditHotelForm = ({ hotelId }: { hotelId: string }) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const hotel = api.hotel.getHotelById.useQuery({ hotelId: hotelId });

  const updateHotel = api.hotel.updateHotelInfoById.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Room added successfully.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Oop!",
        description: "Something went wrong.",
      });
    },
  });

  useEffect(() => {
    const data = hotel.data;
    if (data) {
      form.setValue("hotelName", data.hotelName);
      form.setValue("hotelType", data.type + "");
      form.setValue("island", data.island);
      form.setValue("address", data.address);
      form.setValue("longitude", data.longitude);
      form.setValue("latitude", data.latitude);
      form.setValue("description", data.description);
      form.setValue("firstName", data.firstName);
      form.setValue("lastName", data.lastName);
      form.setValue("email", data.email);
      form.setValue("phone", data.phone);
      form.setValue("checkIn", data.checkIn);
      form.setValue("checkOut", data.checkOut);
    }
  }, [form, hotel.data]);
  const formSubmitted = (data: z.infer<typeof formSchema>) => {
    updateHotel.mutate({
      hotelId: hotelId,
      hotelCode: hotel.data?.code ?? "none",
      hotelName: data.hotelName,
      island: data.island,
      address: data.address,
      hotelType: data.hotelType,
      longitude: data.longitude,
      latitude: data.latitude,
      description: data.description,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formSubmitted)}
        className="w-full space-y-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">Hotel information</CardTitle>
              <CardDescription>
                Enter the basic details of the hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="hotelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter hotel name"
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
                name="hotelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hotel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotels.map((hotel) => (
                          <SelectItem
                            value={`${hotel.value}`}
                            key={hotel.value}
                          >
                            {hotel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="island"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Island</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the island name"
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
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={`Enter the longitude`}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                              field.onChange(
                                value === "" ? undefined : parseFloat(value),
                              );
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
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={`Enter the latitude`}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                              field.onChange(
                                value === "" ? undefined : parseFloat(value),
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter hotel description"
                        {...field}
                        value={field.value ?? ""}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="h-fit shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">Hotel owner details</CardTitle>
              <CardDescription>
                Enter the basic details of the hotel owner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter the email"
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the phone no."
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
          <Card className="h-fit shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">
                Hotel check in/out timing
              </CardTitle>
              <CardDescription>
                Add default check in and checkou out timing for hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check in</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="Enter the island name"
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
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check out</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="Enter the island name"
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
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full max-w-md"
            disabled={updateHotel.isLoading}
          >
            {updateHotel.isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Create hotel"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
