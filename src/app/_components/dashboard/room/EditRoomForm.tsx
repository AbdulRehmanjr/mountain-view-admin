"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import {useLayoutEffect, useState } from "react";
import {CldUploadWidget} from "next-cloudinary";
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
  CardFooter,
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
  SelectItem
} from "~/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";



type FeatureProps = {
  label: string;
  value: string;
};

const formSchema = z.object({
  roomName: z.string({ required_error: "Field is required." }),
  beds: z.number({ required_error: "Field is required." }),
  hotel: z.string({ required_error: "Field is required." }),
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

export const EditRoomForm = ({ roomId }: { roomId: string }) => {
  const toast = useToast();
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
      setImages(info.pictures ?? []);
      setPrimary(() => info?.dp ?? "");
      setSelected(() =>
        info.features.map((feature) => ({ label: feature, value: feature })),
      );
    }
  }, [form, roomData.data]);

  const updateRoom = api.room.editRoom.useMutation({
    onSuccess: () => {
      toast.toast({
        title: "Success!",
        description: "Room added successfully.",
      });
    },
    onError: () => {
      toast.toast({
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
      description: data.description,
      beds: data.beds,
      capacity: data.capacity,
      features: selected.map((feature: FeatureProps) => feature.value),
      dp: primary,
      area: data.area,
      roomType: data.roomType,
      images: images,
      quantity: +data.quantity,
    });
  };

  return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmitted)} className="space-y-8 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Edit Room</CardTitle>
              <CardDescription>Update the details of your room.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="roomName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter room name" {...field} value={field.value ?? ''} />
                      </FormControl>
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
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the Hotel" />
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
                <FormField
                  control={form.control}
                  name="beds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. of beds</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter no. of beds" {...field} value={field.value ?? ''} />
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
                      <FormLabel>No. of people</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter no. of people" {...field} value={field.value ?? ''} />
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
                      <FormLabel>Room Area (m²)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter room area" {...field} value={field.value ?? ''} />
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
                      <FormLabel>Room quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter room quantity" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the type" />
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
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type description here."
                        className="resize-none"
                        {...field} value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Room Features</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={features}
                    value={selected}
                    onChange={setSelected}
                    labelledBy="Select features"
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url}
                          alt={`Room image ${index + 1}`}
                          width={200}
                          height={200}
                          className="object-cover w-full h-40 rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPrimary(url)}
                            className={`${
                              primary === url ? "bg-green-500" : "bg-white"
                            } mr-2`}
                          >
                            <Check className={`h-4 w-4 ${primary === url ? "text-white" : "text-green-500"}`} />
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
                </FormControl>
              </FormItem>
              <FormItem>
                <FormControl>
                  <CldUploadWidget
                    options={{ sources: ['local'], maxFiles: 5 }}
                    uploadPreset="pam101"
                    onSuccess={(result) => {
                      const info = result.info;
                      if (typeof info === 'object' && info.secure_url) {
                        setImages((prev) => [...new Set([...prev, info.secure_url])]);
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
                </FormControl>
                <FormDescription>
                  You can upload up to 5 images. Click on an image to set it as the primary image.
                </FormDescription>
              </FormItem>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button type="submit" className="w-fit" disabled={updateRoom.isLoading}>
                {updateRoom.isLoading ? "Updating..." : "Update Room"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
  );
};
