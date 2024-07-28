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
import {
  PencilIcon,
  Plus,
  RefreshCw,
  SearchIcon,
} from "lucide-react";
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

import { DeleteRoomPopups } from "~/app/_components/dashboard/room/DeleteRoomPopup";
import { TableSkeleton } from "~/app/_components/dashboard/skeletons/TableSkeletion";

const columns: ColumnDef<RoomDetailProps>[] = [
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
    accessorKey: "roomName",
    header: "Room Name",
    cell: ({ row }) => <div>{row.getValue("roomName")}</div>,
  },
  {
    accessorKey: "roomType",
    header: "Room Type",
    cell: ({ row }) => <div>{row.getValue("roomType")}</div>,
  },
  {
    accessorKey: "hotelName",
    header: "Hotel Name",
    cell: ({ row }) => {
      const hotel = row.original.hotel.hotelName;
      return <div className="font-medium">{hotel}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("quantity")}</div>;
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("capacity")}</div>;
    },
  },
  {
    accessorKey: "beds",
    header: "Beds",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("beds")}</div>;
    },
  },

  {
    accessorKey: "area",
    header: "Area (sqm)",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("area")}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const room = row.original;
      return (
        <Button variant={"outline"} asChild>
          <Link href={`rooms/edit/${room.roomId}`}>
            <PencilIcon className="mr-2 h-3 w-3" />
            Edit
          </Link>
        </Button>
      );
    },
  },
];

export const RoomTable = () => {
  const roomData = api.room.getAllRoomsBySellerId.useQuery();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<RoomDetailProps[]>([]);

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
    if (roomData.data) setData(roomData.data);
  }, [roomData.data]);

  if (roomData.isFetching)
    return (
      <div className="w-full">
        <TableSkeleton headers={["Room Name",'Room Type','Hotel Name','Quantity','Capacity','Beds','Area']} />
      </div>
    );

  return (
    <div className="w-full ">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search room name"
            value={
              (table.getColumn("roomName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("roomName")?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href={"/dashboard/rooms/create"}>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => roomData.refetch()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <DeleteRoomPopups
            roomIds={table
              .getSelectedRowModel()
              .flatRows.map((row) => row.original.roomId)}
          />
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
