"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon ,CalendarIcon} from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import dayjs from "dayjs";


const formSchema = z.object({
  title: z
    .string({ required_error: "Field is required" })
    .min(5, { message: "Title must be at least 5 characters." }),
  discount: z
    .number({ required_error: "Field is required" })
    .min(1, { message: "Atleast 1% discount is required." })
    .max(100, { message: "maximum allowed value is 100" }),
  startDate: z.date({ required_error: "Field is required" }),
  endDate: z.date({ required_error: "Field is required" }),
});

export const EditDiscountForm = ({ discountId }: { discountId: string }) => {

  const toast = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const discount = api.discount.getDiscountById.useQuery({
    discountId: discountId,
  });

  const updateDiscount = api.discount.updateDiscount.useMutation({
    onSuccess: async () => {
      toast.toast({
        title: "Data modified",
        description: "Discount information has been modified",
      });
      await discount.refetch();
    },
  });

  useEffect(() => {
    if (discount.data) {
      form.setValue("title", discount.data.title);
      form.setValue("discount", discount.data.discount);
      form.setValue("startDate",dayjs(discount.data.startDate).toDate())
      form.setValue("endDate",dayjs(discount.data.endDate).toDate())
    }
  }, [discount.data, form]);

  const formSubmitted = (values: z.infer<typeof formSchema>) => {
    updateDiscount.mutate({
      discountId: discountId,
      title: values.title,
      discount: values.discount,
      startDate:values.startDate.toISOString().split("T")[0] ?? "none",
      endDate:values.endDate.toISOString().split("T")[0] ?? "none"
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(formSubmitted)}
        className="w-full space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the title"
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
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the discount"
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
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
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
            <FormItem className="flex flex-col gap-1">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
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
        <div className="flex justify-center">
          <Button type="submit" disabled={updateDiscount.isLoading}>
            {updateDiscount.isLoading ? (
              <>
                {" "}
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Discount"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
