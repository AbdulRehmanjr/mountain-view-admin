"use client";

import { useEffect } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useHotelAdmin } from "~/utils/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";

const formSchema = z.object({
  startDate: z.date({ required_error: "Field is required" }),
  endDate: z.date({ required_error: "Field is required" }),
  ratePlan: z.string({ required_error: "Field is required" }),
  price: z.number({ required_error: "Field is required" }),
});

interface CreatePriceFormProps {
  onSuccess: () => void;
}

export const CreatePriceForm: React.FC<CreatePriceFormProps> = ({
  onSuccess,
}) => {
  const toast = useToast();
  const { dateRange, priceDialog, setDateRange, setPriceDialog } =
    useHotelAdmin();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const ratePlans = api.rateplan.getRatePlanBySellerId.useQuery();
  const createPrice = api.price.createPrice.useMutation({
    onSuccess: () => {
      toast.toast({
        title: "Success!",
        description: "Room added successfully.",
      });
      setPriceDialog(false);
      setDateRange({
        rateCode: "none",
        roomId: "none",
        hotelId: "none",
        subRateId: "none",
        startDate: null,
        endDate: null,
      });
      onSuccess();
    },
    onError: () => {
      toast.toast({
        variant: "destructive",
        title: "Oop!",
        description: "Something went wrong.",
      });
    },
  });

  useEffect(() => {
    form.setValue('startDate',dayjs(dateRange.startDate ?? new Date()).toDate())
    form.setValue('endDate',dayjs(dateRange.endDate ?? new Date()).toDate())
    form.setValue('ratePlan',dateRange.rateCode)
  }, [dateRange, form]);

  const formSubmitted = (data: z.infer<typeof formSchema>) => {
    createPrice.mutate({
      startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(data.endDate).format("YYYY-MM-DD"),
      roomId: dateRange.roomId,
      ratePlan: data.ratePlan,
      rateId: dateRange.subRateId,
      price: data.price,
      hotelId: dateRange.hotelId,
    });
  };

  return (
    <Dialog open={priceDialog} onOpenChange={setPriceDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Price</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add price</DialogTitle>
          <DialogDescription>
            Add price for different time period for rooms
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(formSubmitted)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ratePlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger disabled>
                        <SelectValue placeholder="Select a rate plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ratePlans.data?.map((ratePlan, index) => (
                        <SelectItem key={index} value={ratePlan.code}>
                          {ratePlan.name}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter room price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter room price"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          (/^\d+$/.test(value) && parseInt(value) > 0)
                        ) {
                          field.onChange(value === "" ? "" : parseInt(value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createPrice.isLoading}>
              {createPrice.isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Add price"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
``;
