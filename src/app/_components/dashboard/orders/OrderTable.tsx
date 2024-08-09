"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus, RefreshCw, SearchIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TableSkeleton } from "~/app/_components/dashboard/skeletons/TableSkeletion";
import { PdfButton } from "~/app/_components/dashboard/orders/PdfButton";
import { RegisterPdfButton } from "~/app/_components/dashboard/orders//RegisterFormButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";


const columns: ColumnDef<BookingDetailProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => <div>{dayjs(row.getValue("startDate")).format('DD-MM-YYYY')}</div>,
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => <div>{dayjs(row.getValue("endDate")).format('DD-MM-YYYY')}</div>,
  },
  {
    accessorKey: "Room.roomName",
    header: "Room Name",
    cell: ({ row }) => <div>{row.original.Room.roomName}</div>,
  },
  {
    accessorKey: "Room.hotel.hotelName",
    header: "Hotel Name",
    cell: ({ row }) => <div>{row.original.Room.hotel.hotelName}</div>,
  },
  {
    accessorKey: "bookingDetails.fullName",
    header: "Guest Name",
    cell: ({ row }) => <div>{row.original.bookingDetails.fullName}</div>,
  },
  {
    accessorKey: "bookingDetails.email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.bookingDetails.email;
      const truncatedEmail = email.length > 12 
        ? email.slice(0, 12) + '...' 
        : email;
      
      return <div title={email}>{truncatedEmail}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
  
      const formatter = new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
  
      return <div>{formatter.format(row.getValue("price"))}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "mealType",
    header: "Meal type",
    cell: ({ row }) => <div>{row.getValue("mealType")}</div>,
  },
  {
    accessorKey: "isRefund",
    header: "Refund Status",
    cell: ({ row }) => (
      <div>{row.getValue("isRefund") ? "Refunded" : "Not Refunded"}</div>
    ),
  },
  {
    accessorKey: "PayPalBoookingInfo.paymentId",
    header: "Payment ID",
    cell: ({ row }) => {
      const paymentId = row.original.PayPalBoookingInfo.paymentId
      const truncatedPaymentId = paymentId.length > 12 
        ? paymentId.slice(0, 12) + '...' 
        : paymentId;
      
      return <div title={paymentId}>{truncatedPaymentId}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <PdfButton booking={booking} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <RegisterPdfButton booking={booking} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const OrderTable = () => {
  const bookings = api.booking.getAllBookingsWithDetail.useQuery();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<BookingDetailProps[]>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    if (bookings.data) setData(bookings.data);
  }, [bookings.data]);

  if (bookings.isFetching)
    return (
      <div className="w-full">
        <TableSkeleton
          headers={[
            "Booking ID",
            "Start Date",
            "End Date",
            "Room Name",
            "Hotel Name",
            "Guest Name",
            "Email",
            "Price",
          ]}
        />
      </div>
    );

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search booking ID"
            value={
              (table.getColumn("bookingId")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("bookingId")?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href={"/dashboard/bookings/manual"}>
              <Plus className="mr-2 h-4 w-4" />
              Add booking
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => bookings.refetch()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      <div className="rounded-md border bg-white shadow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
