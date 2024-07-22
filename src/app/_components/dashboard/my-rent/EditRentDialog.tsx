import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { PencilIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const formSchema = z.object({
  groupName: z.string({ required_error: "Field is required" }),
  groupId: z.number({ required_error: "Field is required" }),
});

export const EditGroup = ({ info }: { info: MyRentGroupProps }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupId: info.groupId,
      groupName: info.groupName,
    },
  });
  const updateGroup = api.myrent.updateRentGroup.useMutation({
    onSuccess: () => {
      form.reset();
    },
  });

  const formSubmission = (data: z.infer<typeof formSchema>) => {
    updateGroup.mutate({
      id: info.id,
      groupId: data.groupId,
      groupName: data.groupName,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant={"outline"}>
          <PencilIcon className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>MyRent Information</DialogTitle>
          <DialogDescription>
            Information regarding myrent for integration.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(formSubmission)}
          >
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Enter group name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter group name"
                      {...field}
                      type="text"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Enter group id </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter group ID"
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = parseInt(value, 10);
                        if (!isNaN(parsedValue) && parsedValue > 0)
                          field.onChange(parsedValue);
                        else field.onChange("");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-center">
              <Button type="submit" disabled={updateGroup.isLoading}>
                {updateGroup.isLoading ? (
                  <>
                    {" "}
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
