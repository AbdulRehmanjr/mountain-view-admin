"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
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
  CardFooter,
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

const formSchema = z.object({
  room: z.string({ required_error: "Field is required" }),
});

export const RateAssignForm = ({ rateId }: { rateId: string }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const rooms = api.rateplan.getAllRoomsBySellerId.useQuery({ rateId: rateId });

  const createRoomRate = api.rateplan.createRoomRatePlan.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Room added successfully.",
      });
      await rooms.refetch();
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
    const [roomId, quantity, hotelId, hotelName] = data.room.split("@");
    if (roomId && quantity && hotelId && hotelName)
      createRoomRate.mutate({
        rateId: rateId,
        roomId: roomId,
        quantity: +quantity,
        hotelId: hotelId,
        hotelName: hotelName,
      });
  };

  if (rooms.data?.length == 0)
    return (
      <div className="w-full">
        <strong className="text-red-600 text-2xl">This rate plan is assigned to all rooms</strong>
      </div>
    );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formSubmitted)}
        className="w-full space-y-8"
      >
        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">Rooms to assign</CardTitle>
              <CardDescription>
                Select room to assign a rate plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a room</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.data?.map((room) => (
                          <SelectItem
                            value={`${room.roomId}@${room.quantity}@${room.hotelHotelId}@${room.hotel.hotelName}`}
                            key={room.roomId}
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
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-center">
                <Button
                  type="submit"
                  className="w-full max-w-md"
                  disabled={createRoomRate.isLoading}
                >
                  {createRoomRate.isLoading ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Add rooom to rate plan"
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
};
