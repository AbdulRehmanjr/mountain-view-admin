/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";

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

import { CreateHotelDialog } from "~/app/_components/dashboard/hotel/CreateHotelDialog";
import { DeleteHotelDialog } from "~/app/_components/dashboard/hotel/DeleteHotelDialog";
import Loading from "~/app/loading";

const columns: ColumnDef<HotelProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "hotelName",
    header: "Hotel Name",
    cell: ({ row }) => <div>{row.getValue("hotelName")}</div>,
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }) => <div>{row.getValue("manager")}</div>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("location")}</div>;
    },
  },
  {
    accessorKey: "island",
    header: "Island",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("island")}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creation time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
        .toISOString()
        .split("T")[0];
      return <div className="font-medium">{date}</div>;
    },
  },
  {
    id: "actions",
    header: "Edit",
    enableHiding: false,
    cell: ({ row }) => {
      const hotel = row.original;
      return (
        <Link
          href={`hotels/${hotel.hotelId}`}
          className="flex h-full w-full items-center gap-1"
        >
          <PencilIcon className="h-3 w-3" />
          Edit
        </Link>
      );
    },
  },
];

export const HotelTable = () => {
  const hotelData = api.hotel.getAllHotelBySellerId.useQuery();

  const [data, setData] = useState<HotelProps[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (hotelData.data) setData(hotelData.data);
  }, [hotelData.data]);

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

  if (hotelData.isFetching) return <Loading />;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 py-4">
        <Input
          placeholder="Search hotel name"
          value={
            (table.getColumn("hotelName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("hotelName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <CreateHotelDialog />
          <Button variant={"outline"} onClick={() => hotelData.refetch()}>
            Refresh
          </Button>
          <DeleteHotelDialog
            hotelIds={table
              .getSelectedRowModel()
              .flatRows.flatMap((row) => row.original.hotelId)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
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
