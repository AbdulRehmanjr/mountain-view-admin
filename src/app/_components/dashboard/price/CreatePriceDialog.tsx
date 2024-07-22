"use client";

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
import { useEffect } from "react";

const formSchema = z.object({
  startDate: z.string({ required_error: "Field is required" }),
  endDate: z.string({ required_error: "Field is required" }),
  percentInc: z.number({ required_error: "Field is required" }),
  price: z.number({ required_error: "Field is required" }),
});

interface CreatePriceFormProps {
  onSuccess: () => void;
}


export const CreatePriceForm : React.FC<CreatePriceFormProps> = ({ onSuccess }) => {
  const { dateRange, priceDialog, setDateRange, setPriceDialog } =
    useHotelAdmin();
  const toast = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const createPrice = api.price.createPrice.useMutation({
    onSuccess: () => {
      toast.toast({
        title: "Success!",
        description: "Room added successfully.",
      });
      setPriceDialog(false);
      setDateRange({ roomId: "none", startDate: null, endDate: null });
      onSuccess()
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
      startDate: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
    });
  }, [dateRange, form]);

  const formSubmitted = (data: z.infer<typeof formSchema>) => {
    createPrice.mutate({
      startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(data.endDate).format("YYYY-MM-DD"),
      roomId: dateRange.roomId,
      percentInc: data.percentInc,
      price: data.price,
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
              name="percentInc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter percentage inc for double</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter percenatage increment for large family"
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
