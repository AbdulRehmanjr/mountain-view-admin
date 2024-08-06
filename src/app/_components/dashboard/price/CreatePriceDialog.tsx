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
import { Select, SelectContent, SelectItem,  SelectTrigger, SelectValue } from "~/components/ui/select";


const formSchema = z.object({
  startDate: z.string({ required_error: "Field is required" }),
  endDate: z.string({ required_error: "Field is required" }),
  ratePlan: z.string({ required_error: "Field is required" }),
  price: z.number({ required_error: "Field is required" }),
});

interface CreatePriceFormProps {
  onSuccess: () => void;
}

export const CreatePriceForm: React.FC<CreatePriceFormProps> = ({  onSuccess}) => {

  const toast = useToast();
  const { dateRange, priceDialog, setDateRange, setPriceDialog } = useHotelAdmin();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const ratePlans = api.rateplan.getRatePlanBySellerId.useQuery()
  const createPrice = api.price.createPrice.useMutation({
    onSuccess: () => {
      toast.toast({
        title: "Success!",
        description: "Room added successfully.",
      });
      setPriceDialog(false);
      setDateRange({ roomId: "none", hotelId:'none',subRateId:'none',startDate: null, endDate: null });
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
    form.reset({
      startDate: dayjs(dateRange.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(dateRange.endDate).format("YYYY-MM-DD"),
    });
  }, [dateRange, form]);

  const formSubmitted = (data: z.infer<typeof formSchema>) => {
    createPrice.mutate({
      startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(data.endDate).format("YYYY-MM-DD"),
      roomId: dateRange.roomId,
      ratePlan: data.ratePlan,
      price: data.price,
      hotelId:dateRange.hotelId
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
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="YYYY-MM-DD"
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
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="YYYY-MM-DD"
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
                name="ratePlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rate plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ratePlans.data?.map((ratePlan,index) => (
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
