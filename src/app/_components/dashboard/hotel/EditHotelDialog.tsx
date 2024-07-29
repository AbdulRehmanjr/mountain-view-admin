/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon, RocketIcon } from "@radix-ui/react-icons";
import { PencilIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormField,
  FormMessage,
  FormLabel,
  FormControl,
  FormItem,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const formSchema = z.object({
  hotelName: z.string({ required_error: "Field is required." }),
  manager: z.string({ required_error: "Field is required." }),
  location: z.string({ required_error: "Field is required." }),
  island: z.string({ required_error: "Field is required." }),
});

export const EditHotelDialog = ({ hotelId }: { hotelId: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const hotelData = api.hotel.getHotelById.useQuery({ hotelId: hotelId });
  const updateHotel = api.hotel.updateHotelInfoById.useMutation();

  useMemo(() => {
    const info = hotelData.data;
    if (info) {
      form.setValue("hotelName", info.hotelName);
      form.setValue("island", info.island);
      form.setValue("location", info.location);
      form.setValue("manager", info.manager);
    }
  }, [form, hotelData.data]);

  const formSubmission = (data: z.infer<typeof formSchema>) => {
    updateHotel.mutate({
      hotelId: hotelData.data?.hotelId ?? "none",
      hotelName: data.hotelName,
      manager: data.manager,
      location: data.location,
      island: data.island,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PencilIcon className="mr-2 h-3 w-3" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-primary">
          <DialogTitle>Hotel Information</DialogTitle>
        </DialogHeader>
        {updateHotel.isSuccess && (
          <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Sucess!</AlertTitle>
            <AlertDescription>Hotel added successfully.</AlertDescription>
          </Alert>
        )}
        {updateHotel.isError && (
          <Alert variant={"destructive"}>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Oop!</AlertTitle>
            <AlertDescription>Something went wrong.</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form
            onClick={form.handleSubmit(formSubmission)}
            className="grid gap-6"
          >
            <FormField
              control={form.control}
              name="hotelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter hotel name"
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
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter manager name"
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter location"
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
              name="island"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Island</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter island name"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={updateHotel.isLoading}>
              {updateHotel.isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Add hotel"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
