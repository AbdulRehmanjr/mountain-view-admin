/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon, RocketIcon } from "@radix-ui/react-icons";
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

export const CreateHotelDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const createHotel = api.hotel.createHotel.useMutation({
    onSuccess: () => {
      form.reset();
    },
  });

  const formSubmission = (data: z.infer<typeof formSchema>) => {
    createHotel.mutate({
      hotelName: data.hotelName,
      managerName: data.manager,
      location: data.location,
      island: data.island,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hotel Information</DialogTitle>
        </DialogHeader>
        {createHotel.isSuccess && (
          <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Sucess!</AlertTitle>
            <AlertDescription>Hotel added successfully.</AlertDescription>
          </Alert>
        )}
        {createHotel.isError && (
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
            <Button type="submit" disabled={createHotel.isLoading}>
              {createHotel.isLoading ? (
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
