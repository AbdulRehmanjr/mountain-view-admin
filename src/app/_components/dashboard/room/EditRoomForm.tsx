"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useLayoutEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { MultiSelect } from "react-multi-select-component";
import Image from "next/image";
import { Check, Trash, UploadCloud } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";

type FeatureProps = {
  label: string;
  value: string;
};

const formSchema = z.object({
  roomName: z.string({ required_error: "Field is required." }),
  beds: z.number({ required_error: "Field is required." }),
  hotel: z.string({ required_error: "Field is required." }),
  price: z.number({ required_error: "Field is required." }),
  area: z.number({ required_error: "Field is required." }),
  capacity: z.number({ required_error: "Field is required." }),
  quantity: z.number({ required_error: "Field is required." }),
  roomType: z.string({ required_error: "Field is required." }),
  description: z.string({ required_error: "Field is required." }),
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

const roomTypes = [
  { id: 1, type: "Apartment" },
  { id: 4, type: "Quadruple" },
  { id: 5, type: "Suite" },
  { id: 7, type: "Triple" },
  { id: 8, type: "Twin" },
  { id: 9, type: "Double" },
  { id: 10, type: "Single" },
  { id: 12, type: "Studio" },
  { id: 13, type: "Family" },
  { id: 25, type: "Dormitory room" },
  { id: 26, type: "Bed in Dormitory" },
  { id: 27, type: "Bungalow" },
  { id: 28, type: "Chalet" },
  { id: 29, type: "Holiday home" },
  { id: 31, type: "Villa" },
  { id: 32, type: "Mobile home" },
  { id: 33, type: "Tent" },
  { id: 34, type: "Powered/Unpowered Site" },
  { id: 35, type: "King" },
  { id: 36, type: "Queen" },
];

export const EditRoomForm = ({ roomId }: { roomId: string }) => {
  const { toast } = useToast();
  const [primary, setPrimary] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [selected, setSelected] = useState<FeatureProps[]>([]);

  const roomData = api.room.getRoomById.useQuery({ roomId: roomId });
  const hotelData = api.hotel.getAllHotelBySellerId.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useLayoutEffect(() => {
    const info = roomData.data;
    if (info) {
      form.setValue("roomName", info.roomName);
      form.setValue("description", info.description);
      form.setValue("beds", info.beds);
      form.setValue("area", info.area);
      form.setValue("capacity", info.capacity);
      form.setValue("hotel", info.hotelHotelId);
      form.setValue("roomType", info.roomType);
      form.setValue("quantity", info.quantity);
      form.setValue("price", info.price);
      setImages(info.pictures ?? []);
      setPrimary(() => info?.dp ?? "");
      setSelected(() =>
        info.features.map((feature) => ({ label: feature, value: feature })),
      );
    }
  }, [form, roomData.data]);

  const updateRoom = api.room.editRoom.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Room updated successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Oop!",
        description: "Something went wrong.",
      });
    },
  });

  const removeImage = (index: number) => {
    if (roomData.data?.pictures) {
      const newImages = [
        ...roomData.data.pictures.slice(0, index),
        ...roomData.data.pictures.slice(index + 1),
      ];
      setImages(() => newImages);
      roomData.data?.pictures.splice(index, 1);
    }
  };

  const formSubmitted = (data: z.infer<typeof formSchema>) => {
    updateRoom.mutate({
      roomId: roomId,
      roomName: data.roomName,
      hotelId: data.hotel,
      price: data.price,
      description: data.description,
      beds: data.beds,
      capacity: data.capacity,
      features: selected.map((feature: FeatureProps) => feature.value),
      dp: primary,
      area: data.area,
      roomType: data.roomType,
      images: images,
      quantity: data.quantity,
      code: roomData.data?.code ?? "none",
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
                      <Input
                        placeholder="Enter room name"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter room description"
                        {...field}
                        value={field.value ?? ""}
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
                    <FormLabel>Room Price (Default)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter price"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "" ||
                            (/^\d+$/.test(value) && parseInt(value) > 0)
                          ) {
                            field.onChange(
                              value === "" ? undefined : parseInt(value),
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="text-primary">
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
                        placeholder="Enter number of beds"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "" ||
                            (/^\d+$/.test(value) && parseInt(value) > 0)
                          ) {
                            field.onChange(
                              value === "" ? undefined : parseInt(value),
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Capacity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter room capacity"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "" ||
                            (/^\d+$/.test(value) && parseInt(value) > 0)
                          ) {
                            field.onChange(
                              value === "" ? undefined : parseInt(value),
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
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Area (sqm)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter room area"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "" ||
                            (/^\d+$/.test(value) && parseInt(value) > 0)
                          ) {
                            field.onChange(
                              value === "" ? undefined : parseInt(value),
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Rooms</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter number of rooms"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "" ||
                            (/^\d+$/.test(value) && parseInt(value) > 0)
                          ) {
                            field.onChange(
                              value === "" ? undefined : parseInt(value),
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="text-primary">
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypes.map((roomType) => (
                          <SelectItem value={roomType.type} key={roomType.id}>
                            {roomType.type}
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
          <CardHeader className="text-primary">
            <CardTitle className="text-2xl">Room Images</CardTitle>
            <CardDescription>Manage images of the room</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((url, index) => (
                <div key={index} className="group relative">
                  <Image
                    src={url}
                    alt={`Room image ${index + 1}`}
                    width={200}
                    height={200}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPrimary(url)}
                      className={`${
                        primary === url ? "bg-green-500" : "bg-white"
                      } mr-2`}
                    >
                      <Check
                        className={`h-4 w-4 ${primary === url ? "text-white" : "text-green-500"}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImage(index)}
                      className="bg-white"
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <CldUploadWidget
                options={{ sources: ["local"], maxFiles: 5 }}
                uploadPreset="pam101"
                onSuccess={(result) => {
                  const info = result.info;
                  if (typeof info === "object" && info.secure_url) {
                    setImages((prev) => [
                      ...new Set([...prev, info.secure_url]),
                    ]);
                  }
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open()}
                    className="w-fit"
                  >
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Images
                  </Button>
                )}
              </CldUploadWidget>
            </div>
            <FormDescription className="mt-2">
              You can upload up to 5 images. Click on an image to set it as the
              primary image.
            </FormDescription>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full max-w-md"
            disabled={updateRoom.isLoading}
          >
            {updateRoom.isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Updating Room...
              </>
            ) : (
              "Update Room"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
