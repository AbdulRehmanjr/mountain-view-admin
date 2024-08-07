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
import { useMemo } from "react";

const formSchema = z.object({
  rateName: z.string({ required_error: "Field is required" }),
  hotelId: z.string({ required_error: "Field is required" }),
  roomId: z.string({ required_error: "Field is required" }),
  description: z.string({ required_error: "Field is required" }),
});

export const RateAssignForm = ({ rateId }: { rateId: string }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const rooms = api.room.getAllRoomsBySellerId.useQuery();

  const editRatePlan = api.rateplan.updateRatePlan.useMutation({
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
    return;
  };

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
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a room</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room " />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.data?.map((room) => (
                          <SelectItem
                            value={`${room.roomId}`}
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
            <CardFooter >
              <div className="flex justify-center w-full">
                <Button
                  type="submit"
                  className="w-full max-w-md"
                  disabled={editRatePlan.isLoading}
                >
                  {editRatePlan.isLoading ? (
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
