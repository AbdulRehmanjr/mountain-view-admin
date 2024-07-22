"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useState } from "react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "~/components/ui/use-toast";
import { MultiSelect } from "react-multi-select-component";
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

type FeatureProps = {
  label: string;
  value: string;
};

const formSchema = z.object({
  roomName: z.string({ required_error: "Field is required" }),
  price: z.number({ required_error: "Field is required" }),
  hotel: z.string({ required_error: "Field is required" }),
  beds: z.number({ required_error: "Field is required" }),
  capacity: z.number({ required_error: "Field is required" }),
  roomArea: z.number({ required_error: "Field is required" }),
  quantity: z.number({ required_error: "Field is required" }),
  roomType: z.string({ required_error: "Field is required" }),
  description: z.string({ required_error: "Field is required" }),
});

const features: FeatureProps[] = [
  { label: "Balcony", value: "Balcony" },
  { label: "Garden view", value: "Garden view" },
  { label: "Pool view", value: "Pool view" },
  { label: "Mountain view", value: "Mountain view" },
  { label: "Air condition", value: "Air condition" },
  { label: "Own bathroom(ensuite)", value: "Own bathroom(ensuite)" },
  { label: "Flat - screen TV", value: "Flat - screen TV" },
  { label: "Terrace", value: "Terrace" },
  { label: "Minibar", value: "Minibar" },
  { label: "Safe", value: "Safe" },
  { label: "Free Wifi", value: "Free Wifi" },
  { label: "Hairdryer", value: "Hairdryer" },
  { label: "Tea & coffee", value: "Tea & coffee" },
];
export const CreateRoomForm = () => {
  const { toast } = useToast();
  const [allow, setAllow] = useState<boolean>(false);
  const [urls, setUrls] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [selected, setSelected] = useState<FeatureProps[]>([]);

  const hotelData = api.hotel.getAllHotelBySellerId.useQuery();

  const createRoom = api.room.createRoom.useMutation({
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

  const formSubmitted = (data: z.infer<typeof formSchema>) => {
    if (allow != true || selected.length == 0) {
      toast({
        variant: "destructive",
        title: "Oop!",
        description: "Please atleast upload one image.",
      });
      return;
    }
    createRoom.mutate({
      roomName: data.roomName,
      description: data.description,
      hotelId: data.hotel,
      beds: +data.beds,
      capacity: +data.capacity,
      area: +data.roomArea,
      roomType: data.roomType,
      features: selected.map((feature: FeatureProps) => feature.value),
      images: urls,
      number: +data.quantity,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmitted)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Room Information</CardTitle>
              <CardDescription>
                Enter the basic details of the room
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="roomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter room name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter room description"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Room Capacity</CardTitle>
              <CardDescription>
                Specify the room&apos;s capacity details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="beds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Beds</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of beds"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter room capacity"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Area (sqm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter room area"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Rooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of rooms"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Room Type & Features</CardTitle>
              <CardDescription>
                Select room type, hotel, and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="deluxe">Deluxe Room</SelectItem>
                        <SelectItem value="superior">Superior Room</SelectItem>
                        <SelectItem value="family">Family Room</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hotel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a hotel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hotelData.data?.map((hotel) => (
                          <SelectItem key={hotel.hotelId} value={hotel.hotelId}>
                            {hotel.hotelName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Room Features</FormLabel>
                <MultiSelect
                  options={features}
                  value={selected}
                  onChange={setSelected}
                  labelledBy="Select features"
                  className="w-full"
                />
              </FormItem>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Room Images</CardTitle>
            <CardDescription>Upload images of the room</CardDescription>
          </CardHeader>
          <CardContent>
          <CldUploadWidget
                options={{ sources: ["local"] }}
                uploadPreset="pam101"
                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                  const info = result.info;
                  if (typeof info != "string")
                    setUrls((prev) => {
                      const flag = prev.every(
                        (image) => image != info?.secure_url,
                      );
                      if (flag) prev.push(info?.secure_url ?? "");
                      return prev;
                    });
                  setAllow(true);
                }}
              >
                {({ open }) => {
                  function handleOnClick() {
                    open();
                  }
                  return (
                    <Button type="button" onClick={handleOnClick}>
                      Upload Image
                    </Button>
                  );
                }}
              </CldUploadWidget>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full max-w-md"
            disabled={!allow || createRoom.isLoading}
          >
            {createRoom.isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Creating Room...
              </>
            ) : (
              "Create Room"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
