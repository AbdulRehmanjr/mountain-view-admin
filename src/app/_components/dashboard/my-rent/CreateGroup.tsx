"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
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
import { useState } from "react";

const formSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  groupId: z.number({ required_error: "Field is Required." }),
});

export const CreateGroup = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const createGroup = api.myrent.createMyRentGroup.useMutation({
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

  const formSubmission = (data: z.infer<typeof formSchema>) => {
    createGroup.mutate({ groupId: data.groupId, groupName: data.groupName });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="default"
          className="bg-blue-700 text-white hover:bg-blue-900"
        >
          Add Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
          <DialogDescription>Enter MyRent group information</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(formSubmission)}
          >
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group ID</FormLabel>
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
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={createGroup.isLoading}
                className="bg-blue-500 text-white hover:bg-blue-700"
              >
                {createGroup.isLoading ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Add Group"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
