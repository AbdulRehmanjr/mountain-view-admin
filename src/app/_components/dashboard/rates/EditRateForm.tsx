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
import { useMemo } from "react";

const formSchema = z.object({
  rateName: z.string({ required_error: "Field is required" }),
  hotelId: z.string({ required_error: "Field is required" }),
  mealId: z.string({ required_error: "Field is required" }),
  description: z.string({ required_error: "Field is required" }),
});

type MealPlanType = {
  code: number;
  name: string;
};

const mealPlanTypes: MealPlanType[] = [
  { code: 1, name: "All inclusive" },
  { code: 2, name: "BreakFast" },
  { code: 3, name: "Lunch" },
  { code: 4, name: "Dinner" },
  { code: 5, name: "American" },
  { code: 6, name: "Bed & breakfast" },
  { code: 7, name: "Buffet breakfast" },
  { code: 8, name: "Caribbean breakfast" },
  { code: 9, name: "Continental breakfast" },
  { code: 10, name: "English breakfast" },
  { code: 11, name: "European plan" },
  { code: 12, name: "Family plan" },
  { code: 13, name: "Full board" },
  { code: 14, name: "Half board/modified American plan" },
  { code: 15, name: "Room only (Default)" },
  { code: 16, name: "Self catering" },
  { code: 17, name: "Bermuda" },
  { code: 18, name: "Dinner bed and breakfast plan" },
  { code: 19, name: "Family American" },
  { code: 20, name: "Modified" },
  { code: 21, name: "Breakfast & lunch" },
];

export const RateEditForm = ({ rateId }: { rateId: string }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const rateData = api.rateplan.getRateById.useQuery({ rateId: rateId });

  useMemo(() => {
    const info = rateData.data;
    if (info) {
      form.setValue("rateName", info.name);
      form.setValue("description", info.description);
      form.setValue("hotelId", info.hotelHotelId);
      form.setValue("mealId", info.mealId + "");
    }
  }, [form, rateData.data]);

  const hotelData = api.hotel.getAllHotelBySellerId.useQuery();

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
    editRatePlan.mutate({
      rateId: rateId,
      rateName: data.rateName,
      code: rateData.data?.code ?? "none",
      description: data.description,
      mealId: +data.mealId,
      hotelId: data.hotelId,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formSubmitted)}
        className="w-full space-y-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">Rate plan Information</CardTitle>
              <CardDescription>
                Enter the basic details of the rate plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="rateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate plan name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter rate plan name"
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
                    <FormLabel>Rate plan description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter rate plan description"
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

          <Card className="shadow-md">
            <CardHeader className="text-primary">
              <CardTitle className="text-2xl">Hotel & Meal</CardTitle>
              <CardDescription>
                Select hotel and meal type for rate plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="mealId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a meal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mealPlanTypes.map((meal) => (
                          <SelectItem value={`${meal.code}`} key={meal.code}>
                            {meal.name}
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
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
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
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full max-w-md"
            disabled={editRatePlan.isLoading}
          >
            {editRatePlan.isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Creating plan...
              </>
            ) : (
              "Create rate plan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
