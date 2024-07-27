/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { api } from "~/trpc/react";
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
import {RefreshCw, SearchIcon } from "lucide-react";
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
import { EditHotelDialog } from "./EditHotelDialog";

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
      return <EditHotelDialog hotelId={hotel.hotelId} />;
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

  if (hotelData.isFetching)
    return (
      <div className="w-full">
        <Loading />
      </div>
    );

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search hotel name"
            value={
              (table.getColumn("hotelName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("hotelName")?.setFilterValue(event.target.value)
            }
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <CreateHotelDialog />
          <Button
            variant="outline"
            size="sm"
            onClick={() => hotelData.refetch()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
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
                  className="hover:bg-gray-50"
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
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
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
